import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';
import * as importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: [
      '**/node_modules',
      '**/build/',
      '**/dist/',
      '**/.cache/',
      '**/playwright-report/',
      '**/coverage/',
      '**/.vscode/',
      '**/*.log',
      '**/.DS_Store',
      '**/eslint.config.mjs',
      '**/lint-staged.config.mjs',
      '**/simple-git-hooks.mjs',
      '**/tsconfig.json',
      '**/tailwind.config.ts',
      '**/worker-configuration.d.ts',
      '**/audit-ci.jsonc',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  eslintPluginBetterTailwindcss.configs.recommended, // Rules enforcing best practices and consistency using Tailwind CSS.
  jsxA11y.flatConfigs.recommended, // Static AST checker for accessibility rules on JSX elements.
  prettier, // Turns off all rules that are unnecessary or might conflict with Prettier.
  {
    plugins: {
      'react-refresh': reactRefresh,
      import: importPlugin, // Linting of ES2015+ (ES6+) import/export syntax.
      'simple-import-sort': simpleImportSort, // Enforce consistent import order – like the name says it's a simple option to sort imports.
      'prefer-arrow-functions': preferArrowFunctions, // Enforce the use of arrow functions whenever possible or necessary.
    },
    rules: {
      '@typescript-eslint/only-throw-error': ['off'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' }, // Enforce the use of type imports e.g. import type { Foo } from 'foo';
      ],
      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        {
          allowedNames: [], // Array of names that are allowed to be named functions
          allowObjectProperties: true, // Allow named methods
        },
      ],
      'react/jsx-no-leaked-render': [
        'error',
        {
          validStrategies: ['ternary', 'coerce'],
        },
      ],
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off', // Enforce consistent line wrapping for tailwind classes – seems confusing in practice
      'better-tailwindcss/no-unknown-classes': 'warn',
      'import/no-default-export': 'warn', // This rule is applied to encourages the use of named exports in the interest of consistency – if there's a reason to have a default export then use a default export, otherwise use named exports.
      'import/order': 'off', // This rule is deprecated in favor of simple-import-sort/imports.
      'import/first': 'error', // Enforce that import declarations are always put at the top of the file.
      'import/newline-after-import': 'error', // Enforce a newline after import statements.
      'import/no-duplicates': 'error', // Reports if a resolved path is imported more than once.
      'simple-import-sort/imports': 'error', // Enforce a consistent order for import statements.
      'simple-import-sort/exports': 'error', // Enforce a consistent order for export
    },
  },
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/styles/theme.css',
      },
    },
  },
];
