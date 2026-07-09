import { AppError, createDocumentMetadata, touchDocumentMetadata } from '@hilo/backend-shared';
import {
  canTransitionQuote,
  DEFAULT_QUOTE_VALIDITY_DAYS,
  QuoteStatus,
  type Quote,
  type QuoteActor,
} from '../domain/quote.js';
import type { Clock, QuoteRepository, VendorRepository } from '../domain/repositories.js';

/** Request a quotation from a vendor (EOS-002-P3-Part-06 §12). */
export class RequestQuoteUseCase {
  constructor(
    private readonly quotes: QuoteRepository,
    private readonly vendors: VendorRepository,
    private readonly clock: Clock,
    private readonly validityDays: number = DEFAULT_QUOTE_VALIDITY_DAYS,
  ) {}

  async execute(params: {
    requesterUid: string;
    vendorId: string;
    eventId?: string;
    message?: string;
  }): Promise<Quote> {
    const vendor = await this.vendors.findById(params.vendorId);
    if (!vendor || vendor.deleted) throw AppError.notFound('Vendor not found');
    if (vendor.ownerUid === params.requesterUid) {
      throw AppError.badRequest('You cannot request a quote from your own listing');
    }

    const now = this.clock.now();
    const expiresAt = new Date(now.getTime() + this.validityDays * 24 * 60 * 60 * 1000);
    const metadata = createDocumentMetadata({
      id: `quo_${params.vendorId}_${params.requesterUid}_${now.getTime()}`,
      actorId: params.requesterUid,
      status: QuoteStatus.Requested,
      now,
    });

    const quote: Quote = {
      ...metadata,
      vendorId: params.vendorId,
      requesterUid: params.requesterUid,
      vendorOwnerUid: vendor.ownerUid,
      eventId: params.eventId,
      message: params.message,
      expiresAt: expiresAt.toISOString(),
    };
    return this.quotes.create(quote);
  }
}

/**
 * Drive the quote state machine (EOS-002-P3-Part-06 §12, §24). The caller's role is
 * derived from the quote itself (requester vs vendor owner); invalid transitions and
 * third parties are rejected. Expiry is applied lazily when a quote is past its validity.
 */
export class TransitionQuoteUseCase {
  constructor(
    private readonly quotes: QuoteRepository,
    private readonly clock: Clock,
  ) {}

  async execute(params: {
    actorUid: string;
    quoteId: string;
    target: QuoteStatus;
    proposedAmount?: number;
  }): Promise<Quote> {
    let quote = await this.quotes.findById(params.quoteId);
    if (!quote || quote.deleted) throw AppError.notFound('Quote not found');

    quote = await this.applyLazyExpiry(quote);

    const actor: QuoteActor | null =
      params.actorUid === quote.requesterUid
        ? 'requester'
        : params.actorUid === quote.vendorOwnerUid
          ? 'vendor'
          : null;
    if (!actor) throw AppError.forbidden('You are not a party to this quote');

    const from = quote.status as QuoteStatus;
    if (!canTransitionQuote(from, params.target, actor)) {
      throw AppError.conflict(`Cannot move a quote from "${from}" to "${params.target}"`);
    }
    if (
      (params.target === QuoteStatus.Submitted || params.target === QuoteStatus.Negotiating) &&
      params.proposedAmount !== undefined &&
      params.proposedAmount <= 0
    ) {
      throw AppError.validation('proposedAmount must be greater than 0');
    }

    const updated: Quote = {
      ...quote,
      status: params.target,
      ...(params.proposedAmount !== undefined ? { proposedAmount: params.proposedAmount } : {}),
    };
    return this.quotes.update(touchDocumentMetadata(updated, params.actorUid, this.clock.now()));
  }

  private async applyLazyExpiry(quote: Quote): Promise<Quote> {
    const terminal: QuoteStatus[] = [
      QuoteStatus.Accepted,
      QuoteStatus.Declined,
      QuoteStatus.Expired,
    ];
    if (terminal.includes(quote.status as QuoteStatus)) return quote;
    if (new Date(quote.expiresAt).getTime() > this.clock.now().getTime()) return quote;
    return this.quotes.update(
      touchDocumentMetadata({ ...quote, status: QuoteStatus.Expired }, 'system', this.clock.now()),
    );
  }
}

/** The caller's quotes — as requester and (if a business) as vendor owner. */
export class ListMyQuotesUseCase {
  constructor(private readonly quotes: QuoteRepository) {}

  async execute(uid: string): Promise<{ requested: Quote[]; received: Quote[] }> {
    const [requested, received] = await Promise.all([
      this.quotes.listByRequester(uid),
      this.quotes.listByVendorOwner(uid),
    ]);
    return { requested, received };
  }
}
