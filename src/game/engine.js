import { GRAPH } from "../data/graph.js";

// Build indices
const actorToMovies = new Map();
for (const mv of GRAPH.movies) {
  for (const a of mv.cast) {
    if (!actorToMovies.has(a)) actorToMovies.set(a, new Set());
    actorToMovies.get(a).add(mv.id);
  }
}
const moviesById = new Map(GRAPH.movies.map(m => [m.id, m]));
const ALL_ACTORS = Array.from(actorToMovies.keys());

// State
const state = {
  start: null,
  current: null,
  target: null,
  phase: 'pick-movie', // 'pick-movie' | 'pick-actor' | 'won' | 'gave-up'
  selectedMovie: null,
  path: [], // sequence of {type:'actor'|'movie', value}
  moves: 0,
  timerStart: 0,
  timerInt: null
};

// Observers
const listeners = new Set();
function notify(){ for (const fn of listeners) fn(getSnapshot()); }
export function subscribe(fn){ listeners.add(fn); return () => listeners.delete(fn); }
export function getState(){ return state; }
export function getSnapshot(){ return JSON.parse(JSON.stringify(state)); }

// Utils
function rnd(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function pathExists(startActor, targetActor) {
  if (startActor === targetActor) return true;
  const seenActors = new Set([startActor]);
  const seenMovies = new Set();
  const queue = [startActor];
  while (queue.length) {
    const actor = queue.shift();
    const movies = actorToMovies.get(actor) || [];
    for (const mid of movies) {
      if (seenMovies.has(mid)) continue;
      seenMovies.add(mid);
      const mv = moviesById.get(mid);
      for (const a of mv.cast) {
        if (a === targetActor) return true;
        if (!seenActors.has(a)) { seenActors.add(a); queue.push(a); }
      }
    }
  }
  return false;
}

function startTimer(){
  if (state.timerInt) clearInterval(state.timerInt);
  state.timerStart = Date.now();
  state.timerInt = setInterval(() => notify(), 250);
}
function stopTimer(){ if (state.timerInt) clearInterval(state.timerInt); state.timerInt = null; }

export function newGame(){
  let s, t; let safety = 100;
  do {
    s = rnd(ALL_ACTORS);
    do { t = rnd(ALL_ACTORS); } while (t === s);
  } while (!pathExists(s, t) && --safety > 0);

  state.start = s;
  state.current = s;
  state.target = t;
  state.phase = 'pick-movie';
  state.selectedMovie = null;
  state.path = [{ type:'actor', value:s }];
  state.moves = 0;
  startTimer();
  notify();
}

export function getMoviesOf(actor){
  return Array.from(actorToMovies.get(actor) || []).map(id => moviesById.get(id));
}
export function getCastOf(movieId){
  const mv = moviesById.get(movieId); if (!mv) return [];
  return mv.cast.filter(a => a !== state.current);
}

export function selectMovie(movieId){
  state.selectedMovie = movieId;
  state.phase = 'pick-actor';
  notify();
}

export function hopToActor(nextActor){
  const mv = moviesById.get(state.selectedMovie);
  if (!mv) return;
  state.path.push({ type:'movie', value: mv.title });
  state.path.push({ type:'actor', value: nextActor });
  state.current = nextActor;
  state.moves += 1;

  if (state.current === state.target) {
    state.phase = 'won';
    stopTimer();
  } else {
    state.phase = 'pick-movie';
    state.selectedMovie = null;
  }
  notify();
}

export function undo(){
  if (state.phase === 'won' || state.path.length < 3) return;
  state.path.pop(); // actor
  state.path.pop(); // movie
  state.current = state.path[state.path.length-1].value; // previous actor
  state.moves = Math.max(0, state.moves - 1);
  state.phase = 'pick-movie';
  state.selectedMovie = null;
  notify();
}

export function giveUp(){
  if (state.phase === 'won') return null;
  state.phase = 'gave-up';
  stopTimer();
  notify();
  return findGreedyHint(state.current, state.target);
}

export function getElapsed(){
  const ms = Date.now() - state.timerStart;
  const secs = Math.floor(ms/1000);
  const m = String(Math.floor(secs/60)).padStart(2,'0');
  const s = String(secs%60).padStart(2,'0');
  return `${m}:${s}`;
}

export function statusText(){
  if (state.phase === 'won') return 'You reached the target! 🎉';
  if (state.phase === 'gave-up') return 'Revealed a winning clue. Try again!';
  return 'Playing…';
}

export function selectedMovieTitle(){
  const mv = moviesById.get(state.selectedMovie);
  return mv ? mv.title : '—';
}

// Hint (BFS predecessor)
function findGreedyHint(fromActor, toActor){
  if (fromActor === toActor) return null;
  const seenActors = new Set([fromActor]);
  const seenMovies = new Set();
  const queue = [fromActor];
  const parent = new Map(); // actor -> {actor, movieId}
  let found = false;
  while (queue.length && !found) {
    const actor = queue.shift();
    for (const mid of (actorToMovies.get(actor) || [])){
      if (seenMovies.has(mid)) continue;
      seenMovies.add(mid);
      const mv = moviesById.get(mid);
      for (const a of mv.cast){
        if (!seenActors.has(a)){
          seenActors.add(a);
          parent.set(a, { actor, movieId: mid });
          if (a === toActor){ found = true; break; }
          queue.push(a);
        }
      }
      if (found) break;
    }
  }
  if (!found) return null;
  let cur = toActor; let prev = parent.get(cur);
  while (prev && prev.actor !== fromActor) { cur = prev.actor; prev = parent.get(cur); }
  if (!prev) return null;
  return { actor: cur, movieId: prev.movieId };
}

export function hintReadable(h){
  if (!h) return 'No hint available.';
  const m = moviesById.get(h.movieId);
  return `Hint: Try movie "${m?.title ?? '—'}" to reach ${h.actor}.`;
}
