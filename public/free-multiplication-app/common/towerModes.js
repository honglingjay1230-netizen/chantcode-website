function createTowerMode(mode, groups, towerTheme, accelerated, total, label, progressKey, mistakesKey) {
  return Object.freeze({
    mode,
    groups: Object.freeze(groups),
    towerTheme,
    accelerated,
    total,
    label,
    progressKey,
    mistakesKey,
  });
}

export const TOWER_MODES = Object.freeze({
  'full-2-4': createTowerMode(
    'full-2-4', [2, 3, 4], 1, false, 39,
    'Groups 2–4 Combined Tower', 'fullTower24', 'towerMistakesFull24',
  ),
  'full-5-9': createTowerMode(
    'full-5-9', [5, 6, 7, 8, 9], 2, false, 25,
    'Groups 5–9 Combined Tower', 'fullTower59', 'towerMistakesFull59',
  ),
  'full-2-9': createTowerMode(
    'full-2-9', [2, 3, 4, 5, 6, 7, 8, 9], 6, false, 64,
    'Groups 2–9 Full Combined Tower', 'fullTower29', 'towerMistakesFull29',
  ),
  'full-2-9-speed': createTowerMode(
    'full-2-9-speed', [2, 3, 4, 5, 6, 7, 8, 9], 9, true, 64,
    'Groups 2–9 Speed Tower', 'fullTower29Speed', 'towerMistakesFull29Speed',
  ),
});

export const TOWER_SPEED_STAGES = Object.freeze([
  Object.freeze({ defeated: 0, movementMultiplier: 1, spawnMultiplier: 1 }),
  Object.freeze({ defeated: 8, movementMultiplier: 1.12, spawnMultiplier: 1.08 }),
  Object.freeze({ defeated: 16, movementMultiplier: 1.25, spawnMultiplier: 1.16 }),
  Object.freeze({ defeated: 24, movementMultiplier: 1.4, spawnMultiplier: 1.24 }),
  Object.freeze({ defeated: 32, movementMultiplier: 1.58, spawnMultiplier: 1.32 }),
]);

export function getTowerMode(mode) {
  return TOWER_MODES[mode] ?? null;
}

export function getTowerSpeed(defeated, accelerated) {
  if (!accelerated) return TOWER_SPEED_STAGES[0];

  return TOWER_SPEED_STAGES.reduce(
    (selected, stage) => defeated >= stage.defeated ? stage : selected,
    TOWER_SPEED_STAGES[0],
  );
}
