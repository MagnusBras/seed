// @ts-check
import { base } from './base.mjs';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tseslint from 'typescript-eslint';

/** @type {import("typescript-eslint").ConfigArray} */
export const nextjs = tseslint.config(
  { ignores: ['.next/**', 'out/**', 'next-env.d.ts', 'vitest.config.ts'] },
  ...nextVitals,
  ...nextTs,
  ...base,
);
