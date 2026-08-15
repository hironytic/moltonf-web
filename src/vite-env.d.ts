/// <reference types="svelte" />
/// <reference types="vite/client" />

// vite/client.d.ts recognizes ".postcss" as CSS at runtime (see CSS_LANGS_RE)
// but doesn't declare an ambient module for it.
declare module "*.postcss" {}
