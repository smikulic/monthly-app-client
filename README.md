# Monthly App - Client

This project is a React + TypeScript client application bootstrapped with **Vite** for lightning-fast development.

It's live on https://yourmonthly.app/ and feel free to use Demo account if you don't wish to register yourself :)
```
email: demo@example.com
password: password123
```

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

## Component Architecture

This project uses the **Barrel Export Patter (otherwise knows as Facade Pattern)n** for UI components to create a consistent abstraction layer over Material-UI. And if we want to switch from Material-UI to another library, we only change *ONE* file instead of hundreds!

### Pattern Overview
- Wrap external library components in `src/components/ui/`
- Use path aliases (`@/`) for clean imports
- Enable easy customization and library migration

### Example

```typescript
// src/components/ui/Avatar.tsx
import { Avatar as MuiAvatar, AvatarProps } from "@mui/material";

export const Avatar: React.FC<AvatarProps> = (props) => (
  <MuiAvatar {...props} />
);
```

```typescript
// Usage in components
import { Avatar } from "@/components/ui/Avatar";

// Instead of direct Material-UI import:
// import { Avatar } from "@mui/material";
```

### Benefits
- **Consistent API**: Single interface for all UI components
- **Easy Migration**: Change library by updating wrapper files only
- **Custom Defaults**: Add styling/behavior without changing imports
- **Design System**: Enforce consistent theming across the app

## Testing

* Tests are written with **Vitest** and **React Testing Library**.
* Use `src/setupTests.ts` for global mocks and matchers.

## Linting & Formatting

(If applicable, add ESLint and Prettier notes here.)

## Contributing

* Fork the repo, create a feature branch, and open a pull request.
* Ensure all tests pass and follow existing code style.

