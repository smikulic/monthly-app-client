# Monthly App - Client

This project is a React + TypeScript client application bootstrapped with **Vite** for lightning-fast development.

## Prerequisites

* **Node.js** v22.15.0 (as specified in `package.json`)
* **npm** v9+ or **yarn** v1.22+

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up environment variables**

   Create a `.env.development` file in the project root:

   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

   And a `.env.production` if you have a production backend URL:

   ```env
   VITE_API_URL=<PROD_URL>/api
   ```

   > All environment variables exposed to client code **must** be prefixed with `VITE_`.

3. **Run in development mode**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Vite will start a dev server on `http://localhost:3000` (default) with hot module replacement.

4. **Preview production build**

   ```bash
   npm run build
   npm run preview
   # or
   yarn build
   yarn preview
   ```

   The `build` command outputs optimized assets to the `build/` directory, and `preview` serves them locally.

## Scripts

* `npm run dev` or `npm run start` — start Vite dev server
* `npm run build` — create production build
* `npm run preview` — preview production build locally
* `npm run codegen` — generate GraphQL types/hooks
* `npm run test` — run unit tests with Vitest
* `npm run test:coverage` — run tests with coverage report

## Vite Configuration

The Vite config is in `vite.config.ts`. Key points:

* **React plugin** via `@vitejs/plugin-react`
* **Path alias**: `@/` → `src/`
* **Server port**: 3000
* **Build output**: `build/`

## TypeScript Configuration

* Type checking via Vite’s built-in TS support
* Path aliases mirrored in `tsconfig.json`:

  ```jsonc
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
    }
  }
  ```

## Testing

* Tests are written with **Vitest** and **React Testing Library**.
* Use `src/setupTests.ts` for global mocks and matchers.

## Linting & Formatting

(If applicable, add ESLint and Prettier notes here.)

## Contributing

* Fork the repo, create a feature branch, and open a pull request.
* Ensure all tests pass and follow existing code style.

