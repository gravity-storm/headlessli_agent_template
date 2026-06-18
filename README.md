# Headless.li Agent Skill

Build websites from a headless CMS using AI — powered by the Headless.li MCP server and the `@qoh` ecosystem.

## Step 1 — Set up your CMS

You need a live Headless CMS populated with structured data. We provide a pre-configured DatoCMS template to get you started instantly. If you already have a CMS setup you can use that instead.

[Clone DatoCMS Project](https://dashboard.datocms.com/clone?projectId=194886&name=Headless.li+Starter)

Next, open your new (or pre-existing) DatoCMS dashboard, navigate to **Project Settings → API Tokens**, and copy your **Read-only API token**.

## Step 2 — Create a Headless.li token

Headless.li acts as the secure bridge between your CMS and the AI agent.

1. Register a new account at [headless.li](https://headless.li) or log in with your existing one.
2. Click **Settings** to open the settings page.
3. Click **Create Token**.
4. Fill in the details:
   - Enter a name of your choosing.
   - Enter the target CMS URL (e.g. `https://graphql.datocms.com`).
   - Enter the CMS token if your CMS requires one (e.g. the DatoCMS API token from Step 1).
5. Click **Create** and copy the displayed Headless.li token immediately to a safe place — it will not be shown again.

## Step 3 — Install the skill

Create a new empty folder for your project and open a shell in that folder, then run:

```bash
npx skills add gravity-storm/headlessli_agent_template
```

## Step 4 — Run the skill

Open the folder in your agentic tool of choice and run:

```
/headlessli
```

The agent will ask for your Headless.li token and configure everything once you provide it. After that, restart your agentic tool and open a new session — this is required for it to discover the MCP server.

Once restarted, run `/headlessli` again to start building.

## Supported CMS systems

Any GraphQL-based headless CMS works: DatoCMS, Contentful, Storyblok, Hygraph, and similar.

---

<details>
<summary>Security scanner warnings explained</summary>

Automated security scanners flag this skill as "high risk." Here's what each warning actually means:

**COMMAND_EXECUTION** — The skill runs `npm install`, `npx kill-port`, and `taskkill` to manage a local dev server. This is standard web development tooling, no different from any Next.js tutorial.

**EXTERNAL_DOWNLOADS** — Component code is fetched via `npx shadcn`. This is the official shadcn/ui installation method used by millions of projects.

**DATA_EXFILTRATION** — Your Headless.li token is saved to `.env` and `opencode.json` on your own machine to authenticate with the MCP server. It never leaves your local environment. Storing secrets in `.env` is the industry-standard practice.

**PROMPT_INJECTION** — The skill reads rendered pages from your local dev server to verify they load correctly. The CMS content is yours — you control it. This is not an attack surface in any realistic threat model.

**REMOTE_CODE_EXECUTION** — One scanner reported that zod `4.4.3` does not exist on npm. It does. It is the current stable release.

</details>
