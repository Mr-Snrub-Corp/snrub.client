---
type: "always_apply"
---

# PrimeVue Component Guidelines

## Architecture

- PrimeVue is configured with **no theme** (`theme: "none"`)
- Styling uses the **tailwindcss-primeui** plugin integration
- Component-specific styles are in `src/assets/primevue/` directory

## Styling Approach

- Use Tailwind v3 utility classes for styling
- Component styles are defined in individual CSS files (e.g., `src/assets/primevue/button.css`)
- Theme customization uses CSS variables defined in `src/assets/main.css`
- Custom color palette includes: primary (purple shades), surface (gray shades), danger, success, info, warn
- Colors are accessible via CSS variables (e.g., `var(--p-primary-700)`) and Tailwind classes (e.g., `text-primary-700`)

## PrimeVue Documentation Lookup

When looking up PrimeVue component documentation:

1. **Preferred method**: Use Context7's `get-library-docs` tool with library ID `/websites/primevue_org` (1476 snippets, score 83.6) or `/llmstxt/primevue_llms_llms_txt` (1945 snippets, score 77.7)
2. **Direct URL lookup**: Append `.md` to component URLs for LLM-friendly Markdown (e.g., `https://primevue.org/button.md`, `https://primevue.org/datatable.md`)
3. **Full documentation index**: Available at `https://primevue.org/llms-full.txt`

Example Context7 query for DataTable:

- Library ID: `/websites/primevue_org`
- Topic: "DataTable sorting filtering pagination"
