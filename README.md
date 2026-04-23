# Green Future AI Impact Calculator

Static Vite + React + TypeScript app for GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

## Production build

```bash
npm run build
```

If you deploy the site under a GitHub Pages subpath instead of a root custom domain, set:

```bash
VITE_BASE_PATH=/your-repo-name/ npm run build
```

For a root custom domain or a subdomain like `greenfuture.dingo.coffee`, leave `VITE_BASE_PATH` unset so the app builds with `/`.
