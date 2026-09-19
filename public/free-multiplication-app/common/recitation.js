const NUMBER_WORDS = Object.freeze({
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
  13: 'thirteen',
  14: 'fourteen',
  15: 'fifteen',
  16: 'sixteen',
  17: 'seventeen',
  18: 'eighteen',
  19: 'nineteen',
});

const TENS_WORDS = Object.freeze({
  20: 'twenty',
  30: 'thirty',
  40: 'forty',
  50: 'fifty',
  60: 'sixty',
  70: 'seventy',
  80: 'eighty',
  90: 'ninety',
});

const DIRECT_NUMBER_VALUES = new Map(
  Object.entries(NUMBER_WORDS).map(([value, word]) => [word, Number(value)])
);
const TENS_VALUES = new Map(
  Object.entries(TENS_WORDS).map(([value, word]) => [word, Number(value)])
);
const UNIT_VALUES = new Map(
  Object.entries(NUMBER_WORDS)
    .filter(([value]) => Number(value) >= 1 && Number(value) <= 9)
    .map(([value, word]) => [word, Number(value)])
);
const SPOKEN_NUMBER_ALIASES = new Map([
  ['won', 1], ['wun', 1], ['ones', 1],
  ['to', 2], ['too', 2], ['twos', 2],
  ['tree', 3], ['threes', 3],
  ['for', 4], ['fore', 4], ['fours', 4],
  ['fives', 5],
  ['sics', 6], ['sicks', 6], ['sixes', 6],
  ['sevens', 7],
  ['ate', 8], ['eights', 8],
  ['nines', 9],
]);
const SPOKEN_TENS_ALIASES = new Map([['fourty', 40]]);

const ONETY_ALIASES = Object.freeze([
  'onety',
  'onenty',
  'one ty',
  'one tee',
  'one tea',
  'one t',
  'one dee',
  'one d',
  'wanty',
  'wonty',
  'wunty',
  'wonety',
  'onity',
]);
// Apple sometimes expands the invented word "Onety" into familiar multi-word
// phrases. These ambiguous forms are accepted only when the current expected
// result is 10–19, so ordinary twenty/ninety answers keep their normal meaning.
const CONTEXTUAL_ONETY_ALIASES = Object.freeze([
  'twenty',
  'only',
  'one eighty',
  'one twenty',
  'one ninety',
  'one entity',
  'one empty',
]);
const TEN_ONLY_ALIASES = Object.freeze(['ty', 'tie', 'tai', 'thai', 'tea', 'tee', 't', 'dee', 'd']);

export const RECITATION_OUTCOMES = Object.freeze({
  PASS: 'PASS',
  UNCERTAIN: 'UNCERTAIN',
  WRONG: 'WRONG',
  PROMPTED: 'PROMPTED',
});

export const RECITATION_FACTS = Object.freeze([
  { group: 2, a: 2, b: 2, result: 4, chant: 'two two is four' },
  { group: 2, a: 2, b: 3, result: 6, chant: 'two three is six' },
  { group: 2, a: 2, b: 4, result: 8, chant: 'two four is eight' },
  { group: 2, a: 2, b: 5, result: 10, chant: 'two five onenty' },
  { group: 2, a: 2, b: 6, result: 12, chant: 'two six onenty-two' },
  { group: 2, a: 2, b: 7, result: 14, chant: 'two seven onenty-four' },
  { group: 2, a: 2, b: 8, result: 16, chant: 'two eight onenty-six' },
  { group: 2, a: 2, b: 9, result: 18, chant: 'two nine onenty-eight' },
  { group: 3, a: 3, b: 3, result: 9, chant: 'three three is nine' },
  { group: 3, a: 3, b: 4, result: 12, chant: 'three four onenty-two' },
  { group: 3, a: 3, b: 5, result: 15, chant: 'three five onenty-five' },
  { group: 3, a: 3, b: 6, result: 18, chant: 'three six onenty-eight' },
  { group: 3, a: 3, b: 7, result: 21, chant: 'three seven twenty-one' },
  { group: 3, a: 3, b: 8, result: 24, chant: 'three eight twenty-four' },
  { group: 3, a: 3, b: 9, result: 27, chant: 'three nine twenty-seven' },
  { group: 4, a: 4, b: 4, result: 16, chant: 'four four onenty-six' },
  { group: 4, a: 4, b: 5, result: 20, chant: 'four five twenty' },
  { group: 4, a: 4, b: 6, result: 24, chant: 'four six twenty-four' },
  { group: 4, a: 4, b: 7, result: 28, chant: 'four seven twenty-eight' },
  { group: 4, a: 4, b: 8, result: 32, chant: 'four eight thirty-two' },
  { group: 4, a: 4, b: 9, result: 36, chant: 'four nine thirty-six' },
  { group: 5, a: 5, b: 5, result: 25, chant: 'five five twenty-five' },
  { group: 5, a: 5, b: 6, result: 30, chant: 'five six thirty' },
  { group: 5, a: 5, b: 7, result: 35, chant: 'five seven thirty-five' },
  { group: 5, a: 5, b: 8, result: 40, chant: 'five eight forty' },
  { group: 5, a: 5, b: 9, result: 45, chant: 'five nine forty-five' },
  { group: 6, a: 6, b: 6, result: 36, chant: 'six six thirty-six' },
  { group: 6, a: 6, b: 7, result: 42, chant: 'six seven forty-two' },
  { group: 6, a: 6, b: 8, result: 48, chant: 'six eight forty-eight' },
  { group: 6, a: 6, b: 9, result: 54, chant: 'six nine fifty-four' },
  { group: 7, a: 7, b: 7, result: 49, chant: 'seven seven forty-nine' },
  { group: 7, a: 7, b: 8, result: 56, chant: 'seven eight fifty-six' },
  { group: 7, a: 7, b: 9, result: 63, chant: 'seven nine sixty-three' },
  { group: 8, a: 8, b: 8, result: 64, chant: 'eight eight sixty-four' },
  { group: 8, a: 8, b: 9, result: 72, chant: 'eight nine seventy-two' },
  { group: 9, a: 9, b: 9, result: 81, chant: 'nine nine eighty-one' },
].map((fact) => Object.freeze(fact)));

export const RECITATION_MODES = Object.freeze([
  ...Array.from({ length: 8 }, (_, index) => {
    const group = index + 2;
    return Object.freeze({
      id: `group-${group}`,
      label: `Group ${group}`,
      shortLabel: `${group}`,
      groups: Object.freeze([group]),
      progressKey: null,
      requiresFull: group !== 6 && group !== 7,
    });
  }),
  Object.freeze({ id: 'groups-2-4', label: 'Groups 2–4', shortLabel: '2–4', groups: Object.freeze([2, 3, 4]), progressKey: 'recitation24', requiresFull: true }),
  Object.freeze({ id: 'groups-5-9', label: 'Groups 5–9', shortLabel: '5–9', groups: Object.freeze([5, 6, 7, 8, 9]), progressKey: 'recitation59', requiresFull: true }),
  Object.freeze({ id: 'groups-2-9', label: 'Complete Groups 2–9', shortLabel: '2–9', groups: Object.freeze([2, 3, 4, 5, 6, 7, 8, 9]), progressKey: 'recitation29', requiresFull: true }),
]);

export function getRecitationMode(modeId) {
  return RECITATION_MODES.find((mode) => mode.id === modeId) ?? null;
}

export function getRecitationFacts(modeOrId) {
  const mode = typeof modeOrId === 'string' ? getRecitationMode(modeOrId) : modeOrId;
  if (!mode) return [];
  const groups = new Set(mode.groups);
  return RECITATION_FACTS.filter((fact) => groups.has(fact.group));
}

export function normalizeSpeech(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/\bone[\s-]+(?:ty|tee|tea|t|dee|d)\b/g, 'onenty')
    .replace(/\b(?:onety|wanty|wonty|wunty|wonety|onity)\b/g, 'onenty')
    .replace(/[×*=]/g, ' ')
    .replace(/\bx\b/g, ' ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function expectedResultValue(expectedFactOrResult) {
  const value = Number(
    expectedFactOrResult && typeof expectedFactOrResult === 'object'
      ? expectedFactOrResult.result
      : expectedFactOrResult
  );
  return Number.isInteger(value) && value >= 1 && value <= 99 ? value : null;
}

function isTeenResult(value) {
  return Number.isInteger(value) && value >= 10 && value <= 19;
}

function isThreeFiveFifteenFact(expectedFactOrResult) {
  return Boolean(
    expectedFactOrResult
    && typeof expectedFactOrResult === 'object'
    && Number(expectedFactOrResult.a) === 3
    && Number(expectedFactOrResult.b) === 5
    && Number(expectedFactOrResult.result) === 15
  );
}

// In a fast "three five onety-five" turn, Apple can join either the first
// two numbers ("thirty-five …") or the repeated five sounds ("three
// fifty-five"). Accept those boundary rewrites only while the highlighted
// question is exactly 3 × 5 = 15; the same phrases remain wrong everywhere
// else.
function isThreeFiveFifteenBoundaryRewrite(transcript, expectedFactOrResult) {
  if (!isThreeFiveFifteenFact(expectedFactOrResult)) return false;
  const normalized = normalizeSpeech(transcript);
  const factorPhrase = '(?:(?:three|3) (?:five|5)|(?:thirty five|35))';
  const resultPhrase = '(?:fifty five|55|one (?:two|to|too) (?:five|5)|125)';
  return new RegExp(`^${factorPhrase} ${resultPhrase}$`).test(normalized)
    || /^(?:three|3) (?:fifty five|55)$/.test(normalized);
}

export function isAmbiguousOnetyTranscript(transcript, expectedFactOrResult) {
  const expectedResult = expectedResultValue(expectedFactOrResult);
  if (!isTeenResult(expectedResult)) return false;
  const normalized = normalizeSpeech(transcript);
  return /\b(?:twenty|only)\b/.test(normalized)
    || /\bone (?:eighty|twenty|ninety|entity|empty)\b/.test(normalized);
}

function readNumberAt(tokens, index, expectedResult = null) {
  const token = tokens[index];
  if (!token) return null;
  const spokenUnitValue = (value) => {
    const directUnit = UNIT_VALUES.get(value);
    if (directUnit !== undefined) return directUnit;
    const alias = SPOKEN_NUMBER_ALIASES.get(value);
    return alias >= 1 && alias <= 9 ? alias : undefined;
  };

  if (isTeenResult(expectedResult)) {
    let contextualTokenCount = 0;
    if (token === 'twenty' || token === 'only') contextualTokenCount = 1;
    if (
      token === 'one'
      && ['eighty', 'twenty', 'ninety', 'entity', 'empty'].includes(tokens[index + 1])
    ) contextualTokenCount = 2;
    if (contextualTokenCount > 0) {
      const ones = spokenUnitValue(tokens[index + contextualTokenCount]);
      return {
        value: 10 + (ones ?? 0),
        nextIndex: index + contextualTokenCount + (ones === undefined ? 0 : 1),
      };
    }
  }

  if (expectedResult === 10 && TEN_ONLY_ALIASES.includes(token)) {
    return { value: 10, nextIndex: index + 1 };
  }

  if (/^\d{1,3}$/.test(token)) return { value: Number(token), nextIndex: index + 1 };

  if (token === 'onenty') {
    const ones = spokenUnitValue(tokens[index + 1]);
    return { value: 10 + (ones ?? 0), nextIndex: index + (ones === undefined ? 1 : 2) };
  }

  const direct = DIRECT_NUMBER_VALUES.get(token);
  if (direct !== undefined) return { value: direct, nextIndex: index + 1 };

  const spokenAlias = SPOKEN_NUMBER_ALIASES.get(token);
  if (spokenAlias !== undefined) return { value: spokenAlias, nextIndex: index + 1 };

  const tens = TENS_VALUES.get(token) ?? SPOKEN_TENS_ALIASES.get(token);
  if (tens !== undefined) {
    const ones = spokenUnitValue(tokens[index + 1]);
    return { value: tens + (ones ?? 0), nextIndex: index + (ones === undefined ? 1 : 2) };
  }

  return null;
}

function readNextNumber(tokens, startIndex, expectedResult = null) {
  for (let index = startIndex; index < tokens.length; index += 1) {
    const parsed = readNumberAt(tokens, index, expectedResult);
    if (parsed) return parsed;
  }
  return null;
}

function extractSpokenNumbers(transcript, expectedFactOrResult = null) {
  const tokens = normalizeSpeech(transcript).split(' ').filter(Boolean);
  const expectedResult = expectedResultValue(expectedFactOrResult);
  const numbers = [];

  for (let index = 0; index < tokens.length;) {
    const parsed = readNumberAt(tokens, index, expectedResult);
    if (!parsed) {
      index += 1;
      continue;
    }
    numbers.push(parsed.value);
    index = parsed.nextIndex;
  }

  return numbers;
}

export function extractMultiplicationData(transcript, expectedFactOrResult = null) {
  const numbers = extractSpokenNumbers(transcript, expectedFactOrResult);

  if (numbers.length !== 3) return null;
  const [a, b, result] = numbers;
  if (a < 2 || a > 9 || b < 2 || b > 9 || result < 1 || result > 99) return null;
  return [a, b, result];
}

function extractExpectedMultiplicationSequenceFromTokens(tokens, expectedFacts, startCursor = 0) {
  const sequence = [];
  let cursor = Math.max(0, Math.trunc(Number(startCursor) || 0));

  for (const expectedFact of expectedFacts) {
    const first = readNextNumber(tokens, cursor);
    if (!first) break;
    const second = readNextNumber(tokens, first.nextIndex);
    if (!second) break;
    const result = readNextNumber(tokens, second.nextIndex, expectedResultValue(expectedFact));
    if (!result) break;
    const data = [first.value, second.value, result.value];
    if (data[0] < 2 || data[0] > 9 || data[1] < 2 || data[1] > 9 || data[2] < 1 || data[2] > 99) break;
    sequence.push(data);
    cursor = result.nextIndex;
  }

  return sequence;
}

function extractExpectedMultiplicationSequence(transcript, expectedFacts) {
  const tokens = normalizeSpeech(transcript).split(' ').filter(Boolean);
  return extractExpectedMultiplicationSequenceFromTokens(tokens, expectedFacts);
}

export function extractMultiplicationSequence(transcript, expectedFacts = null) {
  if (Array.isArray(expectedFacts) && expectedFacts.length) {
    return extractExpectedMultiplicationSequence(transcript, expectedFacts);
  }
  const numbers = extractSpokenNumbers(transcript);
  const sequence = [];

  for (let index = 0; index + 2 < numbers.length; index += 3) {
    const data = numbers.slice(index, index + 3);
    const [a, b, result] = data;
    if (a < 2 || a > 9 || b < 2 || b > 9 || result < 1 || result > 99) break;
    sequence.push(data);
  }

  return sequence;
}

export function matchesExpectedFact(data, expectedFact) {
  return Array.isArray(data)
    && data.length === 3
    && data[0] === expectedFact?.a
    && data[1] === expectedFact?.b
    && data[2] === expectedFact?.result;
}

export function isLikelyIncompleteTeenChant(data, expectedFact) {
  if (!Array.isArray(data) || data.length !== 3 || !isTeenResult(expectedFact?.result)) return false;
  if (data[0] !== expectedFact.a || data[1] !== expectedFact.b) return false;
  return data[2] === 10 || (data[2] >= 1 && data[2] <= 9);
}

export function isLikelyIncompleteCompoundChant(data, expectedFact) {
  if (!Array.isArray(data) || data.length !== 3) return false;
  const expectedResult = expectedResultValue(expectedFact);
  if (expectedResult === null || expectedResult < 10 || expectedResult % 10 === 0) return false;
  if (data[0] !== expectedFact.a || data[1] !== expectedFact.b) return false;
  const tens = Math.floor(expectedResult / 10) * 10;
  // A partial Apple transcription can expose only the first sound of a
  // multi-digit result: "onety-five" as "one", or "forty-two" as "four".
  return data[2] === tens || (data[2] >= 1 && data[2] <= 9);
}

export function findMatchingCandidate(candidates, expectedFact) {
  let ambiguousMatch = null;
  for (const transcript of Array.isArray(candidates) ? candidates : []) {
    const data = extractMultiplicationData(transcript, expectedFact);
    if (matchesExpectedFact(data, expectedFact)) {
      const match = {
        transcript,
        normalized: normalizeSpeech(transcript),
        data,
        ambiguousOnety: isAmbiguousOnetyTranscript(transcript, expectedFact),
      };
      if (!match.ambiguousOnety) return match;
      ambiguousMatch ??= match;
    }
  }
  return ambiguousMatch;
}

export function mergeSpeechCandidateHistory(history, candidates, limit = 64) {
  const merged = [];
  const seen = new Set();
  const maximum = Math.max(1, Math.trunc(Number(limit) || 64));

  for (const transcript of [...(Array.isArray(history) ? history : []), ...(Array.isArray(candidates) ? candidates : [])]) {
    if (typeof transcript !== 'string' || !transcript.trim()) continue;
    const key = normalizeSpeech(transcript);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(transcript.trim());
  }

  return merged.slice(-maximum);
}

export function isForgivingFollowAlongAttempt({
  candidates = [],
  heardRecognition = false,
  localTemplateMatched = false,
  localTemplateScore = 0,
  localSpokenDuration = 0,
} = {}) {
  const hasRecognizedWords = (Array.isArray(candidates) ? candidates : [])
    .some((transcript) => normalizeSpeech(transcript).replaceAll(' ', '').length >= 2);
  const score = Number(localTemplateScore);
  const spokenDuration = Number(localSpokenDuration);
  const hasForgivingLocalMatch = localTemplateMatched === true
    || (Number.isFinite(score)
      && Number.isFinite(spokenDuration)
      && score >= 0.30
      && spokenDuration >= 0.45);

  // Recite is prompted follow-along practice, not the final mastery test.
  // Meaningful recognized speech or a loose local acoustic match is enough;
  // silence and very short noises still do not pass.
  return Boolean(heardRecognition || hasRecognizedWords || hasForgivingLocalMatch);
}

export function evaluateRecitationCandidates(candidates, facts, startIndex = 0) {
  const orderedFacts = Array.isArray(facts) ? facts : [];
  const normalizedStartIndex = Math.max(0, Math.trunc(Number(startIndex) || 0));
  let best = null;
  let sawCompleteFact = false;

  for (const transcript of Array.isArray(candidates) ? candidates : []) {
    const normalized = normalizeSpeech(transcript);
    const tokens = normalized.split(' ').filter(Boolean);
    const expectedFacts = orderedFacts.slice(normalizedStartIndex);

    // Apple may rewrite one recognition stream as "wrong attempt, corrected attempt".
    // Try every token boundary so a later correct repeat can win without losing the
    // fixed-order requirement for the facts that follow it.
    for (let startCursor = 0; startCursor < Math.max(1, tokens.length); startCursor += 1) {
      const sequence = extractExpectedMultiplicationSequenceFromTokens(tokens, expectedFacts, startCursor);
      if (!sequence.length) continue;
      sawCompleteFact = true;

      let matchedCount = 0;
      while (
        matchedCount < sequence.length
        && normalizedStartIndex + matchedCount < orderedFacts.length
        && matchesExpectedFact(sequence[matchedCount], orderedFacts[normalizedStartIndex + matchedCount])
      ) {
        matchedCount += 1;
      }

      const candidate = {
        status: matchedCount > 0 ? RECITATION_OUTCOMES.PASS : RECITATION_OUTCOMES.WRONG,
        transcript,
        normalized,
        sequence,
        matchedCount,
        mismatch: sequence[matchedCount] ?? null,
      };

      if (
        !best
        || candidate.matchedCount > best.matchedCount
        || (candidate.matchedCount === best.matchedCount && best.mismatch && !candidate.mismatch)
      ) {
        best = candidate;
      }

      if (candidate.matchedCount === expectedFacts.length && !candidate.mismatch) break;
    }
  }

  if (best) return best;
  return {
    status: sawCompleteFact ? RECITATION_OUTCOMES.WRONG : RECITATION_OUTCOMES.UNCERTAIN,
    transcript: '',
    normalized: '',
    sequence: [],
    matchedCount: 0,
    mismatch: null,
  };
}

// A completed microphone turn represents one child attempt. Unlike the
// streaming evaluator above, this evaluator never skips an earlier complete
// wrong chant to find a later correct repeat in the same transcript. Different
// Apple transcriptions are still treated as alternatives for the same attempt.
export function evaluateCompletedRecitationTurn(candidates, facts, startIndex = 0) {
  const orderedFacts = Array.isArray(facts) ? facts : [];
  const normalizedStartIndex = Math.max(0, Math.trunc(Number(startIndex) || 0));
  const expectedFacts = orderedFacts.slice(normalizedStartIndex);
  let best = null;

  for (const transcript of Array.isArray(candidates) ? candidates : []) {
    const normalized = normalizeSpeech(transcript);
    const tokens = normalized.split(' ').filter(Boolean);
    const sequence = extractExpectedMultiplicationSequenceFromTokens(tokens, expectedFacts, 0);
    if (!sequence.length) continue;

    let matchedCount = 0;
    while (
      matchedCount < sequence.length
      && matchedCount < expectedFacts.length
      && matchesExpectedFact(sequence[matchedCount], expectedFacts[matchedCount])
    ) {
      matchedCount += 1;
    }

    const candidate = {
      status: matchedCount > 0 ? RECITATION_OUTCOMES.PASS : RECITATION_OUTCOMES.WRONG,
      transcript,
      normalized,
      sequence,
      matchedCount,
      mismatch: sequence[matchedCount] ?? null,
      ambiguousOnety: expectedFacts
        .slice(0, Math.max(1, sequence.length))
        .some((fact) => isAmbiguousOnetyTranscript(transcript, fact)),
    };

    if (
      !best
      || candidate.matchedCount > best.matchedCount
      || (candidate.matchedCount === best.matchedCount && best.ambiguousOnety && !candidate.ambiguousOnety)
      || (candidate.matchedCount === best.matchedCount && best.mismatch && !candidate.mismatch)
    ) {
      best = candidate;
    }
  }

  if (best) return best;
  return {
    status: RECITATION_OUTCOMES.UNCERTAIN,
    transcript: '',
    normalized: '',
    sequence: [],
    matchedCount: 0,
    mismatch: null,
    ambiguousOnety: false,
  };
}

export function extractSpokenResult(transcript, expectedResult = null) {
  const numbers = extractSpokenNumbers(transcript, expectedResult);
  if (!numbers.length) return null;
  const value = numbers.at(-1);
  return value >= 1 && value <= 99 ? value : null;
}

export function findMatchingSpokenResult(candidates, expectedFactOrResult) {
  const expected = expectedResultValue(expectedFactOrResult);
  if (expected === null) return null;
  let ambiguousMatch = null;
  for (const transcript of Array.isArray(candidates) ? candidates : []) {
    const boundaryRewrite = isThreeFiveFifteenBoundaryRewrite(transcript, expectedFactOrResult);
    const value = boundaryRewrite ? expected : extractSpokenResult(transcript, expected);
    if (value === expected) {
      const match = {
        transcript,
        normalized: normalizeSpeech(transcript),
        value,
        ambiguousOnety: isAmbiguousOnetyTranscript(transcript, expected),
        boundaryRewrite,
      };
      if (!match.ambiguousOnety) return match;
      ambiguousMatch ??= match;
    }
  }
  return ambiguousMatch;
}

export function numberToEnglish(value) {
  if (NUMBER_WORDS[value]) return NUMBER_WORDS[value];
  if (TENS_WORDS[value]) return TENS_WORDS[value];
  const tens = Math.floor(value / 10) * 10;
  const ones = value % 10;
  if (TENS_WORDS[tens] && NUMBER_WORDS[ones]) return `${TENS_WORDS[tens]} ${NUMBER_WORDS[ones]}`;
  return String(value);
}

export function buildContextualStrings(modeOrId, currentFact) {
  const facts = getRecitationFacts(modeOrId);
  const contextualStrings = [];
  const seen = new Set();
  const add = (value) => {
    const normalized = String(value ?? '').trim();
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    contextualStrings.push(normalized);
  };

  const currentIndex = currentFact ? facts.findIndex((fact) => fact === currentFact || (
    fact.a === currentFact.a && fact.b === currentFact.b && fact.result === currentFact.result
  )) : -1;
  const nearbyFacts = currentIndex >= 0
    ? facts.slice(Math.max(0, currentIndex - 1), Math.min(facts.length, currentIndex + 2))
    : currentFact ? [currentFact] : facts.slice(0, 2);

  if (currentFact) {
    const factorPrefix = `${numberToEnglish(currentFact.a)} ${numberToEnglish(currentFact.b)}`;
    const resultPhrase = numberToEnglish(currentFact.result);
    if (isThreeFiveFifteenFact(currentFact)) {
      // Keep the child's full three-number chant at the front of Apple's
      // context list. The repeated "five" sounds otherwise tend to be joined
      // into thirty-five or fifty-five during a fast, fluent recitation.
      [
        'three five onety five',
        'three five onenty five',
        'three five fifteen',
        'three five one t five',
        'three five one tee five',
        'three five one dee five',
        'three five twenty five',
        'three five one twenty five',
      ].forEach(add);
    }
    // Put the short, current phrases first. Apple recommends brief contextual
    // strings, and this microphone turn is scoped to one expected chant.
    add(resultPhrase);
    add(factorPrefix);
    add(currentFact.chant);
    add(`${factorPrefix} ${resultPhrase}`);
    if (isTeenResult(currentFact.result)) {
      const ones = currentFact.result - 10;
      [...ONETY_ALIASES, ...CONTEXTUAL_ONETY_ALIASES].forEach((alias) => {
        const phrase = ones === 0 ? alias : `${alias} ${numberToEnglish(ones)}`;
        add(phrase);
      });
      if (currentFact.result === 10) {
        ['ty', 'tie', 'tea', 'tee', 'ten'].forEach(add);
      }
    }
  }

  nearbyFacts.forEach((fact) => add(`${numberToEnglish(fact.a)} ${numberToEnglish(fact.b)}`));
  nearbyFacts.forEach((fact) => add(numberToEnglish(fact.result)));
  nearbyFacts.forEach((fact) => add(fact.chant));

  return contextualStrings.slice(0, 40);
}
