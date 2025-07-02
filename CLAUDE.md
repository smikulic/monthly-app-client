# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
# Install dependencies
yarn install

# Start development server (port 3000)
yarn dev

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage

# Generate GraphQL types and hooks
yarn codegen

# Build for production
yarn build

# Preview production build
yarn preview
```

### Testing Single Files
```bash
# Run a specific test file
yarn test src/components/Button/Button.test.tsx

# Run tests in watch mode for a specific file
yarn test --watch src/components/Button/Button.test.tsx
```

## Architecture Overview

### Tech Stack
- **React 19.1.0** with TypeScript
- **Vite** for build tooling
- **Apollo Client** for GraphQL state management
- **Material-UI v7** for UI components
- **Vitest** for testing

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── [feature]/      # Feature components with co-located:
│       ├── *.tsx       # Component
│       ├── *-style.ts  # Styled components (Emotion)
│       ├── *-queries.tsx # GraphQL queries
│       └── *.test.tsx  # Tests
├── pages/              # Page containers
├── generated/          # GraphQL codegen output
├── hooks/              # Custom React hooks
└── utils/              # Utility functions
```

### Key Patterns
1. **Container Pattern**: Pages use container components (e.g., `pages/Home/HomeContainer.tsx`)
2. **Styled Components**: Use Emotion with pattern `ComponentName-style.ts`
3. **GraphQL Integration**: Queries/mutations co-located with components as `*-queries.tsx`
4. **Path Alias**: Use `@/` for imports from `src/` (e.g., `import Button from '@/components/ui/Button'`)

### GraphQL Development
- Schema URL: `http://localhost:3001`
- Run `yarn codegen` after modifying any `.graphql` files or GraphQL operations
- Generated hooks are in `src/generated/graphql.tsx`

### Environment Variables
- Must be prefixed with `VITE_`
- Development: `.env.development`
- Production: `.env.production`
- Main variable: `VITE_API_URL`

### Testing Guidelines
- Tests use Vitest + React Testing Library
- Mock localStorage is set up globally in `src/setupTests.ts`
- Component tests should be co-located as `*.test.tsx`

### Authentication
- Token-based authentication stored in localStorage
- Token key: `token`
- User data key: `user`