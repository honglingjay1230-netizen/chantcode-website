import { readPractice, savePractice } from './web-support.js';
// Browser-only, child-paced practice. No microphone, recognition, grading, or mastery updates.
export function mountManualFollowAlong(root, facts, audioPath) {
  const items = facts.map(f => ({ left: Number(f.left ?? f.a), right: Number(f.right ?? f.b) }));
  if (!items.length || items.some(f => !Number.isInteger(f.left) || !Number.isInteger(f.right) || f.left < 1 || f.right < 1 || f.left > 10 || f.right > 10)) throw new Error('Invalid practice facts');
  const audio = new Audio();
  audio.preload = 'none';
  const saved = readPractice(items);
  let index = saved.index, heard = false, playing = false, finished = saved.completed, disposed = false, request = 0;
  let worked = saved.worked, resuming = index > 0 && !finished;
  const persist = () => savePractice(items, { index, worked, completed: finished });
  root.innerHTML = `<section class="web-follow" aria-label="Listen and repeat practice">
    <p class="web-follow-kicker">Listen &amp; Repeat</p>
    <h1>One chant at a time</h1>
    <p>Listen to the chant, say it aloud, then tap Next. Take as much time as you need.</p>
    <p class="web-follow-note">No microphone, recording, or automatic scoring.</p>
    <p data-manual-count></p>
    <progress data-manual-progress aria-label="Chants worked through"></progress>
    <div class="web-follow-fact" data-manual-fact></div>
    <p class="web-follow-status" data-manual-status role="status" aria-live="polite"></p>
    <div class="web-follow-actions">
      <button type="button" data-manual-previous>Previous</button>
      <button type="button" data-manual-play>Play chant</button>
      <button type="button" data-manual-next>Next chant</button>
    </div>
    <button type="button" class="web-follow-restart" data-manual-restart hidden>Practice again</button>
  </section>`;
  const find = key => root.querySelector(`[data-manual-${key}]`);
  const status = message => { if (!disposed) find('status').textContent = message; };
  function draw() {
    if (disposed) return;
    const f = items[index];
    find('count').textContent = finished ? `${items.length} chants worked through` : `Chant ${index + 1} of ${items.length}`;
    find('progress').max = items.length;
    find('progress').value = finished ? items.length : index;
    find('fact').textContent = finished ? 'Practice completed' : `${f.left} × ${f.right} = ${f.left * f.right}`;
    find('previous').disabled = index === 0 || playing;
    find('play').textContent = playing ? 'Stop audio' : heard ? 'Listen again' : resuming ? 'Continue practice' : 'Play chant';
    find('next').textContent = index === items.length - 1 ? 'Finish practice' : 'Next chant';
    find('next').disabled = !heard || playing;
    root.querySelector('.web-follow-actions').hidden = finished;
    find('restart').hidden = !finished && index === 0;
    find('restart').textContent = finished ? 'Practice again' : 'Start over';
  }
  function stop() { request++; audio.pause(); audio.currentTime = 0; playing = false; }
  async function play() {
    if (disposed || finished) return;
    if (playing) { stop(); draw(); status(heard ? 'Your turn. Repeat the chant, then tap Next.' : 'Audio stopped. Tap Play chant to listen.'); return; }
    resuming = false;
    const id = ++request;
    const f = items[index];
    audio.src = audioPath(f.left, f.right);
    playing = true; draw(); status('Listen to the chant.');
    try { await audio.play(); } catch {
      if (disposed || request !== id) return;
      playing = false; draw(); status('The audio could not play. Tap Play chant to try again.');
    }
  }
  audio.onended = () => { if (disposed) return; playing = false; heard = true; draw(); status('Your turn! Say the chant aloud. Tap Next when you are ready.'); };
  audio.onerror = () => { if (disposed) return; playing = false; draw(); status('The audio could not load. Please try again.'); };
  find('play').onclick = () => void play();
  find('next').onclick = () => {
    if (!heard || playing || finished) return;
    stop();
    if (index === items.length - 1) {
      finished = true; worked = items.length; persist(); draw(); status('You have worked through this set. Your voice was not recorded or checked.'); return;
    }
    index++; worked = Math.max(worked, index); heard = false; persist(); draw(); void play();
  };
  find('previous').onclick = () => { if (!index || playing) return; stop(); index--; heard = false; resuming = false; persist(); draw(); status('Tap Play chant to hear this sentence again.'); };
  find('restart').onclick = () => { stop(); index = 0; heard = false; finished = false; resuming = false; persist(); draw(); status('Tap Play chant to begin.'); };
  draw(); status(finished ? 'You worked through this set. Your voice was not recorded or checked.' : resuming ? 'Your place was saved. Continue practice, or start over. No recording or scoring is used.' : 'Tap Play chant to begin.');
  return () => { disposed = true; stop(); audio.onended = null; audio.onerror = null; audio.removeAttribute('src'); };
}
