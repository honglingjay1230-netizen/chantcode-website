export const facts = (group) => Array.from({ length: 8 }, (_, index) => ({
  left: index + 2,
  right: group,
  answer: (index + 2) * group,
}));

export function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function multiplicationChoiceOptions(answer, group, multiplier) {
  const correctAnswer = Number(answer);
  const groupNumber = Number(group);
  const multiplierNumber = Number(multiplier);
  if (![correctAnswer, groupNumber, multiplierNumber].every(Number.isFinite)) return [];

  const nearbyMultipliers = Array.from({ length: 9 }, (_, index) => index + 1)
    .sort((left, right) => {
      const distanceDifference = Math.abs(left - multiplierNumber) - Math.abs(right - multiplierNumber);
      return distanceDifference || left - right;
    });
  return [...new Set([
    correctAnswer,
    ...nearbyMultipliers.map((value) => value * groupNumber),
  ])].slice(0, 4);
}
