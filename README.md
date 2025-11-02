# Actor Link — Movie Hops (Prototype)

A tiny web game inspired by the Wikipedia “Getting to Philosophy” idea, but for movies: start from a random actor and reach a target actor by hopping **Actor → Movie → Actor** using co‑stars.

This package includes **two ways to run**:

---

## 1) Module build (recommended)

**Project structure**
```
/public/
  index.html
  styles.css
/src/
  data/graph.js         # placeholder JSON (swap for real data later)
  game/engine.js        # state, BFS, timer, moves, hints
  game/ui.js            # rendering
  main.js               # wires UI and engine
```

**Run locally (no build tools needed)**
1. Open a terminal in the project root (the folder that contains `/public` and `/src`).
2. Start a static server, e.g.:
   - **Python 3**: `python -m http.server 8000`
   - **Node.js**: `npx serve .` (or `npx http-server .`)
   - **VS Code**: install *Live Server*, right‑click `/public/index.html` → **Open with Live Server**
3. Open: `http://localhost:8000/public/`

> Why a server? ES Modules (`<script type="module">`) are blocked on `file://` (origin `null`) by browsers. A small local server fixes CORS.

**Tip**: If you serve `/public` as the web root, change the script line in `/public/index.html` to:
```html
<script type="module" src="/src/main.js"></script>
```

---

## 2) Single‑file mode (for double‑click testing)

Open `/public/index_singlefile.html` directly with `file://`. It inlines everything (no modules), so it runs without a server. Uses the same placeholder JSON graph.

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
