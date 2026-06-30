# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Authentication (Amplify Cognito)

- Login is implemented with Amplify Auth (Cognito) using email + password.
- Public route: `/`
- Protected routes: `/assessment`, `/diagnosis`, `/analysis`, `/result`
- App loads Auth config from `/amplify_outputs.json` at runtime.

### Dev test account policy

- Do not hardcode passwords, API keys, or secrets in frontend code.
- For local verification, create a Cognito test user manually (example email: `test@example.com`).
- Password must be set only in Cognito/User Pool management.
