# Geography Ninja — Frontend

Vite + React 19 app. See the top-level `README.md` and `SETUP.md` for
deployment and environment variables.

## Scripts

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview the production build
npm run lint
```

## Environment

- `VITE_API_URL` — URL of the FastAPI backend. Falls back to the
  deployed Railway URL if unset.
