# Bump Version

Analyze recent git changes and update the application version in `src/config/changelog.json`.

## Steps

### 1. Get the changes

Run the following commands to understand what was modified:

```bash
git diff HEAD~1 HEAD --stat
git diff HEAD~1 HEAD --name-only
git log -1 --pretty="%s%n%b"
```

If there are no previous commits (first commit), use:
```bash
git diff --cached --stat
git diff --cached --name-only
```

### 2. Read the current state

Read `src/config/changelog.json` to get the current version and existing entries.

### 3. Classify the impact

Analyze the modified files and decide the impact level:

**MINOR (increment the second number, reset the third to 0):**
- A new module or feature was created from scratch
- A new page or route was added to the application
- A new main business component was created
- File examples: new folders in `src/features/`, new `*Page.tsx` files, new routes in `AppRoutes.tsx`

**PATCH (increment only the third number):**
- Changes to existing components, hooks, or services
- Bug fixes or UI adjustments
- Changes to configuration, types, or schemas
- Refactors or performance improvements
- File examples: modifications to already-existing files

### 4. Calculate the new version

Parse the current version (e.g. "1.2.5") and apply the rule:
- **MINOR**: `1.2.5` → `1.3.0`
- **PATCH**: `1.2.5` → `1.2.6`

### 5. Identify the affected route

Determine the main application route that corresponds to the change:
- Login/Auth → `/login`
- Dashboard → `/dashboard`
- Jira Tickets → `/tickets/jira`
- User Tickets → `/tickets/usuario`
- Ticket Admin → `/administracion/tickets`
- Agents → `/seguridad/agentes`
- Clients → `/configuracion/clientes`
- Healthy/Monitoring → `/healthy/modulos`
- Multiple routes → `/`

### 6. Generate the changelog entry

Create an object with this structure:

```json
{
  "version": "<new version>",
  "date": "<today's date in YYYY-MM-DD format>",
  "type": "<minor|patch>",
  "summary": "<concise description in Spanish of what was done and why, max 2 sentences>",
  "route": "<main affected route>",
  "changes": [
    "<specific change 1 in Spanish>",
    "<specific change 2 in Spanish>",
    "..."
  ]
}
```

### 7. Update the file

Edit `src/config/changelog.json`:
- Insert the new entry at the **beginning** of the `entries` array (position 0)
- Update the root `version` field with the new version

### 8. Stage the file

```bash
git add src/config/changelog.json
```

### 9. Report the result

Inform the user:
- The previous version and the new version
- The change type (MINOR or PATCH)
- The generated summary
- That the file is staged and ready to commit
