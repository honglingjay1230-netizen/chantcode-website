"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const groups = [
  { number: 6, factors: [6, 7, 8, 9] },
  { number: 7, factors: [7, 8, 9] },
];

export function ChantFactPlayers() {
  const player = useRef<HTMLAudioElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = player.current;
    const main = audio?.closest("main");
    if (!audio || !main) return;

    // Keep individual chants, full groups, and the music video from overlapping.
    const stopOtherMedia = (event: Event) => {
      if (!(event.target instanceof HTMLMediaElement)) return;
      main.querySelectorAll<HTMLMediaElement>("audio, video").forEach((media) => {
        if (media !== event.target) media.pause();
      });
    };
    main.addEventListener("play", stopOtherMedia, true);
    return () => {
      main.removeEventListener("play", stopOtherMedia, true);
      audio.pause();
    };
  }, []);

  async function toggleChant(id: string) {
    const audio = player.current;
    if (!audio) return;
    const src = `/media/free-multiplication/${id}.wav`;
    setError(null);

    if (audio.getAttribute("src") === src && !audio.paused) {
      audio.pause();
      return;
    }
    if (audio.getAttribute("src") !== src) {
      audio.pause();
      audio.src = src;
    }
    setSelected(id);
    try {
      await audio.play();
    } catch (playError) {
      // Switching quickly cancels the old request; only report a current failure.
      if (audio.getAttribute("src") !== src || (playError instanceof DOMException && playError.name === "AbortError")) return;
      setPlaying(false);
      setError("This chant could not play. Please tap it again to retry.");
    }
  }

  return (
    <>
      <p>Tap any multiplication fact to hear its chant. Tap again to pause, or choose another fact.</p>
      <div className={styles.groups}>
        {groups.map((group) => (
          <article className={styles.group} key={group.number}>
            <div className={styles.groupHeading}><h3>{group.number}× group</h3><span>{group.factors.length} core chants</span></div>
            <ul>
              {group.factors.map((factor) => {
                const id = `${group.number}x${factor}`;
                const fact = `${group.number} × ${factor} = ${group.number * factor}`;
                const active = selected === id && playing;
                return (
                  <li key={id}>
                    <button type="button" className={styles.factButton} aria-label={`${active ? "Pause" : "Play"} ${fact} chant`} aria-pressed={active} onClick={() => void toggleChant(id)}>
                      <span>{fact}</span>
                      <span className={styles.playLabel} aria-hidden="true"><span>{active ? "Ⅱ" : "▶"}</span>{active ? "Pause" : "Play"}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
      {/* Each recording's multiplication fact is written on its button; group transcripts are also available below. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={player} hidden preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />
      {error && <p className={styles.playError} role="alert">{error}</p>}
    </>
  );
}
