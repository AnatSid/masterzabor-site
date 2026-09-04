# Codex Instructions for masterzabor.by

This file is the stable project-level operating contract for Codex work in this
repository. Keep it short. Do not turn it into the roadmap, knowledge base, or a
history log.

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: read version-matched docs before coding

Before any Next.js work, find and read the relevant local documentation in
`node_modules/next/dist/docs/`. The installed `next` package is the source of
truth for this project's framework behavior.

<!-- END:nextjs-agent-rules -->

## Sources of Truth

Use this priority order:

1. Actual repository state.
2. `docs/PROJECT-ROADMAP-TRACKER.md` for current stages, status, and open risks.
3. `PROJECT-KNOWLEDGE-BASE.md` for architecture and historical decisions.
4. Historical docs and `.cursorrules` only when relevant.

For stage work, read the roadmap first. Read only the relevant Knowledge Base
sections unless the task genuinely needs full historical context.

## Production and Domain Invariants

- Production/canonical runtime host is `https://www.masterzabor.by`.
- Canonical page URL style is no trailing slash.
- Apex `https://masterzabor.by` is a redirect alias to `www`.
- Telegram webhook must stay on `https://www.masterzabor.by/api/telegram-webhook`.
- Never add a `www -> apex` redirect.
- Do not change Vercel domain architecture without a separate domain task/audit.
- Keep sitemap, robots, metadata, OpenGraph, JSON-LD, breadcrumbs, and internal
  canonical links aligned with final no-slash `www` URLs.

## Scope Discipline

- Work only inside the current stage scope.
- Do not do opportunistic refactors.
- Do not redesign approved UI/content without an explicit task.
- Do not change neighboring pages, analytics, Telegram, or domain behavior for
  cleanup unless the current task requires it.
- Preserve user changes already present in the worktree.

## Git and Deployment

- Use a separate branch named like `codex/<stage-id>-<meaning>` for stage work.
- Stage branch work may be committed and pushed for Vercel Preview.
- Do not push or merge `main` without explicit user approval.
- Before merging to `main`, state that it will trigger Vercel Production.
- After production deployment, wait before smoke checks and verify production.
- Mark a stage done only after the required agent checks and user approval pass.
- Do not stage unrelated local files or user-modified files.

## Local Development

- Main local URL is `http://localhost:3000`.
- Keep one dev server unless a task explicitly requires otherwise.
- Do not start a second server just because port `3000` is already in use; inspect
  the running server first.
- Project memory says not to run `npm run build` concurrently with `npm run dev`
  because this repo has had broken `.next` cache incidents. Keep that conservative
  local rule unless a separate tooling task changes it.
- If localhost breaks with missing `.next` chunks or 500s, stop relevant node
  processes, remove `.next`, start one `npm run dev`, wait for Ready, and check `/`.
- Never commit `.env.local`, `.next`, `.tmp`, `.cursor`, `.playwright-mcp`,
  browser profiles, or other local artifacts.

## Verification Philosophy

Verification must be proportional to risk.

- Docs-only changes: no full build required unless docs affect generated output.
- TypeScript/React changes: run `npm run lint` and relevant runtime checks.
- Routing/config/framework changes: run `npm run build`.
- UI changes: browser check plus relevant mobile viewport.
- SEO/canonical changes: curl/HTTP/HTML/schema checks.
- Next runtime issues: use Next DevTools MCP, especially `get_errors`,
  `get_routes`, `get_project_metadata`, and logs when needed.
- Production-impacting stages: local checks, Vercel Preview checks, user approval,
  then production smoke only after approved merge/deploy.

Stage prompts may add stricter checks for the current task.

## Existing Tooling Baseline

Use the existing stack before adding anything new:

- Next DevTools MCP on the running dev server.
- Codex in-app browser / CUA and screenshots for visual checks.
- PowerShell terminal, git, curl, Node tooling, and Vercel CLI.
- `code-reviewer` for risky or multi-file changes.
- `web-design-guidelines` for UI/visual stages.
- SEO and Vercel skills only for SEO/deployment/debug stages.

Do not add MCP servers, plugins, dependencies, hooks, CI, Playwright, Lighthouse,
or custom Skills without a separate user decision.

## Keep Outside This File

Keep detailed backlog, city lists, project records, photo source maps, old commit
SHAs, OAuth/analytics runbooks, stage acceptance criteria, and long SEO/content
recommendations in the roadmap, Knowledge Base, and task-specific prompts.
