import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";

export const metadata: Metadata = { title: "What is ChantCode?", description: "Learn what ChantCode means and how rhythm and structured repetition support multiplication fact recall.", alternates: { canonical: "/about" }, openGraph: { title: "What is ChantCode?", description: "A multiplication code stored in sound for English-speaking children.", url: "/about" } };

export default function AboutPage() {
  return <SiteShell><main className="content-main"><header className="content-hero"><p className="eyebrow">About ChantCode</p><h1>What is ChantCode?</h1><p className="content-lede">ChantCode is a rhythmic multiplication memorization system designed to help children build multiplication fact fluency.</p></header><div className="method-sections">
    <section><span>Chant</span><div><h2>A repeated rhythmic sequence</h2><p>A chant turns information into a short, ordered sound pattern that can be listened to, repeated, and recalled from memory.</p></div></section>
    <section><span>Code</span><div><h2>A compact system for storage and retrieval</h2><p>A code organizes information so it can be stored efficiently and retrieved when needed.</p></div></section>
    <section><span>Together</span><div><h2>A multiplication code stored in sound</h2><p>ChantCode combines rhythm and structured repetition to help children store multiplication facts as organized sound patterns, then retrieve answers through recall practice.</p></div></section>
    <section><span>Inspiration</span><div><h2>Adapted for English-speaking children</h2><p>The traditional Chinese multiplication chant is a long-established form of spoken multiplication memorization. ChantCode studies that compact verbal structure and redesigns selected features for English-speaking learners.</p><p>Children do not need to learn Chinese. ChantCode does not replace school mathematics or conceptual understanding.</p></div></section>
  </div></main></SiteShell>;
}
