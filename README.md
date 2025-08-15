## AI Context Window Visualizer

An interactive Next.js app that demonstrates how an AI agent fills its context window over time. Use predefined scenarios (and adjustable multipliers) to see how different activities like user input, agent thinking, tool calls, and code output consume tokens. Spawn sub‑agents to visualize parallel work and how multi‑agent systems share capacity.

### Features

- **Interactive progress bar**: Visualize segments of the context window by type: User Input, Agent Thinking, Tool Calls, and Code Output.
- **Prebuilt scenarios**: Run "Simple Query", "Code Generation", and "Complex Debugging" with realistic token footprints.
- **Adjustable multipliers**: Tweak token usage per scenario from 0.1x–2.0x.
- **Drag, add, remove**: Reorder segments, add new ones from the legend, and remove on hover.
- **Multi‑agent**: Spawn sub‑agents and simulate concurrent requests.
- **Modern UI**: Dark theme with Tailwind CSS and shadcn/ui components.

### How it works

- A primary agent starts with a large context window (default 200,000 tokens).
- Each scenario is a sequence of steps with a type, token count, and delay; steps are added as segments into the agent bar over time.
- The app computes used tokens and capacity percentage, highlighting thresholds at ~50% and ~80%.
- You can spawn additional agents that run smaller requests to demonstrate parallel usage.

### Tech stack

- **Framework**: Next.js 15, React 19
- **Styling**: Tailwind CSS, tailwindcss-animate
- **UI components**: shadcn/ui (Radix primitives)
- **Icons**: lucide-react

### Scenarios

Defined in `lib/scenarios.ts`:

- **Simple Query**: One tool call and short reasoning (~25% capacity base).
- **Code Generation**: Generate and then refactor code (~55% capacity base).
- **Complex Debugging**: Analyze a large file, reason, and output a fix (~75% capacity base).

You can tune each scenario’s total token usage with the advanced settings gear in the UI.

### Getting started

This project uses Bun (a `bun.lock` is present).

Requirements:

- Bun `>=1.1`
- Node.js `>=18` (for editor/tooling compatibility)

Install dependencies:

```bash
bun install
```

Run the dev server:

```bash
bun run dev
```

Build for production:

```bash
bun run build
```

Start a production build locally:

```bash
bun run start
```

Optional lint (configured via Next.js):

```bash
bun run lint
```

Then open `http://localhost:3000` and:

- Click a scenario to start the simulation.
- Use the gear icon to adjust scenario multipliers.
- Click legend items to add segments manually; drag segments to reorder; hover a segment to remove it.
- Click "Spawn Sub‑Agent" to simulate parallel work.

### Key files

- `app/page.tsx`: Landing page that renders the visualizer.
- `components/context-window-visualizer.tsx`: Core simulation logic and state.
- `components/agent-bar.tsx`: Visual progress bar and interactions.
- `components/scenario-controls.tsx`: Scenario picker and advanced settings UI.
- `lib/types.ts`: Types for agents and segments.
- `lib/scenarios.ts`: Built‑in scenarios.

### Customization

- Change default token sizes and total capacity in `components/context-window-visualizer.tsx` and `components/agent-bar.tsx`.
- Add or modify scenarios in `lib/scenarios.ts`.
- Update colors and labels for segment types via `SEGMENT_CONFIG` in `components/context-window-visualizer.tsx`.
- Tailwind config lives in `tailwind.config.ts` and global styles in `app/globals.css` or `styles/globals.css`.

### Notes

- ESLint and TypeScript build errors are ignored during production builds via `next.config.mjs` to keep playground usage friction‑free. Tighten these as needed for production apps.

---

If this project helps you explain or reason about context window usage, consider giving it a star and sharing feedback or ideas for additional scenarios.
