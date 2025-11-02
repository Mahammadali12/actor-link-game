import { getState, getMoviesOf, getCastOf, selectedMovieTitle, getElapsed, statusText } from './engine.js';

export function render(){
  const s = getState();
  // HUD
  qs('#startActor').textContent = s.start ?? '—';
  qs('#currentActor').textContent = s.current ?? '—';
  qs('#targetActor').textContent = s.target ?? '—';
  qs('#movesPill').textContent = `Moves: ${s.moves}`;
  qs('#phasePill').textContent = s.phase === 'pick-movie' ? 'Pick a movie' : s.phase === 'pick-actor' ? 'Pick a co‑actor' : s.phase;
  qs('#timerPill').textContent = getElapsed();
  qs('#moviesOf').textContent = s.current ?? '—';
  qs('#castOf').textContent = selectedMovieTitle();
  // Status
  const status = qs('#statusPill');
  status.textContent = statusText();
  status.style.background = s.phase==='won' ? 'linear-gradient(180deg, #165d3e, #0f3b2e)' : s.phase==='gave-up' ? 'linear-gradient(180deg, #6b1a1a, #3a0e0e)' : '#0e1430';
  status.style.border = s.phase==='won' ? '1px solid #1f7a5e' : s.phase==='gave-up' ? '1px solid #8b1f1f' : '1px solid #1f2752';

  // Movies
  const moviesBox = qs('#moviesList');
  moviesBox.innerHTML = '';
  if (s.phase !== 'pick-movie') {
    moviesBox.innerHTML = pill('Choose a co‑actor first…');
  } else {
    const list = getMoviesOf(s.current);
    if (!list.length) {
      moviesBox.innerHTML = pill('No movies found.');
    } else {
      for (const mv of list){
        const btn = document.createElement('button');
        btn.className = 'choice';
        btn.innerHTML = `<div class="title">${mv.title}</div><div class="sub">${mv.year} • Cast: ${mv.cast.join(', ')}</div>`;
        btn.dataset.movieId = mv.id;
        moviesBox.appendChild(btn);
      }
    }
  }

  // Actors
  const actorsBox = qs('#actorsList');
  actorsBox.innerHTML = '';
  if (s.phase !== 'pick-actor') {
    actorsBox.innerHTML = pill('Pick a movie to see co‑actors…');
  } else {
    const cast = getCastOf(s.selectedMovie);
    if (!cast.length) {
      actorsBox.innerHTML = pill('No co‑actors.');
    } else {
      for (const a of cast){
        const btn = document.createElement('button');
        btn.className = 'choice';
        btn.innerHTML = `<div class="title">${a}</div><div class="sub">from "${selectedMovieTitle()}"</div>`;
        btn.dataset.actor = a;
        actorsBox.appendChild(btn);
      }
    }
  }

  // Path
  const pathBox = qs('#pathList');
  pathBox.innerHTML = '';
  for (const step of s.path){
    const div = document.createElement('div');
    div.className = 'crumb';
    if (step.type === 'actor') div.innerHTML = `<div>🧑‍🎤 <strong>${step.value}</strong></div>`;
    else div.innerHTML = `<div>🎞️ <strong>${step.value}</strong></div><div class="small">via movie</div>`;
    pathBox.appendChild(div);
  }
}

export function pill(text){
  return `<div class="pill">${text}</div>`;
}
function qs(sel){ return document.querySelector(sel); }
