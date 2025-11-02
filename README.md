# Actor Link — Movie Hops (Prototype)

A tiny web game inspired by the Wikipedia “Getting to Philosophy” idea, but for movies: start from a random actor and reach a target actor by hopping **Actor → Movie → Actor** using co‑stars.

This package includes **two ways to run**:

---

## 1) Module build (recommended)

**Project structure**
```
index.html              # main entry point (served at GitHub Pages root)
styles.css              # UI styles for the module build
/src/
  data/graph.js         # placeholder JSON (swap for real data later)
  game/engine.js        # state, BFS, timer, moves, hints
  game/ui.js            # rendering
  main.js               # wires UI and engine
/public/
  index_singlefile.html # legacy no-build bundle for quick testing
```

**Run locally (no build tools needed)**
1. Open a terminal in the project root (the folder that contains `index.html` and `/src`).
2. Start a static server, e.g.:
   - **Python 3**: `python -m http.server 8000`
   - **Node.js**: `npx serve .` (or `npx http-server .`)
   - **VS Code**: install *Live Server*, right‑click `index.html` → **Open with Live Server**
3. Open: `http://localhost:8000/`

> Why a server? ES Modules (`<script type="module">`) are blocked on `file://` (origin `null`) by browsers. A small local server fixes CORS.

---

## 2) Single‑file mode (for double‑click testing)

Open `/public/index_singlefile.html` directly with `file://`. It inlines everything (no modules), so it runs without a server. Uses the same placeholder JSON graph.

---

## GitHub Pages deployment

The repository ships with a GitHub Actions workflow that publishes the site to **GitHub Pages** from the `main` branch. Push to `main` (or trigger the workflow manually) and the action will upload a static bundle containing `index.html`, `styles.css`, and the `/src` modules. The deployed site lives at `https://<your-username>.github.io/actor-link-game/` (replace with your GitHub handle).

---

## Gameplay

- Click a **movie** from the current actor’s filmography.
- Pick a **co‑actor** from that movie’s cast to hop to a new actor.
- Repeat until you reach the **Target Actor**.
- **Undo** removes the last hop (movie + actor).
- **Give Up** reveals a BFS‑based hint toward the target.

**Scoring:** the UI shows a move counter and timer.

---

## Swapping in real data

Replace `/src/data/graph.js` with your real dataset (e.g., TMDb/IMDb/Wikipedia results consolidated into a graph). The engine expects:
```js
export const GRAPH = {
  movies: [
    { id: 'm1', title: 'Some Film', year: 2012, cast: ['Actor A', 'Actor B', ...] },
    // ...
  ]
}
```
From this, the engine computes actor→movies and movie casts automatically.

---

## License

This prototype is provided “as is.” You may use and modify it for your project.
