This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

In all interactions and commit messages, be extremely concise and sacrifice grammar for the sake of concision.

## GitHub

- Primary method for interacting with GitHub: GitHub CLI.

## Git

- Branch prefix: `feature/` or `bug/` depending on nature of work.
- `main` is protected — always create a new branch for work.

## Api Endpoints schema

There is a shared/ folder adjacent to this repo and it contains an openapi.json export from the fastApi api service

## Tech Stack

- Vue 3 + Vite + TypeScript
- PrimeVue (theme: "none", styled via tailwindcss-primeui plugin)
- Tailwind CSS v3
- Pinia for state management
- Playwright for e2e tests

## Styling

- Use Tailwind v3 utility classes
- PrimeVue component styles in `src/assets/primevue/`
- Theme customization via CSS variables in `src/assets/main.css`
- Custom palette: primary (purple), surface (gray), danger, success, info, warn

## Development Rules

- Use PrimeVue components whenever possible
- PrimeVue docs: `https://primevue.org/{component}.md`
- Follow DRY principles
- Interfaces in `types/`, derived from constants when appropriate
- Reusable patterns go in composables, not components
- No speculative/convenience code — every line must be called
- No re-exports or abstractions unless requested
- Follow existing project patterns exactly; don't introduce new ones without consultation
- Use npm for package management
- Prettier for formatting
- Never use type `any`

## Testing

- Unit tests sit beside the file: `[Name].unit.spec.js`
- Use `@vue/test-utils`
- Quality over quantity
