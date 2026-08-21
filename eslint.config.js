import { defineConfig } from "eslint/config"
import globals from "globals"
import js from "@eslint/js"
import ts from "typescript-eslint"
import svelte from "eslint-plugin-svelte"
import svelteConfig from "./svelte.config.js"

export default defineConfig(
  js.configs.recommended,
  ts.configs.recommended,
  svelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
        svelteConfig,
      },
    },
  },
  {
    rules: {
      "eqeqeq": ["error", "always"],
      "semi": ["error", "never", { "beforeStatementContinuationChars": "never" }],
      "semi-spacing": ["error", { "after": true, "before": false }],
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

      // See Also: https://github.com/sveltejs/eslint-plugin-svelte/issues/1271
      "svelte/prefer-svelte-reactivity": "off",
    },
  },
)
