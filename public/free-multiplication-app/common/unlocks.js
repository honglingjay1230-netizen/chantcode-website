export const TRIAL_GROUPS = Object.freeze([6, 7]);
export const FOUNDATION_GROUPS = Object.freeze([1, 10]);
export const FULL_GROUPS = Object.freeze([2, 3, 4, 5, 6, 7, 8, 9]);
export const FULL_LEARNING_GROUPS = Object.freeze([1, ...FULL_GROUPS, 10]);

function isPassed(progress, key) {
  return progress?.[key] === true;
}

export function areGroupTestsPassed(progress, groups) {
  return groups.every((group) => isPassed(progress, `test${group}`));
}

export function isTrialGroupUnlocked(group) {
  return TRIAL_GROUPS.includes(Number(group));
}

export function isFullLearningGroupUnlocked(progress, group) {
  const number = Number(group);
  if (!progress?.fullUnlocked || !FULL_LEARNING_GROUPS.includes(number)) return false;
  // Parent recitation confirmations are reporting-only. Only formal tests and
  // the required tower result control the child's staged learning path.
  if (FOUNDATION_GROUPS.includes(number) || TRIAL_GROUPS.includes(number)) return true;
  if (number === 2) return true;
  if (number === 3) return isPassed(progress, 'test2');
  if (number === 4) return isPassed(progress, 'test3');
  if (number === 5) return isPassed(progress, 'test4');
  if (number === 8) return isPassed(progress, 'mixedGame') || isPassed(progress, 'mixed');
  if (number === 9) return isPassed(progress, 'test8');
  return false;
}

export function isTowerChallengeUnlocked(progress, mode) {
  const towerMode = String(mode);

  // Tower access never depends on parent recitation confirmation. The trial
  // tower uses formal tests; later towers use their named tests/results.
  if (towerMode === 'mixed') return areGroupTestsPassed(progress, TRIAL_GROUPS);
  if (!progress?.fullUnlocked) return false;

  if (towerMode === 'full-2-4') return areGroupTestsPassed(progress, [2, 3, 4]);
  if (towerMode === 'full-5-9') return areGroupTestsPassed(progress, [5, 6, 7, 8, 9]);
  if (towerMode === 'full-2-9') return isPassed(progress, 'fullTower24') && isPassed(progress, 'fullTower59');
  if (towerMode === 'full-2-9-speed') return isPassed(progress, 'fullTower29');
  return false;
}
