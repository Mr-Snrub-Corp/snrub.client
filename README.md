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

### Run End-to-End Tests with [Playwright](https://playwright.dev)

E2E tests run against the real API — no mocks.

**Prerequisites:**

1. Install Playwright browsers (first time only):

```sh
npx playwright install
```

2. Start the API stack (from the `snrub.api` repo):

```sh
docker compose up
```

3. Create `.env.e2e` in the project root (gitignored):

```
E2E_TEST_USER_EMAIL=w.smithers@snrub-corp.io
E2E_TEST_USER_PASSWORD=<seed user password>
```

**Running tests:**

```sh
# All browsers
npm run test:e2e

# Chromium only (fastest)
npm run test:e2e -- --project=chromium

# Specific file
npm run test:e2e -- e2e/auth.spec.ts

# Debug mode (headed, step through)
npm run test:e2e -- --debug

# Show HTML report after run
npx playwright show-report
```

Tests use the [Page Object Model](https://playwright.dev/docs/pom) pattern — page classes live in `e2e/pages/`.

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Next dev steps

// need to modify the httpService.ts to properly handle HTTP error status codes.
// setup some error interceptor

// fiel upload validation (dimensions, size, format)
