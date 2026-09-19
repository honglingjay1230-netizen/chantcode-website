const TRIAL_AUDIO_GROUPS = Object.freeze([6, 7]);
const FULL_AUDIO_GROUPS = Object.freeze([2, 3, 4, 5, 6, 7, 8, 9]);

export function getAudibleTableGroups(fullVersion) {
  return fullVersion ? [...FULL_AUDIO_GROUPS] : [...TRIAL_AUDIO_GROUPS];
}

export function hasTableAudioAccess(group, fullVersion) {
  return Boolean(fullVersion) || TRIAL_AUDIO_GROUPS.includes(Number(group));
}
