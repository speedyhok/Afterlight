# AFTERLIGHT release checklist

Use this checklist when moving a local source release toward GitHub Pages. This project has not been pushed or deployed as part of this release-hardening pass.

## Dependency setup

1. Use Node.js 20 or newer.
2. Run `npm install` once dependencies are reachable. Commit the generated `package-lock.json` so future CI installs can use `npm ci` reproducibly. The current source bundle does not contain a lockfile because package installation was unavailable during validation.

## Automated checks

```bash
npm run test:campaign
npm run build
npm run preview
```

The campaign test runs the story map validator, all five act route/ending tests, character-beat references, city-scene rules, delayed-decision mechanics, audio behavior, and save migration. Do not consider the release ready if the production build fails.

## Browser smoke tests

- Start a new campaign, make a decision, refresh, and continue; verify the story resumes coherently.
- Load a save created by an earlier source release; verify its resources, history, evidence, relationships, and pending consequences are preserved.
- Test each ending and confirm only **The First Morning** shows the complete natural-sunrise scene.
- Test desktop width and narrow mobile width; preserve the two-panel desktop layout and stacked mobile panels.
- Verify sound is off on first launch, settings persist, and enabling sound after a player gesture works.
- Verify reduced-motion preferences suppress the animated layers and that the controls remain keyboard accessible.
- Verify the GitHub Pages base path `/Afterlight/` loads JS, CSS, and navigation correctly.

## Data and recovery

- Saves remain local to the current browser/device; they do not automatically sync between devices.
- Keep a copy of an existing save before a manual reset or major gameplay migration.
- Do not replace a currently deployed repository from a source archive until its current branch and workflow have been reviewed.
