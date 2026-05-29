// @ts-check
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { base } from './base.mjs';

/** @type {import("typescript-eslint").ConfigArray} */
export const nestjs = tseslint.config(
  { ignores: ['dist/**', 'drizzle/**', 'eslint.config.mjs', 'drizzle.config.ts', 'vitest.config.ts'] },
  ...base,
  {
    languageOptions: {
      globals: { ...globals.node },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);
