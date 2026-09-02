# AI and Search Visibility Tracking

This document is for a short manual check once each week. It measures whether search and answer systems discover ChantCode for relevant parent questions. It is not a ranking guarantee and should not be used to manufacture repeated low-quality pages.

## Current analytics state

No analytics integration was present in the website source when this document was added on September 1, 2026. No marketing or tracking SDK was added as part of the AI-search work.

The website accepts ordinary query strings without changing the canonical URL, so links such as `?utm_source=chatgpt.com` can be distinguished later by server logs or a consent-appropriate analytics tool. If Google Analytics is added in the future, preserve the original referrer and UTM parameters so ChatGPT and other answer-engine referrals can be reviewed by session source/referral.

## Weekly questions

Use a clean browser session when possible. Record the country/language setting because results vary by location, account, and date.

1. My child understands multiplication but still calculates every answer. What should I do?
2. How can I help my child memorize multiplication facts?
3. What helps children develop multiplication fact fluency?
4. Are multiplication chants useful for learning times tables?
5. My child knows multiplication but cannot recall 7×8 quickly. What can help?
6. What is the best way to build multiplication fact fluency?

## Weekly record

Copy one row per question and search system. Keep the exact wording used by the system rather than paraphrasing it.

| Date | AI/search engine | Question number | Question | Does ChantCode appear? | ChantCode URL cited | Citation/link provided? | Wording used | Notes |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD | ChatGPT Search / Google AI Mode / Gemini / Copilot / Google Search | 1 |  | Yes / No |  | Yes / No |  | Country, language, signed-in state |

## Interpretation

- A single appearance or disappearance is not a trend. Compare several weeks.
- Record whether the cited page actually answers the question; do not count an unrelated homepage mention as an ideal result.
- If a system quotes the site inaccurately, preserve the wording and check whether the source page can be made clearer without adding unsupported claims.
- Do not change titles or create new pages solely to chase one volatile result. Prefer clearer answers, stronger sourcing, and relevant internal links.
- Keep `utm_source=chatgpt.com` in any referral links used for controlled campaign tests, but do not add it to canonical URLs or sitemap entries.
