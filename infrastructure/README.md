# infrastructure/

Infrastructure as Code — Terraform for Google Cloud Platform (Cloud Run, Firestore,
Pub/Sub, Cloud Storage, Secret Manager, Artifact Registry, BigQuery, IAM, networking).

Secrets are never stored here; they live in Secret Manager / GitHub Secrets. `*.tfstate`
and `*.tfvars` are git-ignored.

Populated as environments are provisioned.
