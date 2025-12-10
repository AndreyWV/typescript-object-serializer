const eslint = require('@eslint/js');
const path = require('path');
const globals = require('globals');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    files: [
      './src/**/*.ts',
      './tests/**/*.ts'
    ],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
      globals: {
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...require('@typescript-eslint/eslint-plugin').configs.recommended.rules,

      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowIIFEs: true,
        },
      ],

      '@typescript-eslint/no-explicit-any': [
        'warn',
        {
          ignoreRestArgs: true,
          fixToUnknown: false,
        },
      ],

      'max-len': [
        'error',
        {
          code: 120,
          ignoreStrings: true,
          ignoreUrls: true,
          ignoreRegExpLiterals: true,
          tabWidth: 2,
        },
      ],

      'operator-linebreak': [
        'error',
        'before',
      ],

      'multiline-ternary': [
        'error',
        'always',
      ],

      'object-curly-spacing': [
        'error',
        'always',
      ],

      quotes: [
        'error',
        'single',
      ],

      semi: [
        'error',
        'always',
      ],

      'no-console': [
        'error',
      ],

      'comma-dangle': [
        'error',
        'always-multiline',
      ],

      complexity: [
        'error',
        {
          max: 6,
        },
      ],

      '@typescript-eslint/no-shadow': 'error',
    },
  },
];
