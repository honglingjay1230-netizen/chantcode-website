import type { Metadata } from "next";
import { SiteShell } from "../components/SiteShell";
import { SITE } from "../config";

export const metadata: Metadata = {
  title: "ChantCode FAQ",
  description: "Answers about ChantCode, multiplication facts, times tables, the Chinese multiplication chant, practice, and multiplication fluency.",
  alternates: { canonical: "/faq" },
  openGraph: { title: "ChantCode FAQ", description: "Clear answers for parents about ChantCode and multiplication fact recall.", url: "/faq" },
};

const faqs = [
  { question: "What is ChantCode?", answer: "ChantCode is a multiplication learning system for English-speaking children. It encodes multiplication facts into short, regular sound patterns and combines memorization with structured recall practice." },
  { question: "How can children improve multiplication fact recall?", answer: "Children first need to understand what multiplication means. Recall can then improve through accurate fact storage, prompted retrieval, random questions, mixed practice, feedback, and repeated use over time." },
  { question: "Why do some children struggle with times tables?", answer: "A child may understand equal groups but still need several steps to calculate each answer. If the facts are not yet stable in long-term memory, later work can feel slow because attention is repeatedly used to rebuild basic answers." },
  { question: "Why is multiplication fluency important?", answer: "Fluent recall makes familiar facts available without recalculating them each time. This leaves more attention available for multi-step arithmetic, fractions, division, algebra, and problem solving." },
  { question: "Is ChantCode based on the Chinese multiplication chant?", answer: "Yes, in part. ChantCode is inspired by structural features of the traditional Chinese 9×9 multiplication chant, 九九乘法口诀: compact verbal lines, fixed order, regular rhythm, and mental replay. It adapts selected features rather than translating the Chinese chant directly." },
  { question: "Does ChantCode require learning Chinese?", answer: "No. ChantCode is designed in English for English-speaking children. Children continue to use standard mathematics notation and do not need to learn Chinese." },
  { question: "Why does ChantCode focus on 36 core facts?", answer: "The 1s facts follow a simple rule, and commutative pairs such as 6 × 7 and 7 × 6 share one answer. Removing the 1s and reversed duplicates from the 9×9 core leaves 36 non-duplicate facts for concentrated memorization." },
  { question: "Does ChantCode replace school math?", answer: "No. ChantCode does not replace conceptual teaching, classroom instruction, problem solving, or a teacher. It focuses on the narrower task of storing multiplication facts and building faster, more independent recall." },
  { question: "How long should children practice multiplication facts each day?", answer: "Short, focused practice is usually easier to sustain than a long drill. About 5–10 minutes can be a practical starting point, but the right length depends on the child. Accuracy, attention, and a calm stopping point matter more than extending the clock." },
  { question: "How can I tell whether ChantCode works for my child?", answer: "Check whether the child can answer a small set accurately without relying on the full chant, then check the same facts later and in mixed order. Look for increasingly direct recall. ChantCode should be judged through observed learning and testing rather than a guaranteed claim." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };

export default function FaqPage() {
  return <SiteShell><main className="support-main"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} /><header className="legal-hero support-hero"><p className="eyebrow">Questions &amp; Answers</p><h1>ChantCode FAQ</h1><p>Concise answers about multiplication memory, fluent recall, and the ChantCode method.</p></header><section className="faq-list" aria-label="Frequently asked questions">{faqs.map(({ question, answer }) => <article key={question}><h2>{question}</h2><p>{answer}</p></article>)}</section><section className="contact-card"><div><p className="eyebrow">More Questions?</p><h2>Contact ChantCode</h2><p>For product or support questions, email the official ChantCode team.</p></div><a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a></section></main></SiteShell>;
}
