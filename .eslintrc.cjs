module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:svelte/recommended",
  ],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }      
    }
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "extraFileExtensions": [".svelte"]
  },
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    "eqeqeq": ["error", "always"],
    "semi": ["error", "never", {"beforeStatementContinuationChars": "never"}],
    "semi-spacing": ["error", {"after": true, "before": false}],
    "semi-style": ["error", "first"],
    "no-extra-semi": "error",
    "no-unexpected-multiline": "error",
    "no-unreachable": "error",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_",
      "destructuredArrayIgnorePattern": "^_",
    }],
  },
  settings: {
    'svelte3/typescript': require('typescript'), // pass the TypeScript package to the Svelte plugin
    "svelte3/ignore-warnings": (/** @type {{ code: string; }} */ warning) => {
      return warning.code === "a11y-click-events-have-key-events"
    }
  },
}
