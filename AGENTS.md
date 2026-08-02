# Agent Guide

GitHub Action - [action.yml](action.yml)

- `src/` - is the source directory (single `index.ts` file)
- `dist/` - is built by rollup

## Libraries

- TOML v1.1.0 - https://toml.io/en/v1.1.0
- smol-toml - https://github.com/squirrelchat/smol-toml
- jsonpath-plus - https://github.com/JSONPath-Plus

## Commands

ALWAYS use the `npm run *` command

| Command            | Purpose                                 |
| ------------------ | --------------------------------------- |
| `npm run build`    | Rollup `src/index.ts` → `dist/index.js` |
| `npm run lint`     | ESLint on `src/`                        |
| `npm run prettier` | ALWAYS RUN AFTER EDITING FILES          |
