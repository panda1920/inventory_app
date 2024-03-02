/** @typedef {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'prettier',
  ],
  ignorePatterns: ['/*.js'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    // https://mui.com/material-ui/guides/minimizing-bundle-size/#option-one-use-path-imports
    'no-restricted-imports': ['error', { patterns: ['@mui/*/*/*'] }],
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external'],
        pathGroups: [{ pattern: '@/**', group: 'internal' }],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
        warnOnUnassignedImports: true,
      },
    ],
    'import/newline-after-import': ['warn', { count: 1, considerComments: true }],
  },
}
