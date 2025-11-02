import { subscribe, newGame, undo, giveUp, selectMovie, hopToActor, hintReadable } from './game/engine.js';
import { render } from './game/ui.js';

// Subscribe UI to state changes and initial render
subscribe(render);
render();

// Controls
const $ = (s) => document.querySelector(s);
$('#newGameBtn').addEventListener('click', () => newGame());
$('#undoBtn').addEventListener('click', () => undo());
$('#giveUpBtn').addEventListener('click', () => {
  const hint = giveUp();
  if (hint) {
    document.getElementById('hintBox').textContent = hintReadable(hint);
  }
});

// Delegate clicks for dynamic lists
$('#moviesList').addEventListener('click', (e) => {
  const btn = e.target.closest('.choice');
  if (!btn) return;
  const id = btn.dataset.movieId; if (!id) return;
  selectMovie(id);
});

$('#actorsList').addEventListener('click', (e) => {
  const btn = e.target.closest('.choice');
  if (!btn) return;
  const actor = btn.dataset.actor; if (!actor) return;
  hopToActor(actor);
});

// Bootstrap a round immediately
newGame();
