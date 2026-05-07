import eslint from '@eslint/js';
import pluginJs from '@eslint/js';
import globals from 'globals';
import js from '@eslint/js';
import path from 'path';
import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import importNewLines from 'eslint-plugin-import-newlines';
import stylistic from '@stylistic/eslint-plugin';

const dirname = import.meta.dirname;

/** @type {import('eslint').Linter.Config[]} */
export default [

  js.configs.recommended,
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: [
      './src/**/*.ts',
      './tests/**/*.ts'
    ],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: path.join(dirname, 'tsconfig.json'),
      },
      globals: {
        ...globals.jest,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      'import-newlines': importNewLines,
      '@stylistic': stylistic,
    },
    rules: {

      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowIIFEs: true,
        },
      ],

      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          fixToUnknown: false,
        },
      ],

      '@typescript-eslint/no-shadow': 'error',

      '@typescript-eslint/prefer-readonly': 'error',

      // Отключаем базовое правило, чтобы не было конфликтов
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          enableAutofixRemoval: {
            imports: true,
          },
        },
      ],

      'curly': [
        'error',
        'all',
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

      'array-element-newline': [
        'error',
        'always',
      ],

      'array-bracket-newline': [
        'error',
        {
          minItems: 1,
        },
      ],

      'object-curly-newline': [
        'error',
        {
          ObjectExpression: {
            multiline: true,
            minProperties: 1,
          },
          ObjectPattern: {
            multiline: true,
          },
          ImportDeclaration: {
            multiline: true,
            minProperties: 2,
          },
          ExportDeclaration: 'never',
        },
      ],

      'object-property-newline': [
        'error',
        {
          allowAllPropertiesOnSameLine: false,
        },
      ],

      'max-lines-per-function': [
        'error',
        {
          'max': 56,
          'skipBlankLines': false,
          'skipComments': false,
        },
      ],

      'max-lines': [
        'error',
        {
          'max': 500,
          'skipBlankLines': false,
          'skipComments': false,
        },
      ],

      'eqeqeq': [
        'error',
        'always',
      ],

      // Отключаем базовое правило, чтобы не было конфликтов
      'sort-imports': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              '^@',
              '^\\w',
              '^~',
              '^/',
              '^\\.',
            ],
          ],
        },
      ],

      'import-newlines/enforce': [
        'error',
        {
          items: 1,
        },
      ],

      '@stylistic/brace-style': [
        'error',
        '1tbs',
      ],

      '@stylistic/space-before-blocks': [
        'error',
        'always',
      ],

      'space-before-function-paren': [
        'error',
        {
          'anonymous': 'always',
          'named': 'never',
          'asyncArrow': 'always',
        },
      ],

      '@stylistic/lines-between-class-members': [
        'error',
        {
          enforce: [
            {
              blankLine: 'always',
              prev: '*',
              next: '*',
            },
          ],
        },
      ],

      '@stylistic/no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxBOF: 0,
          maxEOF: 1,
        },
      ],

      '@stylistic/newline-per-chained-call': [
        'error',
        {
          ignoreChainWithDepth: 1,
        },
      ],

      '@stylistic/padded-blocks': [
        'error',
        {
          'classes': 'always',
          'blocks': 'always',
        },
      ],

      '@stylistic/indent': [
        'error',
        2,
      ],

      'space-infix-ops': [
        'error',
      ],

      '@stylistic/key-spacing': [
        'error',
        {
          'beforeColon': false,
          'afterColon': true,
        },
      ],

      '@stylistic/type-annotation-spacing': [
        'error',
        {
          'after': true,
        },
      ],

      '@stylistic/no-trailing-spaces': 'error',

      'no-magic-numbers': [
        'error',
        {
          ignore: [
            0,
            1,
            -1,
          ],
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreArrayIndexes: true,
        },
      ],

      'func-call-spacing': [
        'error',
        'never',
      ],

      'comma-spacing': [
        'error',
        {
          'before': false,
          'after': true,
        },
      ],

      'keyword-spacing': [
        'error',
        {
          'before': true,
        },
      ],

      'no-multi-spaces': [
        'error'
      ],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: [
            'variable',
            'parameter'
          ],
          modifiers: [
            'unused'
          ],
          format: null,
          custom: {
            regex: '^_+$',
            match: true,
          },
        },
        {
          selector: [
            'variable',
            'function',
            'parameter',
            'property'
          ],
          format: [
            'camelCase',
            'UPPER_CASE'
          ],
          leadingUnderscore: 'allowSingleOrDouble',
          trailingUnderscore: 'forbid',
          custom: {
            regex: '^[a-zA-Z0-9_]+$',
            match: true,
          },
        },
        {
          'selector': [
            'class',
            'interface',
          ],
          'format': [
            'PascalCase',
          ],
        },
        /**
         * Отключаем валидацию нейминга для параметров объектов в кавычках
         * Сюда попадают параметры компонента `host: {}`
         */
        {
          selector: [
            'objectLiteralProperty',
            'typeProperty',
            'classProperty',
          ],
          modifiers: [
            'requiresQuotes',
          ],
          format: null,
        },
      ],
    },
  },

  {
    files: [
      './tests/**/*.ts'
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'max-lines-per-function': 'off',
      'max-lines': 'off',
      'no-magic-numbers': 'off',
    },
  },
];
