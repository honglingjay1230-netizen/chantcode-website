import { SiteShell } from "../components/SiteShell";
import { SITE } from "../config";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "ChantCode FAQ",
  description: "Answers about ChantCode, multiplication facts, times tables, the Chinese multiplication chant, practice, and multiplication fluency.",
  path: "/faq",
});

type WhyFaqBlock =
  | { type: "paragraph"; text: string; strong?: boolean }
  | { type: "questions"; lines: string[] }
  | { type: "coreFacts"; text: string };

const whyAnotherFaqs: { question: string; blocks: WhyFaqBlock[] }[] = [
  {
    question: "1. My child is already learning multiplication at school. Why do we need ChantCode?",
    blocks: [
      { type: "paragraph", text: "Learning multiplication at school does not always mean a child can use multiplication facts quickly and independently." },
      { type: "paragraph", text: "Ask yourself:" },
      { type: "questions", lines: ["When your child sees 6 × 7 or 7 × 8, can they answer immediately?", "Or do they still need to count, calculate, pause, or ask for help?"] },
      { type: "paragraph", text: "ChantCode focuses not just on whether children have been taught multiplication, but on whether those facts have actually entered memory.", strong: true },
    ],
  },
  {
    question: "2. Why not just use flashcards?",
    blocks: [
      { type: "paragraph", text: "You absolutely can." },
      { type: "paragraph", text: "But flashcards usually keep asking the child questions." },
      { type: "questions", lines: ["Do you know exactly which facts your child learned today?", "Which ones are already secure?", "Which ones were only answered correctly by chance?", "Which ones have not really been learned yet?"] },
      { type: "paragraph", text: "And more importantly:" },
      { type: "paragraph", text: "Have you ever counted how many multiplication facts your child is actually trying to remember?", strong: true },
      { type: "paragraph", text: "ChantCode does not simply shuffle questions and repeat them." },
      { type: "paragraph", text: "It first organizes what needs to be remembered, then helps children learn it in a clear sequence." },
    ],
  },
  {
    question: "3. Isn’t ChantCode still asking children to memorize multiplication facts?",
    blocks: [
      { type: "paragraph", text: "Yes." },
      { type: "paragraph", text: "Multiplication facts eventually need to be remembered." },
      { type: "paragraph", text: "The real question is:" },
      { type: "paragraph", text: "How long does it take to remember them?", strong: true },
      { type: "questions", lines: ["How many worksheets?", "How many rounds of flashcards?", "How many quizzes?", "How many times do you need to sit beside your child and explain the same fact again?"] },
      { type: "paragraph", text: "If something that should eventually become automatic requires months of repeated practice, that is time and attention that could be used for the mathematics that comes next." },
      { type: "paragraph", text: "ChantCode is designed to shorten that process." },
    ],
  },
  {
    question: "4. Why does my child need to learn them quickly? Can’t we just take our time?",
    blocks: [
      { type: "paragraph", text: "Of course children can learn at their own pace." },
      { type: "paragraph", text: "But children are not machines." },
      { type: "paragraph", text: "When a very basic multiplication fact repeatedly stops them, mathematics can begin to feel harder than it really is." },
      { type: "paragraph", text: "A question may actually be about division, fractions, or multi-digit multiplication." },
      { type: "paragraph", text: "But your child may first get stuck on 6 × 7." },
      { type: "paragraph", text: "Over time, the problem may not be that they cannot understand the new mathematics." },
      { type: "paragraph", text: "They may simply keep getting slowed down by multiplication facts they still cannot recall easily." },
      { type: "paragraph", text: "Parents feel this too." },
      { type: "paragraph", text: "After explaining the same multiplication fact for the fifth, tenth, or twentieth time, can you realistically bring the same patience every time?" },
      { type: "paragraph", text: "ChantCode is not about pushing children to learn faster.", strong: true },
      { type: "paragraph", text: "It is about helping one foundational skill take less time and effort from both children and parents." },
    ],
  },
  {
    question: "5. So what does ChantCode actually do differently?",
    blocks: [
      { type: "paragraph", text: "The idea is simple." },
      { type: "paragraph", text: "Your child already speaks English." },
      { type: "paragraph", text: "They already know the numbers from 1 to 100." },
      { type: "paragraph", text: "They already know how to remember words, spelling, songs, and short phrases." },
      { type: "paragraph", text: "ChantCode does not ask them to learn a completely unfamiliar mathematical system." },
      { type: "paragraph", text: "Instead, it takes number sounds they already know and organizes them into short, structured multiplication facts that are easier to remember as connected patterns." },
      { type: "paragraph", text: "It also removes unnecessary repetition." },
      { type: "paragraph", text: "For example:" },
      { type: "paragraph", text: "2 × 7 and 7 × 2 have the same answer." },
      { type: "paragraph", text: "A child does not need to treat them as two completely separate facts to memorize." },
      { type: "paragraph", text: "Once ×1 is treated as a simple rule, the core multiplication facts from 2 through 9 can be organized into just:" },
      { type: "coreFacts", text: "36 Core Multiplication Facts" },
      { type: "paragraph", text: "Not a large field of random questions." },
      { type: "paragraph", text: "Not endless flashcards with no clear finish line." },
      { type: "paragraph", text: "But a learning path where the child can actually see the end." },
      { type: "paragraph", text: "This idea is not starting from zero." },
      { type: "paragraph", text: "For generations, children across East Asia have learned multiplication through short, spoken multiplication facts that can be recalled directly from memory." },
      { type: "paragraph", text: "ChantCode adapts that same principle—getting multiplication into memory first—for English-speaking children.", strong: true },
      { type: "questions", lines: ["Learn it.", "Remember it.", "Test it.", "And eventually, stop recalculating."] },
      { type: "paragraph", text: "See the multiplication fact. Recall the answer.", strong: true },
    ],
  },
];

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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    ...whyAnotherFaqs.map(({ question, blocks }) => ({
      "@type": "Question",
      name: question.replace(/^\d+\.\s*/, ""),
      acceptedAnswer: {
        "@type": "Answer",
        text: blocks.flatMap((block) => block.type === "questions" ? block.lines : [block.text]).join(" "),
      },
    })),
    ...faqs.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
  ],
};

export default function FaqPage() {
  return (
    <SiteShell>
      <main className="support-main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <header className="legal-hero support-hero">
          <p className="eyebrow">Questions for Parents</p>
          <h1>Why another multiplication app?</h1>
          <p>Practical answers about multiplication memory, fluent recall, and what ChantCode does differently.</p>
        </header>

        <section className="faq-list why-faq-list" aria-label="Why ChantCode questions">
          {whyAnotherFaqs.map(({ question, blocks }) => (
            <article key={question}>
              <h2>{question}</h2>
              <div className="faq-answer">
                {blocks.map((block, index) => {
                  if (block.type === "questions") {
                    return <div className="faq-question-stack" key={`${question}-${index}`}>{block.lines.map((line) => <p key={line}>{line}</p>)}</div>;
                  }
                  if (block.type === "coreFacts") {
                    return <div className="faq-core-facts" key={`${question}-${index}`}><h3>{block.text}</h3></div>;
                  }
                  return <p key={`${question}-${index}`}>{block.strong ? <strong>{block.text}</strong> : block.text}</p>;
                })}
              </div>
            </article>
          ))}
        </section>

        <section className="faq-secondary-section" aria-labelledby="more-faq-heading">
          <header>
            <p className="eyebrow">ChantCode FAQ</p>
            <h2 id="more-faq-heading">More questions about ChantCode</h2>
          </header>
          <div className="faq-list">
            {faqs.map(({ question, answer }) => <article key={question}><h2>{question}</h2><p>{answer}</p></article>)}
          </div>
        </section>

        <section className="contact-card">
          <div><p className="eyebrow">More Questions?</p><h2>Contact ChantCode</h2><p>For product or support questions, email the official ChantCode team.</p></div>
          <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
        </section>
      </main>
    </SiteShell>
  );
}
