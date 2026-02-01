---
type: "always_apply"
---

# MOT Frontend Repository Overview

This is a Vue 3 + Vite + TypeScript frontend application.

## 🏗️ Project Structure

mot.frontend/
├── src/
│ ├── assets/ # Static assets, CSS, and PrimeVue component styles
│ ├── components/ # Reusable Vue components
│ ├── constants/
│ ├── router/
│ ├── services/ # API services and HTTP client
│ ├── stores/ # Pinia state management stores
│ ├── types/ # TypeScript type definitions
│ └── views/ # Page-level components
│ ├── auth/ # Authentication views
│ └── dashboard/ # Dashboard views
├── public/ # Public static assets
├── e2e/ # End-to-end tests (Playwright)
└── [config files] # Vite, TypeScript, Tailwind, ESLint, etc.
