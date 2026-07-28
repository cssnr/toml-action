# Agent Guide

GitHub Action - [action.yml](action.yml)

- `src/` - is the source directory (single `index.ts` file)
- `dist/` - is built by rollup

## Commands

ALWAYS use the `npm run *` command

| Command            | Purpose                                 |
| ------------------ | --------------------------------------- |
| `npm run build`    | Rollup `src/index.ts` → `dist/index.js` |
| `npm run lint`     | ESLint on `src/`                        |
| `npm run prettier` | ALWAYS RUN AFTER EDITING FILES          |
