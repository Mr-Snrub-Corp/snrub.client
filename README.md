# mot.frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### End-to-End Tests

E2E tests live in [`Mr-Snrub-Corp/snrub.e2e`](https://github.com/Mr-Snrub-Corp/snrub.e2e) — not this repo. This allows the same test suite to run against the Vue, React, and Angular versions of the app.

On pull request, `.github/workflows/e2e.yml` dispatches a `client-pr` event to `snrub.e2e` with the branch name. Results appear in the `snrub.e2e` Actions tab.

> **TODO:** report E2E pass/fail back to the client PR via the GitHub commit status API.

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Next dev steps

// need to modify the httpService.ts to properly handle HTTP error status codes.
// setup some error interceptor

// fiel upload validation (dimensions, size, format)
