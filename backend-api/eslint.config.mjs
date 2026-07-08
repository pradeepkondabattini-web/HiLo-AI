// ESLint 9 flat config (EOS-001-P6 §15). Static analysis is enforced in CI.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'no-console': 'error', // use the structured logger, never console (EOS-000 §27)
    },
  },
  {
    // Test files may use console and relax a few rules.
    files: ['**/*.test.ts', '**/test/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  prettier,
);
