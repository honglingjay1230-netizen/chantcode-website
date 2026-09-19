// CHANTCODE WEB REVIEW
import { readPractice } from './web-support.js';
import { mountManualFollowAlong } from './web-follow-along.js?v=20260919-review1';
import { getAppLanguage, setAppLanguage, translateText } from './localize.js';
import { facts, multiplicationChoiceOptions, shuffle } from '../common/multiplication.js';
import { getBestAccuracy, loadProgress, resetLearningProgress, writeProgress } from '../common/progress.js?v=20260919-review1';
import { getTowerMode, TOWER_MODES } from '../common/towerModes.js';
import {
  FOUNDATION_GROUPS,
  FULL_GROUPS,
  FULL_LEARNING_GROUPS,
  TRIAL_GROUPS,
  isFullLearningGroupUnlocked,
  isTowerChallengeUnlocked,
  isTrialGroupUnlocked,
} from '../common/unlocks.js';
import { CHANTCODE_BOOK_HTML } from './book-content.js';
import { TESTFLIGHT_UNLOCK_ALL } from './build-flags.js';
import {
  getAudibleTableGroups,
  hasTableAudioAccess,
} from './overview-audio-access.js';
import {
  getHomeFullMusicPreviewRemaining,
  recordHomeFullMusicPreviewPlay,
} from './home-music-preview.js';
import {
  createFullVersionAccess,
} from './purchases.js';
import { mountReferralPage } from './referral-page.js';
import { qualifyPendingReferral, redeemGiftCode, referralErrorText, REFERRAL_SANDBOX_TESTING, requestSandboxRefund } from './referrals.js';
import { REFERRALS_ENABLED } from './referral-config.js';
import {
  RECITATION_MODES,
  RECITATION_OUTCOMES,
  buildContextualStrings,
  evaluateCompletedRecitationTurn,
  evaluateRecitationCandidates,
  getRecitationFacts,
  getRecitationMode,
  isLikelyIncompleteCompoundChant,
  isLikelyIncompleteTeenChant,
  isForgivingFollowAlongAttempt,
  mergeSpeechCandidateHistory,
} from '../common/recitation.js';
import {
  addChantSpeechListener,
  cancelChantSpeech,
  getChantSpeechAvailability,
  removeChantSpeechListeners,
  requestChantSpeechPermissions,
  startChantSpeech,
  stopChantSpeech,
} from './chant-speech.js';
import {
  lockGameLandscape,
  lockVideoLandscape,
  restorePhonePortrait,
  unlockVideoOrientation,
} from './video-orientation.js';
import {
  playGroupFactsSequentially,
  playListenChoosePrompt,
  playMultiplicationFact,
  multiplicationFactAudioPath,
  setVolume,
  stopVoice
} from '../audio/audio.js';


// CHANTCODE WEB MANUAL FOLLOW-ALONG
let webFollowCleanup = null;
function startWebFollowAlong(list, group) {
  webFollowCleanup?.();
  stopVoice(); session = { type: 'web-follow-along' };
  shell((group ? lessonSteps('recite', group) : '') + '<div id="webFollowAlong"></div>', 'child', 'child', { focus: true });
  webFollowCleanup = mountManualFollowAlong(document.querySelector('#webFollowAlong'), list, multiplicationFactAudioPath);
}
window.addEventListener('pagehide', () => { webFollowCleanup?.(); webFollowCleanup = null; });

const app = document.querySelector('#app');
const FULL_TOWER_MODES = Object.values(TOWER_MODES);
const GROUPS = TRIAL_GROUPS;
const DEV_TEST_MODE = !window.Capacitor?.isNativePlatform?.() && new URLSearchParams(window.location.search).get('dev') === '1';
if (!DEV_TEST_MODE && getAppLanguage() !== 'en') setAppLanguage('en', { reload: false });
// 开发测试开关：只在显式 ?dev=1 入口生效；App Store 正式入口仍使用购买和真实进度。
const DEV_UNLOCK_ALL = true;
// 本地 ?dev=1 与 Codemagic TestFlight 注入都属于测试版；正式 App Store 构建不受影响。
const IS_NATIVE_IOS = Boolean(window.Capacitor?.isNativePlatform?.() && window.Capacitor?.getPlatform?.() === 'ios');
const FULL_ACCESS_TEST_BUILD = TESTFLIGHT_UNLOCK_ALL && IS_NATIVE_IOS;
const IS_TEST_BUILD = DEV_TEST_MODE || FULL_ACCESS_TEST_BUILD;
const DEV_FULL_ACCESS = DEV_UNLOCK_ALL && IS_TEST_BUILD;
// 当前发行版免费开放完整版。改回 false 即恢复现有 StoreKit 权益和付费界面。
const FREE_FULL_ACCESS = true;
const VIDEO = '/free-multiplication-app/audio/music/demo-6-7/clap-clap-multiplication-demo-6-7-mobile-tablet.mp4';
const VIDEO_POSTER = '/free-multiplication-app/audio/music/demo-6-7/84b889b0e02167e4baf9c7d5d4564dc9.png';
const COMPLETE_VIDEO = '/free-multiplication-app/audio/music/demo-2-9/clap-clap-multiplication-english-mobile-tablet-720p-twenty-hybrid.mp4';
const WHY_36_IMAGE = '/free-multiplication-app/ui/assets/brand/chantcode-36-core-chants.png?v=20260913-final';
const WHY_36_VIDEO = '/free-multiplication-app/audio/video/chantcode-why-only-36-chants.mp4';
const FOLLOW_ALONG_SPEECH_END_SILENCE_SECONDS = 1.0;
const FOLLOW_ALONG_NO_SPEECH_TIMEOUT_SECONDS = 3.0;
const FOLLOW_ALONG_FINAL_RESULT_WAIT_SECONDS = 1.2;
function towerExitConfirmation() { return translateText('退出后本次挑战进度不会保存，确定退出吗？'); }
const READING_NAV_THROTTLE_MS = 72;
const READING_NAV_TRIGGER_PX = 12;
const READING_NAV_TOP_PX = 4;
const READING_NAV_TRANSITION_GUARD_MS = 280;
const READING_NAV_INTENT_WINDOW_MS = 1400;
const EDGE_BACK_START_PX = 34;
const EDGE_BACK_TRIGGER_PX = 78;
const EDGE_BACK_AXIS_RATIO = 1.35;
const VIDEO_CONTROL_HIDE_MS = 4000;
const VIDEO_DOUBLE_TAP_MS = 360;
const VIDEO_DOUBLE_TAP_DISTANCE_PX = 72;
const PARENT_GATE_SESSION_MS = 5 * 60 * 1000;
const COACH_SILENCE_MS = 8000;
const FLUENT_PAUSE_WARN_MS = 3000;
const FLUENT_PAUSE_LIMIT_MS = 5000;
const RECITATION_WRONG_CONFIRM_MS = 450;
const RECITATION_COMPOUND_GRACE_MS = 1500;
const APP_VERSION = '2.7';
const WELCOME_IMAGE = '/free-multiplication-app/ui/assets/brand/chantcode-welcome.webp';
const WELCOME_DURATION_MS = 3000;
let progress = loadProgress();
let session = null;
let learningPath = 'trial';
let towerResult = null;
let readingNavigationCleanup = null;
let edgeSwipeNavigationCleanup = null;
let currentRoute = 'home';
const routeHistory = [];
let recitationAdvanceTimer = null;
let recitationSilenceTimer = null;
let recitationRestartTimer = null;
let recitationPartialDecisionTimer = null;
let recitationAttemptCounter = 0;
let chantSpeechListenerHandles = [];
let chantSpeechListenerSetupPromise = null;
let parentGateUnlockedUntil = 0;
let parentGateTargetRoute = 'parent-more';
let parentGateChallenge = null;
let parentGateResumeSelector = '';
let parentReferencePlaybackId = 0;
let welcomeTimer = null;
let landscapeTableOpen = false;
let landscapeTableOrientationLocked = false;
let landscapeTableTrigger = null;
let landscapeTableSession = 0;
let landscapeTableOperation = Promise.resolve();
const videoPlayerControllers = new WeakMap();
const fullVersionAccess = createFullVersionAccess(applyFullVersionEntitlement);

setVolume(0.8);

function save(patch) { progress = writeProgress(progress, patch); }
function hasFullAccess() { return FREE_FULL_ACCESS || DEV_FULL_ACCESS || Boolean(progress.fullUnlocked); }
function applyFullVersionEntitlement(fullUnlocked) {
  const changed = progress.fullUnlocked !== fullUnlocked;
  // fullPurchased 仅记录购买历史，不参与权限判断；其他学习字段原样保留。
  save({ fullUnlocked, ...(fullUnlocked ? { fullPurchased: true } : {}) });
  if (!changed || DEV_FULL_ACCESS || currentRoute === 'welcome') return;
  if (!fullUnlocked) {
    // 播放器挂在 body 下，必须先关闭并收回，页面重绘才会一并移除旧控件。
    document.querySelectorAll('video').forEach((video) => {
      if (!(video.currentSrc || video.src || '').endsWith(COMPLETE_VIDEO)) return;
      video.pause();
      void videoPlayerControllers.get(video)?.close('entitlement-revoked');
    });
  }
  const lessonGroup = currentRoute.match(/^child-(?:song|chant|follow|recite|complete)-(\d+)$/)?.[1];
  const paidLesson = lessonGroup != null && !testUnlocked(Number(lessonGroup));
  const paidSession = session && (
    (session.type === 'tower' && !gameUnlocked(session.mode))
    || (session.mode?.requiresFull === true)
    || (session.scope != null && session.scope !== 'mixed' && !testUnlocked(Number(session.scope)))
    || (session.group != null && !testUnlocked(Number(session.group)))
  );
  if (!fullUnlocked && (paidSession || paidLesson || (!session && currentRoute.startsWith('child') && learningPath === 'full') || currentRoute === 'parent-about-chantcode')) {
    if (isSpeechSession()) void cleanupSpeechSession();
    session = null;
    learningPath = 'trial';
    // 权益撤销不能被退出游戏确认框阻止；不删除已保存的成绩或进度。
    void closeLandscapeTable({ restoreFocus: false });
    go('child-trial');
  } else if (!session) {
    // 重新渲染现有页面，让书籍、视频和学习内容沿用已有的权益限制。
    render(currentRoute);
  }
}
function testIntroLearningComplete() { return Boolean(progress.test6 && progress.test7); }
function isSpeechSession(state = session) { return state?.type === 'recitation' || state?.type === 'spoken-answer'; }

function hasActiveParentAccess() {
  return IS_TEST_BUILD || Date.now() < parentGateUnlockedUntil;
}

function lockParentAccess() {
  parentGateUnlockedUntil = 0;
  parentGateChallenge = null;
  parentGateResumeSelector = '';
}

function createParentGateChallenge() {
  const first = 61 + Math.floor(Math.random() * 29);
  const second = 24 + Math.floor(Math.random() * 26);
  const subtract = 11 + Math.floor(Math.random() * 19);
  return { first, second, subtract, answer: first + second - subtract };
}

function requireActiveParentAccess(returnRoute, resumeSelector = '') {
  if (hasActiveParentAccess()) return true;
  parentGateTargetRoute = returnRoute;
  parentGateChallenge = createParentGateChallenge();
  parentGateResumeSelector = resumeSelector;
  go('parent-gate');
  return false;
}

function bestScoreLabel(attempted, accuracy) { return attempted ? `最好成绩 ${accuracy}%` : '尚无成绩'; }
async function copyText(value) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Clipboard API 不可用时继续使用本地回退方式。
  }

  const input = document.createElement('textarea');
  input.value = value;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  try {
    input.select();
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    input.remove();
  }
}
function navIcon(name) {
  const icons = {
    chantcode: '<svg class="chantcode-crossed-notes" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 5.2 17.4 16.8M17.8 5.2 6.6 16.8"/><path d="M6.2 5.2h4M17.8 5.2h-4"/><ellipse class="nav-note-fill" cx="5.2" cy="18.1" rx="3.2" ry="2.6" transform="rotate(-24 5.2 18.1)"/><ellipse class="nav-note-fill" cx="18.8" cy="18.1" rx="3.2" ry="2.6" transform="rotate(24 18.8 18.1)"/></svg>',
    child: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.1"/><path d="M5.8 19c.7-3.8 3-5.8 6.2-5.8s5.5 2 6.2 5.8"/><path d="M7.1 6.8 5.2 5.2M16.9 6.8l1.9-1.6"/></svg>',
    parent: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8.1" cy="8.2" r="2.8"/><circle cx="16.1" cy="9" r="2.5"/><path d="M2.9 19c.5-3.6 2.7-5.5 5.8-5.5s5.2 1.9 5.7 5.5"/><path d="M13.5 14.6c.9-.8 2.1-1.2 3.5-1.2 2.4 0 4 1.7 4.3 4.8"/></svg>',
    progress: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V13M10 19V9M16 19V5M3 19h18"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.8"/><circle cx="8" cy="12" r="1" class="nav-dot"/><circle cx="12" cy="12" r="1" class="nav-dot"/><circle cx="16" cy="12" r="1" class="nav-dot"/></svg>',
  };
  return `<span class="mode-icon">${icons[name] || icons.chantcode}</span>`;
}
function brandLockup(active = false) {
  return `<button class="mode-home-button brand-lockup ${active ? 'active' : ''}" data-route="home" type="button" aria-label="ChantCode Home">${navIcon('chantcode')}<span>ChantCode</span></button>`;
}
function globalParentButton(active = false) { return `<button class="mode-home-button parent-mode-button ${active ? 'active' : ''}" data-route="parent-guide" type="button" aria-label="Parent">${navIcon('parent')}<span>Parent</span></button>`; }
function globalChildButton(active = false) { return `<button class="mode-home-button child-mode-button ${active ? 'active' : ''}" data-route="child" type="button" aria-label="Child">${navIcon('child')}<span>Child</span></button>`; }
function globalProgressButton(active = false) { return `<button class="mode-home-button global-progress-button ${active ? 'active' : ''}" data-route="parent-progress" type="button" aria-label="Progress">${navIcon('progress')}<span>Progress</span></button>`; }
function globalMoreButton(active = false) { return `<button class="mode-home-button global-more-button ${active ? 'active' : ''}" data-route="parent-more" type="button" aria-label="More">${navIcon('more')}<span>More</span></button>`; }
function globalModeTools(mode = '', activeRoute = '') {
  const parentHomeActive = mode === 'parent' && activeRoute !== 'parent-progress' && activeRoute !== 'parent-more';
  const chantCodeActive = mode === 'home' && !activeRoute;
  return `<nav class="mode-tools" aria-label="Global navigation">${brandLockup(chantCodeActive)}${globalChildButton(mode === 'child')}${globalParentButton(parentHomeActive)}${globalProgressButton(activeRoute === 'parent-progress')}${globalMoreButton(activeRoute === 'parent-more')}</nav>`;
}
function bindRoutes() {
  document.querySelectorAll('[data-route]').forEach((button) => { button.onclick = () => go(button.dataset.route); });
  document.querySelectorAll('[data-purchase-full-version]').forEach((button) => {
    button.onclick = () => void purchaseFullVersionFromButton(button);
  });
}

function clearReadingNavigation() {
  readingNavigationCleanup?.();
  readingNavigationCleanup = null;
}

function clearEdgeSwipeNavigation() {
  edgeSwipeNavigationCleanup?.();
  edgeSwipeNavigationCleanup = null;
}

function navigateBack() {
  const previousRoute = routeHistory.at(-1);
  if (!previousRoute) return false;
  if (!go(previousRoute, { fromHistory: true })) return false;
  routeHistory.pop();
  return true;
}

function bindEdgeSwipeNavigation() {
  clearEdgeSwipeNavigation();
  if (!routeHistory.length) return;

  const swipeRoot = app.querySelector('.app-shell, .first-experience');
  if (!swipeRoot) return;

  let tracking = false;
  let cancelled = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  const excludedSelector = 'button, a, input, select, textarea, label, summary, video, audio, iframe, canvas, [role="button"], [contenteditable="true"], .core-table-scroll, .lesson-steps';

  const onTouchStart = (event) => {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    if (!touch || touch.clientX > EDGE_BACK_START_PX) return;
    if (event.target instanceof Element && event.target.closest(excludedSelector)) return;
    tracking = true;
    cancelled = false;
    startX = currentX = touch.clientX;
    startY = currentY = touch.clientY;
  };

  const onTouchMove = (event) => {
    if (!tracking || event.touches.length !== 1) return;
    const touch = event.touches[0];
    if (!touch) return;
    currentX = touch.clientX;
    currentY = touch.clientY;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    if (deltaX < -8 || Math.abs(deltaY) > Math.max(18, Math.abs(deltaX) / EDGE_BACK_AXIS_RATIO)) {
      cancelled = true;
      tracking = false;
    }
  };

  const onTouchEnd = () => {
    if (!tracking || cancelled) {
      tracking = false;
      return;
    }
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    tracking = false;
    if (deltaX >= EDGE_BACK_TRIGGER_PX && deltaX > Math.abs(deltaY) * EDGE_BACK_AXIS_RATIO) {
      navigateBack();
    }
  };

  const onTouchCancel = () => {
    tracking = false;
    cancelled = true;
  };

  swipeRoot.addEventListener('touchstart', onTouchStart, { passive: true });
  swipeRoot.addEventListener('touchmove', onTouchMove, { passive: true });
  swipeRoot.addEventListener('touchend', onTouchEnd, { passive: true });
  swipeRoot.addEventListener('touchcancel', onTouchCancel, { passive: true });

  edgeSwipeNavigationCleanup = () => {
    swipeRoot.removeEventListener('touchstart', onTouchStart);
    swipeRoot.removeEventListener('touchmove', onTouchMove);
    swipeRoot.removeEventListener('touchend', onTouchEnd);
    swipeRoot.removeEventListener('touchcancel', onTouchCancel);
  };
}

function bindReadingNavigation() {
  clearReadingNavigation();
  const readingRoot = app.querySelector('.app-shell, .first-experience');
  if (!readingRoot) return;

  const navigationBar = readingRoot.querySelector('.topbar, .standalone-home-tool');
  if (!navigationBar) return;

  // Only Child mode may temporarily hide the top controls while the child is
  // reading or practising. Parent, Progress, More, and ChantCode pages keep
  // the global controls visible at every scroll position.
  if (!readingRoot.classList.contains('mode-child')) {
    readingRoot.classList.remove('is-nav-hidden');
    navigationBar.setAttribute('aria-hidden', 'false');
    return;
  }

  const scrollPositions = new Map();
  let throttleTimer = null;
  let pendingDirection = 0;
  let accumulatedDistance = 0;
  let forceShowAtTop = false;
  let ignoreScrollUntil = 0;
  let userScrollDirection = 0;
  let lastUserScrollIntentAt = 0;
  let touchX = 0;
  let touchY = 0;
  let suppressBlankClickUntil = 0;
  const landscapeQuery = window.matchMedia('(orientation: landscape)');

  const setNavigationHidden = (hidden) => {
    const currentlyHidden = readingRoot.classList.contains('is-nav-hidden');
    if (currentlyHidden === hidden) {
      navigationBar.setAttribute('aria-hidden', String(hidden));
      return;
    }
    ignoreScrollUntil = window.performance.now() + READING_NAV_TRANSITION_GUARD_MS;
    readingRoot.classList.toggle('is-nav-hidden', hidden);
    navigationBar.setAttribute('aria-hidden', String(hidden));
  };

  const scrollTopFor = (target) => {
    if (target === window || target === document || target === document.documentElement || target === document.body) {
      return Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
    }
    return target instanceof Element ? Math.max(0, target.scrollTop) : 0;
  };

  const processPendingScroll = () => {
    throttleTimer = null;
    if (forceShowAtTop) {
      setNavigationHidden(false);
    } else if (pendingDirection > 0) {
      setNavigationHidden(true);
    } else if (pendingDirection < 0) {
      setNavigationHidden(false);
    }
    pendingDirection = 0;
    forceShowAtTop = false;
  };

  const scheduleNavigationUpdate = () => {
    if (throttleTimer) return;
    throttleTimer = window.setTimeout(processPendingScroll, READING_NAV_THROTTLE_MS);
  };

  const markUserScrollIntent = (direction) => {
    userScrollDirection = direction;
    lastUserScrollIntentAt = window.performance.now();
  };

  const onWheel = (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || Math.abs(event.deltaY) < 1) return;
    markUserScrollIntent(event.deltaY > 0 ? 1 : -1);
  };

  const onTouchStart = (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchX = touch.clientX;
    touchY = touch.clientY;
  };

  const onTouchMove = (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    const deltaX = touch.clientX - touchX;
    const deltaY = touch.clientY - touchY;
    if (Math.abs(deltaX) >= 6 || Math.abs(deltaY) >= 6) {
      suppressBlankClickUntil = window.performance.now() + 320;
    }
    if (Math.abs(deltaY) > Math.abs(deltaX) * 1.15 && Math.abs(deltaY) >= 6) {
      markUserScrollIntent(deltaY < 0 ? 1 : -1);
      touchX = touch.clientX;
      touchY = touch.clientY;
    }
  };

  const onBlankClick = (event) => {
    if (!readingRoot.classList.contains('is-nav-hidden')) return;
    if (window.performance.now() < suppressBlankClickUntil) return;
    if (!(event.target instanceof Element)) return;
    const interactiveSelector = 'button, a, input, select, textarea, label, summary, video, audio, [role="button"], [data-route]';
    if (event.target.closest(interactiveSelector)) return;
    setNavigationHidden(false);
  };

  const onOrientationChange = (event) => {
    const compactChildLandscape = readingRoot.classList.contains('is-child-landscape-fullscreen') && event.matches;
    setNavigationHidden(compactChildLandscape);
  };

  const onScroll = (event) => {
    const target = event.target === document ? window : event.target;
    const currentScrollTop = scrollTopFor(target);
    const previousScrollTop = scrollPositions.get(target) ?? currentScrollTop;
    const delta = currentScrollTop - previousScrollTop;
    scrollPositions.set(target, currentScrollTop);

    if (currentScrollTop <= READING_NAV_TOP_PX) {
      accumulatedDistance = 0;
      pendingDirection = 0;
      forceShowAtTop = true;
      scheduleNavigationUpdate();
      return;
    }

    if (window.performance.now() < ignoreScrollUntil) return;
    if (Math.abs(delta) < 1) return;
    const direction = delta > 0 ? 1 : -1;
    const hasRecentUserIntent = window.performance.now() - lastUserScrollIntentAt <= READING_NAV_INTENT_WINDOW_MS;
    if (!hasRecentUserIntent || direction !== userScrollDirection) return;
    if (direction !== pendingDirection) accumulatedDistance = 0;
    pendingDirection = direction;
    accumulatedDistance += Math.abs(delta);
    if (accumulatedDistance < READING_NAV_TRIGGER_PX) return;

    accumulatedDistance = 0;
    scheduleNavigationUpdate();
  };

  const initialWindowScrollTop = scrollTopFor(window);
  scrollPositions.set(window, initialWindowScrollTop);
  scrollPositions.set(document, initialWindowScrollTop);
  scrollPositions.set(document.documentElement, initialWindowScrollTop);
  scrollPositions.set(document.body, initialWindowScrollTop);
  readingRoot.querySelectorAll('*').forEach((element) => {
    if (element.scrollHeight > element.clientHeight + 1) {
      scrollPositions.set(element, scrollTopFor(element));
    }
  });

  setNavigationHidden(readingRoot.classList.contains('is-child-landscape-fullscreen') && landscapeQuery.matches);
  landscapeQuery.addEventListener?.('change', onOrientationChange);
  readingRoot.addEventListener('wheel', onWheel, { passive: true });
  readingRoot.addEventListener('touchstart', onTouchStart, { passive: true });
  readingRoot.addEventListener('touchmove', onTouchMove, { passive: true });
  readingRoot.addEventListener('click', onBlankClick);
  readingRoot.addEventListener('scroll', onScroll, { capture: true, passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  readingNavigationCleanup = () => {
    if (throttleTimer) window.clearTimeout(throttleTimer);
    readingRoot.removeEventListener('wheel', onWheel);
    readingRoot.removeEventListener('touchstart', onTouchStart);
    readingRoot.removeEventListener('touchmove', onTouchMove);
    readingRoot.removeEventListener('click', onBlankClick);
    readingRoot.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('scroll', onScroll);
    landscapeQuery.removeEventListener?.('change', onOrientationChange);
  };
}

function shell(content, mode, active, options = {}) {
  void closeLandscapeTable({ restoreFocus: false });
  void restorePhonePortrait();
  const parent = mode === 'parent';
  const focus = Boolean(options.focus && !parent);
  const homeScreen = Boolean(options.homeScreen);
  const immersive = !parent;
  const hideModeNav = true;
  const globalMode = options.globalMode || (parent ? 'parent' : 'child');
  const shellClass = options.shellClass ? ` ${options.shellClass}` : '';
  const pageClass = options.pageClass ? ` ${options.pageClass}` : '';

  app.innerHTML = `<div class="app-shell mode-${mode}${immersive ? ' is-immersive' : ''}${focus ? ' is-focus-mode' : ''}${hideModeNav ? ' has-no-mode-nav' : ''}${shellClass}">
    <header class="topbar" aria-hidden="false">
      <div class="topbar-inner">
        ${globalModeTools(globalMode, active)}
      </div>
    </header>
    <main class="page${homeScreen ? ' child-home-page' : ''}${pageClass}">
      ${content}
    </main>
  </div>`;
  bindLandscapeTableControls(app);
  bindRoutes();
  bindReadingNavigation();
  bindEdgeSwipeNavigation();
}

function go(route, options = {}) {
  webFollowCleanup?.(); webFollowCleanup = null;
  if (session?.type === 'tower' && !window.confirm(towerExitConfirmation())) return false;
  if (isSpeechSession()) void cleanupSpeechSession();
  const requestedRoute = DEV_TEST_MODE
    && String(route) === 'child-full'
    && !testIntroLearningComplete()
      ? 'child-trial'
      : String(route);
  route = requestedRoute;
  if (requestedRoute.startsWith('child')) lockParentAccess();
  if (!options.fromHistory && route !== currentRoute) routeHistory.push(currentRoute);
  currentRoute = route;
  stopVoice(); session = null; window.scrollTo(0, 0); render(route);
  return true;
}
function render(route) {
  if (route === 'home') return parentUnderstand();
  if (route === 'parent-gate') return parentalGate();
  if (route === 'parent-home') return parentGuide(); // 旧入口兼容：现在归入家长首页
  if (route === 'parent-understand') return parentUnderstand();
  if (route === 'parent-guide') return parentGuide();
  if (route === 'parent-progress') return parentProgress();
  if (route === 'parent-recitation-check') return parentRecitationCheck();
  if (route.startsWith('parent-recitation-check-')) return parentRecitationCheckDetail(route.slice('parent-recitation-check-'.length));
  if (route === 'parent-more') return parentMore();
  if (route === 'parent-referrals') {
    if (FREE_FULL_ACCESS || !REFERRALS_ENABLED) return go('parent-more', { fromHistory: true });
    if (!requireActiveParentAccess('parent-referrals')) return;
    return parentReferrals();
  }
  if (route === 'parent-about-chantcode') {
    if (!requireActiveParentAccess('parent-about-chantcode')) return;
    if (!hasFullAccess()) return go('parent-more', { fromHistory: true });
    return parentAboutChantCode();
  }
  if (route === 'parent-support') return parentSupport();
  if (route === 'parent-website') return parentSupport('website');
  if (route === 'parent-contact') return parentSupport('contact');
  if (route === 'parent-privacy') return parentPrivacy();
  if (route === 'parent-full') return go('parent-more', { fromHistory: true });
  if (route === 'chant-overview') return why36CoreFacts();
  if (route === 'parent-trial') return parentGuide(); // 旧入口兼容：试用说明并入统一使用指导
  if (route === 'child') return childHome();

  if (route === 'child-trial') {
    learningPath = 'trial';
    return trialChildHome();
  }

  if (route === 'child-full') {
    if (!hasFullAccess()) return go('child-trial', { fromHistory: true });
    learningPath = 'full';
    return fullChildHome();
  }

  if (route === 'child-practice') return childPractice();
  if (route === 'child-challenges') return childChallenges();
  if (route.startsWith('listen-choose-')) return startListenChoose(route.slice('listen-choose-'.length));
  if (route.startsWith('test-')) return startTest(route.split('-').at(-1));
  if (route.startsWith('game-')) return startGame(route.slice('game-'.length));
  if (route.startsWith('child-complete-')) {
    return childComplete(route.slice('child-complete-'.length));
  }

  const lesson = route.match(/^child-(song|chant|follow|recite|complete)-(1|2|3|4|5|6|7|8|9|10|mixed)$/);
  if (lesson) return childLesson(lesson[1], lesson[2]);

  parentUnderstand();
}

function showWelcome() {
  void closeLandscapeTable({ restoreFocus: false });
  void restorePhonePortrait();
  currentRoute = 'welcome';
  app.innerHTML = `<section class="welcome-screen" aria-label="Welcome to ChantCode">
    <div class="welcome-art">
      <img src="${WELCOME_IMAGE}" alt="ChantCode. The best way to help your child master multiplication." draggable="false">
      <button class="welcome-start" type="button" aria-label="Get Started — open ChantCode home"></button>
    </div>
  </section>`;

  const enterHome = () => {
    if (welcomeTimer !== null) window.clearTimeout(welcomeTimer);
    welcomeTimer = null;
    if (currentRoute !== 'welcome') return;
    currentRoute = 'home';
    window.scrollTo(0, 0);
    parentUnderstand();
  };

  const startWelcomeTimer = () => {
    if (welcomeTimer !== null || currentRoute !== 'welcome') return;
    welcomeTimer = window.setTimeout(enterHome, WELCOME_DURATION_MS);
  };

  document.querySelector('.welcome-start')?.addEventListener('click', enterHome, { once: true });
  const welcomeImage = document.querySelector('.welcome-art > img');
  if (welcomeImage?.complete) window.requestAnimationFrame(startWelcomeTimer);
  else {
    welcomeImage?.addEventListener('load', startWelcomeTimer, { once: true });
    welcomeImage?.addEventListener('error', startWelcomeTimer, { once: true });
  }
}

function why36CoreFacts() {
  const table = multiplicationTable(false, false);
  shell(`<section class="why36-page">
    ${pageHead(
      'Why 36 Core Facts?',
      'Memorize each commutative fact only once',
      'The core 2–9 table becomes much smaller when the 1s and repeated reversed facts are removed.'
    )}

    <section class="why36-summary-grid" aria-label="Why ChantCode uses 36 core facts">
      <article class="why36-summary-card">
        <small>Core range</small>
        <strong>2–9</strong>
        <p>The core chant path focuses on multiplication facts from 2 through 9.</p>
      </article>
      <article class="why36-summary-card">
        <small>One direction</small>
        <strong>6 × 7</strong>
        <p>Because 6 × 7 and 7 × 6 have the same answer, the chant only needs one stored direction.</p>
      </article>
      <article class="why36-summary-card">
        <small>Total</small>
        <strong>36</strong>
        <p>After removing the 1s and duplicated commutative facts, 36 core facts remain.</p>
      </article>
    </section>

    <section class="structure-card why36-table-card multiplication-table-surface">
      <div class="core-overview-copy">
        <span class="kicker">The 36 Core Facts</span>
        <h2>One compact path through the 2–9 table</h2>
        <p>Children first memorize the compact chant set, then practice retrieving the same facts in either factor order.</p>
      </div>
      <div class="core-table-scroll overview-table-scroll" aria-label="The 36 core multiplication facts from groups 2 through 9">
        <div class="core-table">${table}</div>
      </div>
    </section>

    <section class="why36-explanation">
      <article>
        <span aria-hidden="true">1</span>
        <div><h3>Memorize once</h3><p>Store a short chant for each new core fact instead of memorizing both reversed versions.</p></div>
      </article>
      <article>
        <span aria-hidden="true">2</span>
        <div><h3>Retrieve in either order</h3><p>Tests include reversed factor order so children learn that switching the factors keeps the same answer.</p></div>
      </article>
      <article>
        <span aria-hidden="true">3</span>
        <div><h3>Build automatic recall</h3><p>Repeated mixed retrieval shifts practice away from re-calculating each fact and toward direct recall.</p></div>
      </article>
    </section>

    <div class="action-row why36-actions">
      <button class="secondary" data-route="parent-guide">Open Parent Guide</button>
      <button class="primary" data-route="child-trial">Try Groups 6 and 7</button>
    </div>
  </section>`, 'parent', '', { globalMode: 'home' });
}

function videoPlayerControlsMarkup({ loop = false } = {}) {
  return `<div class="video-player-ui" data-video-controls>
    <button class="video-player-close" type="button" data-video-close aria-label="Close video" title="Close video"><span aria-hidden="true">×</span></button>
    <button class="video-player-center-play" type="button" data-video-center-play aria-label="Play video" title="Play video"><span aria-hidden="true">▶</span></button>
    <div class="video-player-controls" aria-label="Video controls">
      <button type="button" data-video-play aria-label="Play" title="Play">▶</button>
      ${loop ? '<button type="button" data-video-loop aria-label="Turn on video loop" title="Video loop off" aria-pressed="false"><span aria-hidden="true">↻</span></button>' : ''}
      <span class="video-player-time" data-video-current-time aria-label="Current time">0:00</span>
      <label class="video-player-progress">
        <span class="sr-only">Video progress</span>
        <input type="range" data-video-progress min="0" max="100" value="0" step="0.1" aria-label="Video progress">
      </label>
      <span class="video-player-time" data-video-duration aria-label="Video duration">0:00</span>
    </div>
  </div>`;
}

function home() {
  clearReadingNavigation();
  clearEdgeSwipeNavigation();
  const table = multiplicationTable();
  app.innerHTML = `<main class="first-experience">
    <div class="standalone-home-tool"><div class="topbar-inner">${globalModeTools('home')}</div></div>
    <section class="first-experience-content">
      <section class="home-intro" aria-labelledby="homeTitle">
        <span class="home-kicker">核心 9×9 乘法口诀</span>
        <h1 id="homeTitle">9×9 乘法 <span>ChantCode</span></h1>
        <p class="home-subtitle">把36句核心乘法口诀按顺序排列，帮助孩子记忆和快速回想。</p>
        <div class="home-explanation">
          <p>中国儿童长期使用简短的乘法口诀学习乘法，不需要把交换顺序后的两个方向分别背诵。</p>
          <p>去掉1组和交换顺序的重复题后，只需要记住<strong>36句核心口诀</strong>。记住以后，练习重点会从临时计算转向快速提取已经掌握的答案。</p>
        </div>
        <div class="home-recall-path" aria-label="学习路径">
          <span>顺序记忆</span><b aria-hidden="true">→</b><span>随机提取</span><b aria-hidden="true">→</b><span>混合练习</span><b aria-hidden="true">→</b><span>自动回想</span>
        </div>
      </section>

      <section class="chant-showcase multiplication-table-surface" aria-labelledby="showcaseTitle">
        <div class="showcase-heading">
          <div><span class="showcase-label">完整乘法口诀</span><h2 id="showcaseTitle">先看规律，再听口诀</h2></div>
          <p>2～9组 · 36句核心口诀</p>
        </div>
        <div class="chant-media" id="chantMedia" data-state="table">
          <div class="chant-table-state" id="chantTableState">
            <div class="home-table-scroll" aria-label="2组到9组的36句核心乘法口诀">
              <div class="core-table">${table}</div>
            </div>
            <div class="chant-action-row">
  <button class="chant-play" id="playCompleteChant" type="button" aria-label="播放完整乘法口诀">
    <span class="chant-play-icon" aria-hidden="true">▶</span>
    <span>播放完整<br>乘法口诀</span>
  </button>

</div>
          </div>
          <div class="chant-video-state" id="chantVideoState" hidden>
            <div class="video-player-shell" data-video-player data-lock-landscape role="dialog" aria-modal="true" aria-label="Multiplication music video">
              <video id="completeChantVideo" playsinline webkit-playsinline preload="metadata" controlslist="nodownload noplaybackrate noremoteplayback" disablepictureinpicture src="${COMPLETE_VIDEO}" aria-label="完整2到9组乘法口诀视频"></video>
              ${videoPlayerControlsMarkup({ loop: true })}
            </div>
          </div>
        </div>
        <p class="showcase-hint" id="showcaseHint">点击播放，收听完整2～9组乘法口诀。</p>
      </section>
      <div class="first-next">
        <button class="text-button" data-route="parent-guide">了解 ChantCode 的学习方法 <span aria-hidden="true">→</span></button>
      </div>
    </section>
  </main>`;
  bindLandscapeTableControls(app);
  const video = document.querySelector('#completeChantVideo');
  const media = document.querySelector('#chantMedia');
  const tableState = document.querySelector('#chantTableState');
  const videoState = document.querySelector('#chantVideoState');
  const playButton = document.querySelector('#playCompleteChant');
  const hint = document.querySelector('#showcaseHint');
  const showTable = () => {
    video.pause();
    video.currentTime = 0;
    media.dataset.state = 'table';
    tableState.hidden = false;
    videoState.hidden = true;
    hint.textContent = '点击播放，收听完整2～9组乘法口诀。';
  };
  const videoPlayer = bindCustomVideoPlayer(document.querySelector('[data-video-player]'), {
    lockLandscape: true,
    onClose: showTable,
  });
  playButton.addEventListener('click', async () => {
    media.dataset.state = 'video';
    tableState.hidden = true;
    videoState.hidden = false;
    hint.textContent = '乘法音乐已打开。';
    try {
      await videoPlayer?.open();
    } catch (error) {
      await videoPlayer?.close();
    }
  });
  bindRoutes();
  bindReadingNavigation();
  bindEdgeSwipeNavigation();
}

function bindCustomVideoPlayer(player, {
  lockLandscape = true,
  inline = false,
  onClose,
  onPlaybackCompleted,
  tapVideoSurfaceTogglesPlayback = false,
} = {}) {
  if (!player) return null;
  const video = player.querySelector('video');
  const controls = player.querySelector('[data-video-controls]');
  const controlBar = player.querySelector('.video-player-controls');
  const playButton = player.querySelector('[data-video-play]');
  const loopButton = player.querySelector('[data-video-loop]');
  const centerPlayButton = player.querySelector('[data-video-center-play]');
  const progress = player.querySelector('[data-video-progress]');
  const currentTimeLabel = player.querySelector('[data-video-current-time]');
  const durationLabel = player.querySelector('[data-video-duration]');
  const closeButton = player.querySelector('[data-video-close]');
  if (!video || !controls || !controlBar || !playButton || !centerPlayButton || !progress || !currentTimeLabel || !durationLabel || !closeButton) return null;
  const poster = video.getAttribute('poster') || '';

  let controlsHideTimer = null;
  let controlsInteracting = false;
  let lastVideoTouch = null;
  let suppressVideoClickUntil = 0;
  let opened = false;
  let closing = false;
  let loopEnabled = false;
  let landscapeLockWanted = false;
  let landscapeLockOwned = false;
  let orientationOperation = Promise.resolve();
  const originalParent = player.parentNode;
  const originalNextSibling = player.nextSibling;

  video.controls = false;
  video.playsInline = true;
  player.hidden = true;

  const clearControlsHideTimer = () => {
    if (controlsHideTimer === null) return;
    window.clearTimeout(controlsHideTimer);
    controlsHideTimer = null;
  };
  const setControlsVisible = (visible) => {
    player.dataset.controlsVisible = visible ? 'true' : 'false';
    centerPlayButton.setAttribute('aria-hidden', String(!visible));
    controlBar.setAttribute('aria-hidden', String(!visible));
  };
  const hideControls = ({ force = false } = {}) => {
    clearControlsHideTimer();
    if (controlsInteracting && !force) return;
    setControlsVisible(false);
  };
  const scheduleControlsHide = () => {
    clearControlsHideTimer();
    if (!opened || closing || controlsInteracting || video.paused || video.ended) return;
    controlsHideTimer = window.setTimeout(() => {
      controlsHideTimer = null;
      hideControls();
    }, VIDEO_CONTROL_HIDE_MS);
  };
  const showControls = () => {
    setControlsVisible(true);
    scheduleControlsHide();
  };
  const beginControlInteraction = () => {
    controlsInteracting = true;
    clearControlsHideTimer();
    setControlsVisible(true);
  };
  const endControlInteraction = () => {
    controlsInteracting = false;
    scheduleControlsHide();
  };
  const mountPlayerAtViewportRoot = () => {
    if (inline) return;
    if (player.parentNode !== document.body) document.body.appendChild(player);
  };
  const restorePlayerMount = () => {
    if (inline) return;
    if (!originalParent?.isConnected) {
      player.remove();
      return;
    }
    const referenceNode = originalNextSibling?.parentNode === originalParent ? originalNextSibling : null;
    originalParent.insertBefore(player, referenceNode);
  };
  const requestLandscapeLock = () => {
    if (!lockLandscape) return orientationOperation;
    landscapeLockWanted = true;
    orientationOperation = orientationOperation.then(async () => {
      if (!landscapeLockWanted || landscapeLockOwned) return;
      landscapeLockOwned = await lockVideoLandscape();
      if (landscapeLockOwned && !landscapeLockWanted) {
        await unlockVideoOrientation();
        landscapeLockOwned = false;
      }
    });
    return orientationOperation;
  };
  const releaseLandscapeLock = () => {
    if (!lockLandscape) return orientationOperation;
    landscapeLockWanted = false;
    orientationOperation = orientationOperation.then(async () => {
      if (!landscapeLockOwned) return;
      await unlockVideoOrientation();
      landscapeLockOwned = false;
    });
    return orientationOperation;
  };
  const updatePlayButton = () => {
    const playing = !video.paused && !video.ended;
    player.dataset.playing = playing ? 'true' : 'false';
    playButton.textContent = playing ? 'Ⅱ' : '▶';
    playButton.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    playButton.title = playing ? 'Pause' : 'Play';
  };
  const setLoopEnabled = (enabled) => {
    if (!loopButton) return;
    loopEnabled = Boolean(enabled);
    player.dataset.looping = loopEnabled ? 'true' : 'false';
    loopButton.setAttribute('aria-pressed', String(loopEnabled));
    loopButton.setAttribute('aria-label', loopEnabled ? 'Turn off video loop' : 'Turn on video loop');
    loopButton.title = loopEnabled ? 'Video loop on' : 'Video loop off';
  };
  const formatVideoTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const wholeSeconds = Math.floor(seconds);
    const minutes = Math.floor(wholeSeconds / 60);
    return `${minutes}:${String(wholeSeconds % 60).padStart(2, '0')}`;
  };
  const updateProgress = () => {
    progress.value = video.duration ? String((video.currentTime / video.duration) * 100) : '0';
    currentTimeLabel.textContent = formatVideoTime(video.currentTime);
    durationLabel.textContent = formatVideoTime(video.duration);
  };
  const stopVideo = () => {
    video.pause();
    if (poster) video.poster = poster;
    try { video.currentTime = 0; } catch {}
    progress.value = '0';
    delete player.dataset.ending;
    updatePlayButton();
  };
  const startPlayback = async () => {
    if (!opened || closing || !player.isConnected) return;
    delete player.dataset.ending;
    if (video.ended) {
      try { video.currentTime = 0; } catch {}
    }
    try {
      await video.play();
      if (!opened || closing || !player.isConnected) {
        video.pause();
        return;
      }
      hideControls({ force: true });
    } catch {
      showControls();
    }
  };
  const pauseFromDoubleActivation = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (!opened || closing || video.paused || video.ended) return;
    video.pause();
    showControls();
  };
  const togglePlaybackFromVideoSurface = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!opened || closing) return;
    showControls();
    if (!video.paused && !video.ended) {
      video.pause();
      return;
    }
    if (video.ended) {
      try { video.currentTime = 0; } catch {}
    }
    try {
      await video.play();
    } catch {}
    if (!opened || closing || !player.isConnected) {
      video.pause();
      return;
    }
    showControls();
  };
  const close = async (reason = 'user') => {
    if (!opened || closing) return;
    closing = true;
    opened = false;
    clearControlsHideTimer();
    controlsInteracting = false;
    lastVideoTouch = null;
    suppressVideoClickUntil = 0;
    hideControls({ force: true });
    stopVideo();
    player.hidden = true;
    delete player.dataset.open;
    if (!inline) document.body.classList.remove('has-video-overlay');
    restorePlayerMount();
    try {
      await releaseLandscapeLock();
      onClose?.(reason);
    } finally {
      closing = false;
    }
  };
  const open = async () => {
    if (opened || closing || !originalParent?.isConnected) return;
    opened = true;
    lastVideoTouch = null;
    suppressVideoClickUntil = 0;
    if (poster) video.poster = poster;
    stopVideo();
    mountPlayerAtViewportRoot();
    player.hidden = false;
    player.dataset.open = 'true';
    if (!inline) document.body.classList.add('has-video-overlay');
    showControls();
    window.requestAnimationFrame(() => centerPlayButton.focus({ preventScroll: true }));
    await requestLandscapeLock();
  };

  centerPlayButton.onclick = (event) => {
    event.stopPropagation();
    void startPlayback();
  };
  playButton.onclick = (event) => {
    event.stopPropagation();
    if (video.paused || video.ended) void startPlayback();
    else {
      video.pause();
      showControls();
    }
  };
  if (loopButton) {
    loopButton.onclick = (event) => {
      event.stopPropagation();
      setLoopEnabled(!loopEnabled);
      showControls();
    };
  }
  closeButton.onclick = (event) => {
    event.stopPropagation();
    void close('user');
  };
  progress.oninput = () => {
    if (video.duration) video.currentTime = (Number(progress.value) / 100) * video.duration;
  };
  for (const eventName of ['pointerdown', 'touchstart']) {
    progress.addEventListener(eventName, beginControlInteraction, { passive: true });
  }
  for (const eventName of ['pointerup', 'pointercancel', 'touchend', 'touchcancel', 'change']) {
    progress.addEventListener(eventName, endControlInteraction, { passive: true });
  }
  progress.addEventListener('focus', beginControlInteraction);
  progress.addEventListener('blur', endControlInteraction);
  video.addEventListener('click', (event) => {
    if (!opened || closing) return;
    if (tapVideoSurfaceTogglesPlayback) {
      void togglePlaybackFromVideoSurface(event);
      return;
    }
    if (Date.now() < suppressVideoClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (player.dataset.controlsVisible === 'true') hideControls({ force: true });
    else showControls();
  });
  video.addEventListener('dblclick', (event) => {
    if (tapVideoSurfaceTogglesPlayback) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    suppressVideoClickUntil = Date.now() + VIDEO_DOUBLE_TAP_MS;
    pauseFromDoubleActivation(event);
  });
  video.addEventListener('touchend', (event) => {
    if (tapVideoSurfaceTogglesPlayback) return;
    if (!opened || closing || event.changedTouches.length !== 1) {
      lastVideoTouch = null;
      return;
    }
    const touch = event.changedTouches[0];
    const now = Date.now();
    const doubleTap = lastVideoTouch
      && now - lastVideoTouch.at <= VIDEO_DOUBLE_TAP_MS
      && Math.hypot(touch.clientX - lastVideoTouch.x, touch.clientY - lastVideoTouch.y) <= VIDEO_DOUBLE_TAP_DISTANCE_PX;
    if (!doubleTap) {
      lastVideoTouch = { at: now, x: touch.clientX, y: touch.clientY };
      return;
    }
    lastVideoTouch = null;
    suppressVideoClickUntil = now + VIDEO_DOUBLE_TAP_MS;
    pauseFromDoubleActivation(event);
  }, { passive: false });
  video.addEventListener('play', () => {
    updatePlayButton();
    scheduleControlsHide();
  });
  video.addEventListener('pause', () => {
    updatePlayButton();
    showControls();
  });
  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('loadedmetadata', updateProgress);
  video.addEventListener('ended', () => {
    if (!opened || closing) return;
    let replayAllowed = true;
    try { replayAllowed = onPlaybackCompleted?.() !== false; } catch { replayAllowed = false; }
    if (loopEnabled && replayAllowed) {
      try { video.currentTime = 0; } catch {}
      updateProgress();
      void startPlayback();
      return;
    }
    if (!replayAllowed) setLoopEnabled(false);
    void close('ended');
  });
  video.addEventListener('error', () => {
    if (opened && !closing) void close('error');
  });
  window.addEventListener('pagehide', () => {
    if (!opened) return;
    opened = false;
    clearControlsHideTimer();
    stopVideo();
    player.hidden = true;
    delete player.dataset.open;
    if (!inline) document.body.classList.remove('has-video-overlay');
    restorePlayerMount();
    void releaseLandscapeLock();
  }, { once: true });

  updatePlayButton();
  setLoopEnabled(false);
  setControlsVisible(false);
  const controller = { close, open };
  videoPlayerControllers.set(video, controller);
  return controller;
}

function tableLandscapeEntryMarkup(extraClass = '') {
  return `<button class="chant-play table-landscape-entry${extraClass ? ` ${extraClass}` : ''}" type="button" data-table-landscape-control aria-label="View this multiplication table full screen in landscape" aria-haspopup="dialog" aria-expanded="false">
    <span class="chant-play-icon table-landscape-entry-icon" aria-hidden="true">
      <svg viewBox="0 0 28 28" focusable="false">
        <path d="M4 11V4h7M17 4h7v7M24 17v7h-7M11 24H4v-7"></path>
      </svg>
    </span>
    <span>View Table<br>in Landscape</span>
  </button>`;
}

function ensureLandscapeTableOverlay() {
  let overlay = document.querySelector('#landscapeTableOverlay');
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.className = 'landscape-table-overlay universal-landscape-table-overlay';
  overlay.id = 'landscapeTableOverlay';
  overlay.hidden = true;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `<div class="landscape-table-stage" role="dialog" aria-modal="true" aria-label="Multiplication table landscape view">
    <button class="landscape-table-close" type="button" data-landscape-table-close aria-label="Close landscape multiplication table">×</button>
    <div class="landscape-table-content" data-landscape-table-content></div>
  </div>`;
  overlay.querySelector('[data-landscape-table-close]').onclick = () => void closeLandscapeTable();
  overlay.onclick = (event) => {
    if (event.target === overlay) void closeLandscapeTable();
  };
  overlay.onkeydown = (event) => {
    if (event.key === 'Escape') void closeLandscapeTable();
  };
  document.body.appendChild(overlay);
  return overlay;
}

function queueLandscapeTableOperation(operation) {
  landscapeTableOperation = landscapeTableOperation.catch(() => undefined).then(operation);
  return landscapeTableOperation;
}

function openLandscapeTable(sourceTable, trigger) {
  if (!sourceTable || landscapeTableOpen) return;
  const overlay = ensureLandscapeTableOverlay();
  const content = overlay.querySelector('[data-landscape-table-content]');
  const stage = overlay.querySelector('[role="dialog"]');
  const sourceLabel = sourceTable.closest('[aria-label]')?.getAttribute('aria-label');
  const tableClone = sourceTable.cloneNode(true);
  tableClone.querySelectorAll('[data-table-landscape-control]').forEach((control) => control.remove());
  tableClone.querySelectorAll('button').forEach((button) => {
    button.tabIndex = -1;
    button.setAttribute('aria-disabled', 'true');
  });

  const activeSession = ++landscapeTableSession;
  landscapeTableOpen = true;
  landscapeTableTrigger = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  content.replaceChildren(tableClone);
  stage.setAttribute('aria-label', sourceLabel ? `${sourceLabel}, landscape view` : 'Multiplication table landscape view');
  overlay.hidden = false;
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('landscape-table-open');
  window.requestAnimationFrame(() => overlay.querySelector('[data-landscape-table-close]')?.focus({ preventScroll: true }));

  void queueLandscapeTableOperation(async () => {
    if (!landscapeTableOpen || activeSession !== landscapeTableSession) return;
    const orientationLocked = await lockVideoLandscape();
    if (!landscapeTableOpen || activeSession !== landscapeTableSession) {
      if (orientationLocked) await unlockVideoOrientation();
      return;
    }
    landscapeTableOrientationLocked = orientationLocked;
  });
}

async function closeLandscapeTable({ restoreFocus = true } = {}) {
  const overlay = document.querySelector('#landscapeTableOverlay');
  if (!landscapeTableOpen && (!overlay || overlay.hidden)) return;

  landscapeTableOpen = false;
  landscapeTableSession += 1;
  const trigger = landscapeTableTrigger;
  landscapeTableTrigger = null;
  trigger?.setAttribute('aria-expanded', 'false');
  if (overlay) {
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.querySelector('[data-landscape-table-content]')?.replaceChildren();
  }
  document.body.classList.remove('landscape-table-open');

  await queueLandscapeTableOperation(async () => {
    if (!landscapeTableOrientationLocked) return;
    landscapeTableOrientationLocked = false;
    await unlockVideoOrientation();
  });
  if (restoreFocus && trigger?.isConnected) trigger.focus({ preventScroll: true });
}

function bindLandscapeTableControls(root = document) {
  root.querySelectorAll('[data-table-landscape-control]').forEach((control) => {
    control.onclick = (event) => {
      event.stopPropagation();
      const sourceTable = control.closest('.core-table')
        ?? control.closest('.multiplication-table-surface')?.querySelector('.core-table');
      openLandscapeTable(sourceTable, control);
    };
  });
}

function pageHead(kicker, title, text) { return `<section class="page-head"><span class="kicker">${kicker}</span><h1>${title}</h1>${text ? `<p>${text}</p>` : ''}</section>`; }

function multiplicationTable(interactive = false, guideHighlights = false, enabledAudioGroups = TRIAL_GROUPS, entitlementCheckGroups = []) {
  const colors = ['blue', 'green', 'orange', 'sky', 'pink', 'purple', 'coral', 'teal'];
  return Array.from({ length: 8 }, (_, index) => index + 2).map((group, index) => {
    const audioEnabled = interactive && enabledAudioGroups.includes(group);
    const locked = interactive && !audioEnabled;
    const requiresEntitlementCheck = entitlementCheckGroups.includes(group);
    const equations = Array.from({ length: 10 - group }, (_, offset) => {
      const multiplier = group + offset;
      const answer = group * multiplier;
      const isSixFact = group === 6 || multiplier === 6;
      const isSevenFact = group === 7 || multiplier === 7;
      const highlightClass = guideHighlights
        ? ` guide-fact${isSixFact ? ' guide-fact-6' : ''}${isSevenFact ? ' guide-fact-7' : ''}`
        : '';
      const factLabel = `${group} × ${multiplier} = ${answer}`;
      return audioEnabled
        ? `<button class="core-fact-trigger${highlightClass}" type="button" data-fact-left="${group}" data-fact-right="${multiplier}" data-full-version-check="${requiresEntitlementCheck}" aria-label="${requiresEntitlementCheck ? 'Check Full Version access to play' : 'Play'} ${group} times ${multiplier} equals ${answer}" aria-pressed="false">${factLabel}</button>`
        : `<span class="${highlightClass.trim()}">${factLabel}</span>`;
    }).join('');
    const marker = audioEnabled
      ? `<button class="core-group-trigger" type="button" data-group-audio="${group}" data-full-version-check="${requiresEntitlementCheck}" aria-label="${requiresEntitlementCheck ? 'Check Full Version access to play' : 'Play'} the complete ${group}s chants" aria-pressed="false"><span>${group}</span><i aria-hidden="true">▶</i></button>`
      : locked
        ? `<strong class="core-locked-marker" aria-label="Group ${group} is locked. Unlock the Full Version to play it."><span>${group}</span><i class="core-lock-badge" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M6.3 8V6.2a3.7 3.7 0 0 1 7.4 0V8"/><rect x="4.4" y="8" width="11.2" height="8.2" rx="2"/></svg></i></strong>`
        : `<strong>${group}</strong>`;
    return `<div class="core-column core-${colors[index]}${locked ? ' is-locked' : ''}" data-core-group="${group}"${locked ? ' aria-disabled="true"' : ''}>${marker}${equations}</div>`;
  }).join('');
}

function multiplicationOverview(fullVersion = true, { entitlementAwareTable = false, limitFullMusicPreview = false, fullMusic = fullVersion } = {}) {
  const enabledAudioGroups = getAudibleTableGroups(fullVersion);
  const entitlementCheckGroups = [];
  const columns = multiplicationTable(true, false, enabledAudioGroups, entitlementCheckGroups);
  const previewLimited = Boolean(fullMusic && limitFullMusicPreview && !hasFullAccess());
  const previewRemaining = previewLimited ? getHomeFullMusicPreviewRemaining() : null;
  const previewExhausted = previewLimited && previewRemaining === 0;
  const music = fullMusic
    ? {
        src: COMPLETE_VIDEO,
        button: previewLimited ? (previewExhausted ? 'Preview Limit Reached' : 'Preview Complete Multiplication Music') : 'Play Complete Multiplication Music',
        buttonAria: previewLimited
          ? (previewExhausted ? 'Complete multiplication music preview limit reached' : 'Preview complete multiplication music for groups 2 through 9')
          : 'Play complete multiplication music for groups 2 through 9',
        videoAria: 'Complete multiplication music video for groups 2 through 9',
        idle: previewLimited
          ? (previewExhausted
              ? 'Your complete multiplication music previews are used up.'
              : `${previewRemaining} free preview${previewRemaining === 1 ? '' : 's'} remaining for the complete 2–9 multiplication music.`)
          : 'Tap play to hear the complete 2–9 multiplication music.',
        playing: 'Playing the complete 2–9 multiplication music.',
      }
    : {
        src: VIDEO,
      poster: VIDEO_POSTER,
        button: 'Play 6s–7s Multiplication Music',
        buttonAria: 'Play multiplication music for groups 6 and 7',
        videoAria: 'Multiplication music video for groups 6 and 7',
        idle: 'Tap play to hear the 6s–7s multiplication music.',
        playing: 'Playing the 6s–7s multiplication music.',
      };
  return `<section class="structure-card core-overview multiplication-table-surface">
    <div class="core-overview-copy">
      <span class="kicker">Core 9×9 Multiplication Chants</span>
      <h2>9×9 Multiplication ChantCode</h2>
      <p>Remove the 1s and duplicated reversed facts, and only 36 core chants remain.</p>
      <div class="recall-path">
        <span>Ordered Memory</span><b>→</b>
        <span>Random Recall</span><b>→</b>
        <span>Mixed Practice</span><b>→</b>
        <span>Automatic Recall</span>
      </div>
      <p class="table-audio-hint">
        <span aria-hidden="true">▶</span> ${entitlementAwareTable
          ? 'Groups 6 and 7 play in the trial. Locked groups are included in the Full Version.'
          : 'Tap an available group to preview its chants.'}
      </p>
    </div>

    <div class="overview-media" id="overviewMedia">
      <div class="overview-table-state" id="overviewTableState">
        <div class="core-table-scroll overview-table-scroll" aria-label="The 36 core multiplication facts from groups 2 through 9">
          <div class="core-table">${columns}</div>
        </div>

        <div class="overview-primary-actions">
          ${tableLandscapeEntryMarkup('overview-table-landscape-entry')}
          <button class="chant-play overview-video-play" id="overviewVideoPlay" type="button" aria-label="${music.buttonAria}" data-preview-limited="${previewLimited}"${previewExhausted ? ' disabled' : ''}>
            <span class="chant-play-icon" aria-hidden="true">▶</span>
            <span data-overview-play-label>${music.button}</span>
          </button>
        </div>
      </div>

      <div class="overview-video-state" id="overviewVideoState" hidden>
        <div class="video-player-shell" data-video-player data-lock-landscape role="dialog" aria-modal="true" aria-label="Multiplication music video">
          <video id="overviewCompleteVideo" playsinline webkit-playsinline preload="metadata" controlslist="nodownload noplaybackrate noremoteplayback" disablepictureinpicture ${music.poster ? `poster="${music.poster}"` : ''} src="${music.src}" aria-label="${music.videoAria}"></video>
          ${videoPlayerControlsMarkup({ loop: fullMusic })}
        </div>
      </div>
    </div>

    <div class="overview-preview-feedback${previewExhausted ? ' is-exhausted' : ''}" id="overviewPreviewFeedback">
      <p class="core-table-note" id="overviewMediaHint" role="status" aria-live="polite" data-idle-text="${music.idle}" data-playing-text="${music.playing}">${music.idle}</p>
      ${FREE_FULL_ACCESS ? '' : `<button class="overview-unlock-full" id="overviewUnlockFull" type="button" data-purchase-full-version${previewExhausted ? '' : ' hidden'}>Unlock Full Version <span aria-hidden="true">→</span></button>`}
    </div>
  </section>`;
}

function resetOverviewTableAudioVisuals() {
  const table = document.querySelector('.child-home-overview .core-table');
  if (!table) return;
  table.classList.remove('has-playing-group');
  table.querySelectorAll('.core-column').forEach((column) => column.classList.remove('playing-group'));
  table.querySelectorAll('.core-fact-trigger').forEach((button) => {
    button.classList.remove('active');
    button.setAttribute('aria-pressed', 'false');
  });
  table.querySelectorAll('[data-group-audio]').forEach((button) => {
    button.classList.remove('active');
    button.setAttribute('aria-pressed', 'false');
    button.querySelector('i').textContent = '▶';
  });
}

async function ensureOverviewTableAudioAccess(control, group) {
  if (control.dataset.fullVersionCheck !== 'true' || hasTableAudioAccess(group, hasFullAccess())) return true;

  const hint = document.querySelector('#overviewMediaHint');
  const unlock = document.querySelector('#overviewUnlockFull');
  if (unlock) unlock.hidden = false;
  if (hint) hint.textContent = translateText('This chant audio is included in the Full Version. A parent can unlock or restore purchases.');
  return false;
}

function bindOverviewTableAudio() {
  const table = document.querySelector('.child-home-overview .core-table');
  if (!table) return;

  table.querySelectorAll('.core-fact-trigger').forEach((button) => {
    button.onclick = async () => {
      stopVoice();
      resetOverviewTableAudioVisuals();
      if (!await ensureOverviewTableAudioAccess(button, Number(button.dataset.factLeft))) return;
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      playMultiplicationFact(button.dataset.factLeft, button.dataset.factRight, {
        onEnded: resetOverviewTableAudioVisuals,
        onError: resetOverviewTableAudioVisuals,
      });
    };
  });

  table.querySelectorAll('[data-group-audio]').forEach((button) => {
    button.onclick = async () => {
      const group = Number(button.dataset.groupAudio);
      const wasPlaying = button.getAttribute('aria-pressed') === 'true';
      stopVoice();
      resetOverviewTableAudioVisuals();
      if (wasPlaying) return;
      if (!await ensureOverviewTableAudioAccess(button, group)) return;

      const column = button.closest('.core-column');
      table.classList.add('has-playing-group');
      column.classList.add('playing-group');
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      button.querySelector('i').textContent = '■';

      playGroupFactsSequentially(group, {
        onSentenceStart: (_index, fact) => {
          column.querySelectorAll('.core-fact-trigger').forEach((factButton) => {
            const active = Number(factButton.dataset.factLeft) === fact.left
              && Number(factButton.dataset.factRight) === fact.right;
            factButton.classList.toggle('active', active);
            factButton.setAttribute('aria-pressed', String(active));
          });
        },
        onEnded: resetOverviewTableAudioVisuals,
        onError: resetOverviewTableAudioVisuals,
      });
    };
  });
}

function bindOverviewVideo() {
  const tableState = document.querySelector('#overviewTableState');
  const videoState = document.querySelector('#overviewVideoState');
  const video = document.querySelector('#overviewCompleteVideo');
  const play = document.querySelector('#overviewVideoPlay');
  const hint = document.querySelector('#overviewMediaHint');
  const feedback = document.querySelector('#overviewPreviewFeedback');
  const unlock = document.querySelector('#overviewUnlockFull');
  const playLabel = play.querySelector('[data-overview-play-label]');
  const previewLimited = play.dataset.previewLimited === 'true';
  const idleText = hint.dataset.idleText;
  const playingText = hint.dataset.playingText;
  const previewApplies = () => previewLimited && !hasFullAccess();
  const remainingText = (remaining) => `${remaining} free preview${remaining === 1 ? '' : 's'} remaining for the complete 2–9 multiplication music.`;
  const exhaustedText = 'Preview limit reached. Unlock the Full Version for unlimited complete music and access to every group from 2–9.';

  const refreshPreviewState = () => {
    if (!previewApplies()) {
      play.disabled = false;
      if (unlock) unlock.hidden = true;
      feedback.classList.remove('is-exhausted');
      hint.textContent = idleText;
      return Number.POSITIVE_INFINITY;
    }

    const remaining = getHomeFullMusicPreviewRemaining();
    const exhausted = remaining === 0;
    play.disabled = exhausted;
    playLabel.textContent = exhausted ? 'Preview Limit Reached' : 'Preview Complete Multiplication Music';
    play.setAttribute('aria-label', exhausted
      ? 'Complete multiplication music preview limit reached'
      : `Preview complete multiplication music. ${remaining} free preview${remaining === 1 ? '' : 's'} remaining`);
    unlock.hidden = !exhausted;
    feedback.classList.toggle('is-exhausted', exhausted);
    hint.textContent = exhausted ? exhaustedText : remainingText(remaining);
    return remaining;
  };

  const restoreTable = () => {
    video.pause();
    video.currentTime = 0;
    videoState.hidden = true;
    tableState.hidden = false;
    refreshPreviewState();
  };
  const countCompletedPreview = () => {
    if (!previewApplies() || getHomeFullMusicPreviewRemaining() <= 0) return true;
    recordHomeFullMusicPreviewPlay();
    return getHomeFullMusicPreviewRemaining() > 0;
  };
  const videoPlayer = bindCustomVideoPlayer(video.closest('[data-video-player]'), {
    lockLandscape: true,
    onClose: restoreTable,
    onPlaybackCompleted: countCompletedPreview,
    tapVideoSurfaceTogglesPlayback: Boolean(video.closest('.app-shell.mode-child')),
  });

  play.onclick = async () => {
    if (previewApplies() && refreshPreviewState() <= 0) return;
    stopVoice();
    resetOverviewTableAudioVisuals();
    tableState.hidden = true;
    videoState.hidden = false;
    hint.textContent = playingText;
    try { await videoPlayer?.open(); } catch (error) { await videoPlayer?.close('error'); }
  };

  refreshPreviewState();
}

function homeWhy36Explanation() {
  return `<section class="cc-home-why36" aria-label="Why there are only 36 multiplication chants">
    <img src="${WHY_36_IMAGE}" alt="Diagram showing how 81 multiplication facts simplify to 36 unique core chants">
    <button class="secondary cc-home-why36-play" id="homeWhy36Play" type="button" aria-label="Why are there only 36 chants? Watch the video explanation">
      <span aria-hidden="true">▶</span>
      <span>Why Are There Only 36 Chants? Watch the Video Explanation</span>
    </button>
    <div class="video-player-shell cc-home-why36-player" id="homeWhy36Player" data-video-player role="group" aria-label="Why there are only 36 multiplication chants video explanation" hidden>
      <video id="homeWhy36Video" playsinline webkit-playsinline preload="metadata" controlslist="nodownload noplaybackrate noremoteplayback" disablepictureinpicture src="${WHY_36_VIDEO}" aria-label="Why there are only 36 multiplication chants video explanation"></video>
      ${videoPlayerControlsMarkup()}
    </div>
  </section>`;
}

function bindHomeWhy36Video() {
  const play = document.querySelector('#homeWhy36Play');
  const player = document.querySelector('#homeWhy36Player');
  if (!play || !player) return;
  const videoPlayer = bindCustomVideoPlayer(player, { lockLandscape: false, inline: true });
  play.onclick = async () => {
    stopVoice();
    try { await videoPlayer?.open(); } catch (error) { await videoPlayer?.close('error'); }
  };
}

function parentUnderstand() {
  const fullAccess = hasFullAccess();
  const introLearningComplete = testIntroLearningComplete();
  const primaryRoute = DEV_TEST_MODE
    ? introLearningComplete ? 'child-full' : 'child-trial'
    : fullAccess ? 'child-full' : 'child-trial';
  const primaryLabel = DEV_TEST_MODE
    ? introLearningComplete ? 'Continue with Other Groups' : '先从6、7组试试吧'
    : fullAccess ? 'Continue Full Learning' : 'Start Free Trial';
  const secondaryAction = DEV_TEST_MODE
    ? ''
    : fullAccess
      ? '<button class="secondary cc-hero-secondary" data-route="child-trial">Start with 6–7 →</button>'
      : '<div class="cc-home-purchase"><button class="secondary cc-hero-secondary" id="homeFullVersionPurchase" data-purchase-full-version aria-describedby="homePurchaseNote">Unlock Full Version</button><small id="homePurchaseNote" class="cc-home-purchase-note">One-time purchase. No subscription.</small></div>';
  const accessMessage = FULL_ACCESS_TEST_BUILD
    ? '<strong>TestFlight Full Version unlocked.</strong> All learning content, the ChantCode Book, and parent support links are available for testing without a purchase.'
    : DEV_TEST_MODE
    ? introLearningComplete
      ? '<strong>Groups 6 and 7 completed.</strong> Continue with the other multiplication groups.'
      : '<strong>Start with Groups 6 and 7.</strong> The other groups become available after both group tests are passed.'
    : fullAccess
      ? '<strong>Full Version unlocked.</strong> Continue through the 1s and 10s foundation rules, all 36 core chants from 2 to 9, complete music, parent-evaluated final recitation, and combined tower challenges.'
      : '<strong>Free Trial</strong> includes Groups 6 and 7. The Full Version unlocks the complete 2–9 learning path.';
  shell(`<section class="about-chantcode cc-home-screen" aria-labelledby="aboutTitle">
    <article class="cc-home-hero-card">
      <div class="cc-home-visual-stack" aria-label="ChantCode multiplication learning illustration">
        <img class="cc-home-app-art" src="/free-multiplication-app/ui/assets/brand/chantcode-app-icon.png" alt="Child recalling a multiplication fact with ChantCode">
        <img class="cc-home-formula-art" src="/free-multiplication-app/ui/assets/brand/chantcode-automaticity-formula-clean.png" alt="Memorize ChantCode times retrieval practice equals multiplication automaticity">
      </div>

      <div class="about-copy">
        <span class="about-kicker">CHANTCODE</span>
        <h1 id="aboutTitle">Store multiplication chants in sound</h1>
        <p class="cc-home-lead">Turn multiplication facts into short, stable sound patterns. With repeated recall, children can retrieve answers directly from memory when they need them.</p>
      </div>

      ${homeWhy36Explanation()}

      <div class="child-home-overview cc-home-learning-preview">
        ${multiplicationOverview(fullAccess, { entitlementAwareTable: true, limitFullMusicPreview: true, fullMusic: true })}
      </div>

      <div class="about-actions${DEV_TEST_MODE ? ' is-test-sequence' : ''}${FREE_FULL_ACCESS && !DEV_TEST_MODE ? ' is-single-learning-action' : ''}" aria-label="Choose a ChantCode learning path">
        <button class="primary cc-hero-primary" data-route="${primaryRoute}"${FREE_FULL_ACCESS && !DEV_TEST_MODE ? ' hidden' : ''}>${primaryLabel} <span aria-hidden="true">→</span></button>
        ${secondaryAction}
        <button class="secondary cc-parent-guide-button" data-route="parent-guide"><span aria-hidden="true">▣</span> View the Parent Guide</button>
      </div>
    </article>

    <aside class="cc-trial-banner">
      <span class="cc-trial-star" aria-hidden="true">★</span>
      <p>${accessMessage}</p>
    </aside>

    <p class="about-school-note cc-home-disclaimer"><strong>ChantCode does not replace classroom teaching.</strong> It provides a practice method for memorizing multiplication facts and retrieving answers fluently.</p>
  </section>`, 'parent', '', { globalMode: 'home', hideModeNav: true });

  bindOverviewTableAudio();
  bindOverviewVideo();
  bindHomeWhy36Video();
}

function parentalGate() {
  parentGateChallenge ??= createParentGateChallenge();
  const challenge = parentGateChallenge;
  shell(`<section class="parental-gate" aria-labelledby="parentGateTitle">
    <article class="parental-gate-card">
      <span class="parental-gate-badge" aria-hidden="true">ADULT</span>
      <small>Parent Access</small>
      <h1 id="parentGateTitle">Please ask an adult to continue</h1>
      <p>${FREE_FULL_ACCESS
        ? 'Resetting learning progress, final recitation confirmations, and links that leave the App require an adult check. Regular page navigation remains available.'
        : 'Purchases, Restore Purchases, opening the Full Version book, resetting learning progress, final recitation confirmations, and links that leave the App require an adult check. Regular page navigation remains available.'}</p>
      <form id="parentGateForm" novalidate>
        <label for="parentGateAnswer">Adult check: enter the result</label>
        <strong>${challenge.first} + ${challenge.second} − ${challenge.subtract} = ?</strong>
        <input id="parentGateAnswer" type="number" inputmode="numeric" autocomplete="off" required aria-describedby="parentGateStatus">
        <p id="parentGateStatus" class="support-message" role="status" aria-live="polite"></p>
        <div class="parental-gate-actions">
          <button class="primary" type="submit">Continue</button>
          <button class="text-button" type="button" id="cancelParentGate">Return to Child</button>
        </div>
      </form>
    </article>
  </section>`, 'parent', 'parent-more', { globalMode: 'parent', focus: true });

  const form = document.querySelector('#parentGateForm');
  const input = document.querySelector('#parentGateAnswer');
  const status = document.querySelector('#parentGateStatus');
  form.onsubmit = (event) => {
    event.preventDefault();
    if (Number(input.value) !== challenge.answer) {
      status.textContent = 'That answer did not match. Please try again.';
      input.select();
      return;
    }
    parentGateUnlockedUntil = Date.now() + PARENT_GATE_SESSION_MS;
    parentGateChallenge = null;
    const target = parentGateTargetRoute;
    const resumeSelector = parentGateResumeSelector;
    parentGateResumeSelector = '';
    go(target, { fromHistory: true });
    if (resumeSelector) requestAnimationFrame(() => document.querySelector(resumeSelector)?.click());
  };
  document.querySelector('#cancelParentGate').onclick = () => {
    parentGateResumeSelector = '';
    go('child');
  };
  input.focus({ preventScroll: true });
}

function parentGuide() {
  const fullAccess = hasFullAccess();
  const introLearningComplete = testIntroLearningComplete();
  const introRecitationComplete = Boolean(progress.bareRecite6 && progress.bareRecite7);
  const showFullGuide = DEV_TEST_MODE ? introRecitationComplete : fullAccess;
  const equations6 = ['6 × 6 = 36', '6 × 7 = 42', '6 × 8 = 48', '6 × 9 = 54'];
  const equations7 = ['7 × 7 = 49', '7 × 8 = 56', '7 × 9 = 63'];
  const learningAction = DEV_TEST_MODE
    ? `<button class="secondary" data-route="${introLearningComplete ? 'child-full' : 'child-trial'}">${introLearningComplete ? 'Continue with Other Groups →' : 'Start with Groups 6 and 7 →'}</button>`
    : fullAccess
      ? '<button class="secondary" data-route="child-full">Enter Full Learning →</button>'
      : '<button class="secondary" id="guideFullVersionPurchase" data-purchase-full-version>Unlock Full Version</button>';
  const framedTable = `<section class="structure-card core-overview parent-highlighted-table multiplication-table-surface" aria-labelledby="parentHighlightedTableTitle">
    <div class="core-overview-copy">
      <span class="kicker">6s–7s COVERAGE MAP</span>
      <h2 id="parentHighlightedTableTitle">Every fact involving 6 or 7</h2>
      <div class="usage-table-key">
        <span class="key-6">Facts related to the 6s</span>
        <span class="key-7">Facts related to the 7s</span>
      </div>
    </div>

    <div class="overview-media">
      <div class="overview-table-state" id="parentGuideHighlightedTable">
        <div class="core-table-scroll overview-table-scroll" aria-label="9×9 triangular table highlighting facts related to the 6s and 7s">
          <div class="core-table core-table-guide">${multiplicationTable(false, true)}</div>
        </div>
        <div class="overview-primary-actions parent-table-actions">
          ${tableLandscapeEntryMarkup('parent-table-landscape-entry')}
        </div>
      </div>
    </div>

    <aside class="parent-table-explanation" aria-labelledby="parentTableExplanationTitle">
      <span aria-hidden="true">↔</span>
      <div>
        <h3 id="parentTableExplanationTitle">How the 36 core facts are organized</h3>
        <p>As shown in the 36 multiplication facts above, repeated commutative facts are learned only once.</p>
        <p>For example, the facts <strong>2 × 6, 3 × 6, 4 × 6, and 5 × 6</strong> already appear in Groups 2, 3, 4, and 5, so Group 6 only needs to add the facts that have not appeared before.</p>
        <p>The same applies to Group 7. The facts <strong>2 × 7, 3 × 7, 4 × 7, 5 × 7, and 6 × 7</strong> already appear in Groups 2, 3, 4, 5, and 6.</p>
        <p>This is why ChantCode does not repeat the same multiplication fact twice. By using the commutative property, the complete 2–9 multiplication table can be reduced to <strong>36 unique core facts.</strong></p>
      </div>
    </aside>
  </section>`;

  shell(`${DEV_TEST_MODE ? `<aside class="parent-test-unlock-note" aria-label="What unlocks after Groups 6 and 7">
      <span aria-hidden="true">→</span>
      <div><strong>Completing Groups 6 and 7 unlocks the full Groups 2–9 learning content.</strong><p>Finish the learning steps and pass both formal group tests. The 6–7 Parent Guide remains here until a parent also confirms both complete-group independent recitations; it is then replaced by the Full Version Usage Guide.</p></div>
    </aside>` : ''}

    ${framedTable}

    <section class="parent-learning-summary" aria-labelledby="parentLearningFlowTitle">
      <span class="usage-label">CHILD LEARNING FLOW</span>
      <h2 id="parentLearningFlowTitle">A clear path from chant to direct recall</h2>
      <p>Each core group contains four App activities. Completing them prepares the child for the final requirement: reciting the entire group independently for a parent.</p>
      <ol class="parent-learning-flow">
        <li><b>1</b><div><strong>Read &amp; Repeat</strong><span>Hear and follow the group chants in order.</span></div></li>
        <li><b>2</b><div><strong>Voice Follow-Along</strong><span>Hear a complete chant, then repeat the same three numbers.</span></div></li>
        <li><b>3</b><div><strong>Formal Test</strong><span>Recall facts in changing order without answer hints.</span></div></li>
        <li><b>4</b><div><strong>Listen &amp; Choose</strong><span>Hear the factors and select the correct result.</span></div></li>
        <li><b>5</b><div><strong>Parent Final Recitation Check</strong><span>Ask the child to recite the entire group in order, from the first chant to the last, without text, audio, or hints. Open the reference only after the attempt, then record the parent’s decision.</span></div></li>
        <li><b>6</b><div><strong>Unlocked Tower Challenges</strong><span>Required formal group tests unlock mixed, staged tower challenges.</span></div></li>
      </ol>
      <div class="parent-outcome-card">
        <span aria-hidden="true">★</span>
        <div><strong>Expected outcome</strong><p>The child can answer familiar multiplication facts directly, use either factor order, and independently recite every chant in each learned group from beginning to end.</p></div>
      </div>
    </section>

    <aside class="parent-speech-caution" aria-label="Important note about voice recognition">
      <span aria-hidden="true">!</span>
      <div><strong>The final recitation result is evaluated by a parent.</strong><p>Voice recognition is used only for forgiving follow-along practice and can sometimes be inaccurate. It does not pass or fail the child’s final independent recitation.</p></div>
    </aside>

    <section class="parent-start-recommendation" aria-labelledby="parentStartRecommendationTitle">
      <span class="usage-label">RECOMMENDED STARTING POINT</span>
      <h2 id="parentStartRecommendationTitle">Begin with Groups 6 and 7</h2>
      <p>Many children find the 6s and 7s the point where multiplication becomes difficult. Starting here can help your child build confidence and lets you see meaningful progress early, while giving the ChantCode method time to work.</p>
      <p><strong>After completing Groups 6 and 7, continue with Group 2 and work in order through Group 9.</strong></p>
    </section>

    ${showFullGuide ? `
      <details class="parent-example-bundle parent-full-guide" open>
        <summary>
          <span><small>FULL VERSION USAGE GUIDE</small><strong>Open the complete 01–07 usage guide</strong></span>
          <b aria-hidden="true">+</b>
        </summary>
        <div class="parent-example-content">
          <article class="usage-section usage-full">
            <span class="usage-label">01</span>
            <h2>Choose one group and keep the goal clear</h2>
            <p>Open Child Home and choose the next available group. Let the child stay with that group until the four App activities are complete and the child can recite the entire group independently.</p>
            <p>Short, repeated sessions are enough. The goal is accurate recall without depending on the screen, the audio, or the order of the questions.</p>
          </article>

          <article class="usage-section">
            <span class="usage-label">02</span>
            <h2>Use the 1s and 10s as optional foundation practice</h2>
            <div class="usage-columns">
              <section><h3>1s practice</h3><p>Listen and read the nine facts when the child needs a quick warm-up.</p></section>
              <section><h3>10s practice</h3><p>Use the nine listen-and-read facts as another simple warm-up.</p></section>
            </div>
            <p>These two groups have no formal tests or tower stages. They support the main learning path but do not replace work in Groups 2–9.</p>
          </article>

          <article class="usage-section">
            <span class="usage-label">03</span>
            <h2>Learn Groups 2–9 one group at a time</h2>
            <p>Begin with the next available group card instead of trying to finish several groups at once. Earlier groups contain more new chants; later groups are shorter because reversed facts are not repeated.</p>
            <p>The complete multiplication music is available as an overview or replay. Use the group activities for focused learning and testing.</p>
          </article>

          <article class="usage-section">
            <span class="usage-label">04</span>
            <h2>Complete all four App activities</h2>
            <div class="usage-process"><strong>Read &amp; Repeat</strong><i>→</i><strong>Voice Follow-Along</strong><i>→</i><strong>Formal Test</strong><i>→</i><strong>Listen &amp; Choose</strong></div>
            <p>Read &amp; Repeat and Voice Follow-Along build familiarity. The Formal Test changes question order and reverses factors, while Listen &amp; Choose checks whether the child can identify the answer from audio alone.</p>
            <p>Activity completion shows practice progress. It is not the final whole-group recitation result.</p>
          </article>

          <article class="usage-section">
            <span class="usage-label">05</span>
            <h2>Require a whole-group independent recitation</h2>
            <p>After the four App activities, put the device aside. Ask the child to recite every chant in the group in order, from the first chant to the last, without text, audio, hints, or help.</p>
            <p>If the child pauses or needs prompting, return to practice and try again later. A few correct answers or a completed App test do not replace the complete recitation.</p>
          </article>

          <article class="usage-section">
            <span class="usage-label">06</span>
            <h2>Confirm the result in Parent Final Recitation Check</h2>
            <p>The Parent page includes separate checks for Groups 2–9, the combined 2–4 range, the combined 5–9 range, and the complete 2–9 recitation. Each check provides the standard audio, Arabic-number equation, exact chant wording, and number-to-English guide.</p>
            <p>Listen to the child first. Only after the entire attempt is finished, use the reference to verify the order and answers, then record the parent’s final decision.</p>
            <p class="usage-emphasis">The App supplies the reference. The parent makes the final judgment.</p>
          </article>

          <article class="usage-section usage-full">
            <span class="usage-label">07</span>
            <h2>Use tower challenges after the required tests</h2>
            <div class="usage-columns">
              <section><h3>Group towers</h3><p>The 6+7 tower requires both group tests. The 2–4 and 5–9 towers each require every formal test in their named range.</p></section>
              <section><h3>Full towers</h3><p>Clearing both range towers opens the full 2–9 combined tower. Clearing that tower opens the continuously accelerating 2–9 Speed Tower.</p></section>
            </div>
            <p>Towers provide extra mixed recall practice and remain available for replay after completion. They do not replace the parent-confirmed whole-group recitation.</p>
          </article>
        </div>
      </details>` : `
      <details class="parent-example-bundle">
        <summary>
          <span><small>${DEV_TEST_MODE ? 'GROUPS 6–7 GUIDE' : 'FREE TRIAL GUIDE'}</small><strong>Open the complete 01–06 Groups 6–7 learning guide</strong></span>
          <b aria-hidden="true">+</b>
        </summary>
        <div class="parent-example-content">
          <article class="usage-section usage-trial">
            <span class="usage-label">01</span>
            <h2>See the complete Groups 6 and 7 learning journey</h2>
            <p>The child completes four App activities in each group, then independently recites the entire group for a parent. App tests prepare the child; the parent-confirmed whole-group recitation is the final result.</p>
            <div class="parent-music-preview" aria-labelledby="parentMusicTitle">
              <div class="video-player-shell parent-trial-music-player" data-video-player data-lock-landscape role="dialog" aria-modal="true" aria-label="6s–7s multiplication music video" hidden>
                <video id="parentTrialMusicVideo" class="parent-trial-music-video" playsinline webkit-playsinline preload="metadata" controlslist="nodownload noplaybackrate noremoteplayback" disablepictureinpicture src="${VIDEO}" aria-label="6s–7s Multiplication Music"></video>
                ${videoPlayerControlsMarkup()}
              </div>
              <button class="chant-play parent-music-play" id="parentTrialMusicPlay" type="button" aria-labelledby="parentMusicTitle"><span class="chant-play-icon" aria-hidden="true">▶</span><span id="parentMusicTitle">Play 6s–7s Multiplication Music</span></button>
              <p class="showcase-hint">The 6s–7s trial music can be replayed anytime.</p>
            </div>
          </article>

          <article class="usage-section">
            <span class="usage-label">02</span><h2>Complete the 6s learning and tests</h2><p>The 6s contain four new core chants:</p>
            <div class="usage-equations four">${equations6.map((item) => `<span>${item}</span>`).join('')}</div>
            <p>After choosing the 6s, the child completes Read &amp; Repeat, Voice Follow-Along, the Formal Test, and Listen &amp; Choose. There is no separate 6s tower stage.</p>
            <p>The test also practices recalling facts with the factors reversed, for example:</p>
            <div class="usage-equations questions"><span>6 × 7 = 42</span><span>7 × 6 = ?</span></div>
          </article>

          <article class="usage-section">
            <span class="usage-label">03</span><h2>Complete the 7s learning and tests</h2><p>The 7s contain three new core chants:</p>
            <div class="usage-equations questions">${equations7.map((item) => `<span>${item}</span>`).join('')}</div>
            <p>The 7s use the same learning flow as the 6s. After both formal group tests pass, the combined 6+7 tower unlocks. Results are saved automatically in Learning Progress.</p>
          </article>

          <article class="usage-section">
            <span class="usage-label">04</span><h2>Understand what each App result means</h2>
            <p>The Formal Test changes the order and reverses factors. Listen &amp; Choose checks recognition from audio. Passing both group tests also unlocks the combined 6+7 tower.</p>
            <p>These results show that the child completed the App activities. They do not replace the final independent recitation of the entire group.</p>
          </article>

          <article class="usage-section">
            <span class="usage-label">05</span><h2>Ask for the entire 6s and 7s recitations</h2>
            <p>Check each group separately. For the 6s, the child recites every 6s chant from first to last; for the 7s, the child recites every 7s chant from first to last.</p>
            <p>There must be no text, audio, hints, or prompting. If help is needed, return to practice and repeat the independent attempt later.</p>
            <p class="usage-emphasis">The final recitation decision belongs to the parent.</p>
          </article>

          <article class="usage-section usage-full">
            <span class="usage-label">06</span><h2>Record both final parent confirmations</h2>
            <p>Open Parent Final Recitation Check after the child finishes each independent attempt. Use the reference only after the attempt, then record the 6s and 7s decisions separately.</p>
            <p>${DEV_TEST_MODE
              ? 'After the parent confirms both complete group recitations, this Groups 6–7 guide is automatically replaced by the Full Version Usage Guide.'
              : 'The parent records each final decision separately so the completed learning result remains visible in Learning Progress.'}</p>
          </article>
        </div>
      </details>`}

    <div class="action-row">
      ${learningAction}
    </div>`, 'parent', 'parent-guide');

  const musicPreviewButton = document.querySelector('#parentTrialMusicPlay');
  const musicPreviewVideo = document.querySelector('#parentTrialMusicVideo');
  const musicPreviewPlayer = musicPreviewVideo?.closest('[data-video-player]');
  if (!musicPreviewButton || !musicPreviewVideo || !musicPreviewPlayer) return;
  const setMusicButtonLabel = (label) => {
    musicPreviewButton.innerHTML = `<span class="chant-play-icon" aria-hidden="true">▶</span><span>${translateText(label)}</span>`;
  };

  const videoPlayer = bindCustomVideoPlayer(musicPreviewPlayer, {
    lockLandscape: true,
    onClose: (reason) => {
      musicPreviewButton.hidden = false;
      musicPreviewButton.disabled = false;
      setMusicButtonLabel(reason === 'error'
        ? 'Try 6s–7s Multiplication Music Again'
        : 'Play 6s–7s Multiplication Music Again');
    },
  });

  musicPreviewButton.onclick = async () => {
    musicPreviewButton.disabled = true;
    try {
      await videoPlayer?.open();
      musicPreviewButton.hidden = true;
    } catch {
      await videoPlayer?.close('error');
      musicPreviewButton.disabled = false;
      setMusicButtonLabel('Try 6s–7s Multiplication Music Again');
    }
  };
}

const PARENT_RECITATION_RANGE_KEYS = Object.freeze({
  'groups-2-4': 'parentRecitation24',
  'groups-5-9': 'parentRecitation59',
  'groups-2-9': 'parentRecitation29',
});

function canonicalChantText(fact) {
  return String(fact?.chant ?? '').replaceAll('onenty', 'onety');
}

function chantReferenceNumberWord(value) {
  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const tens = { 20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety' };
  const number = Number(value);
  if (number >= 1 && number <= 9) return units[number];
  if (number >= 10 && number <= 19) return number === 10 ? 'onety' : `onety-${units[number - 10]}`;
  const tensValue = Math.floor(number / 10) * 10;
  const onesValue = number % 10;
  if (tens[tensValue]) return onesValue ? `${tens[tensValue]}-${units[onesValue]}` : tens[tensValue];
  return String(number);
}

function parentRecitationModeUnlocked(mode) {
  if (!mode) return false;
  return mode.groups.length === 1
    ? hasFullAccess() || TRIAL_GROUPS.includes(mode.groups[0])
    : hasFullAccess();
}

function parentRecitationProgressKey(mode) {
  if (!mode) return '';
  if (mode.groups.length === 1) return `bareRecite${mode.groups[0]}`;
  return PARENT_RECITATION_RANGE_KEYS[mode.id] ?? '';
}

function parentRecitationConfirmed(mode) {
  const key = parentRecitationProgressKey(mode);
  return Boolean(key && progress[key]);
}

function parentRecitationReady(mode) {
  return Boolean(mode?.groups?.every((group) => progress[`test${group}`]));
}

function parentRecitationCheck() {
  const cards = RECITATION_MODES.map((mode) => {
    const unlocked = parentRecitationModeUnlocked(mode);
    const confirmed = unlocked && parentRecitationConfirmed(mode);
    const ready = unlocked && parentRecitationReady(mode);
    const factsForMode = getRecitationFacts(mode);
    const chantCountLabel = `${factsForMode.length} chant${factsForMode.length === 1 ? '' : 's'}`;
    const status = !unlocked
      ? 'Full Version'
      : confirmed
        ? 'Parent confirmed'
        : ready
          ? 'Ready for parent check'
          : 'Reference available · complete the formal tests first';
    return `<button class="parent-recitation-mode-card" data-route="parent-recitation-check-${mode.id}" ${unlocked ? '' : 'disabled'} data-progress-state="${confirmed ? 'completed' : 'not-completed'}">
      <span>${mode.shortLabel}</span>
      <div><strong>${mode.label}</strong><small>${chantCountLabel} · ${status}</small></div>
      <b aria-hidden="true">${confirmed ? '✓' : unlocked ? '→' : '🔒'}</b>
    </button>`;
  }).join('');

  shell(`${pageHead(
    'Parent Final Recitation Check',
    'The parent makes the final decision',
    'Ask the child to recite without text or audio prompts. Use these references only to verify the attempt afterwards.'
  )}
    <aside class="parent-speech-caution parent-final-check-note" aria-label="How to conduct the final recitation check">
      <span aria-hidden="true">✓</span>
      <div><strong>App practice is not the final pass or fail decision.</strong><p>Voice Follow-Along, Formal Test, Listen &amp; Choose, and tower results help families see practice progress. A parent personally evaluates the final independent recitation.</p></div>
    </aside>
    <section class="parent-recitation-mode-grid" aria-label="Choose a recitation range">${cards}</section>
    <div class="action-row"><button class="secondary" data-route="parent-guide">Return to Parent Guide</button><button class="secondary" data-route="parent-progress">Open Learning Progress</button></div>`, 'parent', 'parent-recitation-check');
}

function playParentReferenceSequence(factsForMode, button) {
  const playbackId = ++parentReferencePlaybackId;
  stopVoice();
  if (button) {
    button.disabled = true;
    button.innerHTML = '<span aria-hidden="true">●</span><strong>Playing the complete reference…</strong>';
  }
  const finish = () => {
    if (playbackId !== parentReferencePlaybackId) return;
    if (button) {
      button.disabled = false;
      button.innerHTML = '<span aria-hidden="true">▶</span><strong>Play Complete Reference</strong>';
    }
  };
  const playAt = (index) => {
    if (playbackId !== parentReferencePlaybackId) return;
    const fact = factsForMode[index];
    if (!fact) return finish();
    playMultiplicationFact(fact.a, fact.b, {
      onEnded: () => playAt(index + 1),
      onError: () => playAt(index + 1),
    });
  };
  playAt(0);
}

function parentRecitationCheckDetail(modeId) {
  const mode = getRecitationMode(modeId);
  if (!mode || !parentRecitationModeUnlocked(mode)) return parentRecitationCheck();
  const factsForMode = getRecitationFacts(mode);
  const confirmed = parentRecitationConfirmed(mode);
  const ready = parentRecitationReady(mode);
  const progressKey = parentRecitationProgressKey(mode);
  const referenceRows = factsForMode.map((fact, index) => {
    const numberGuide = [fact.a, fact.b, fact.result]
      .map((number) => `${number} = ${chantReferenceNumberWord(number)}`)
      .join(' · ');
    return `<article class="parent-recitation-reference-row" data-reference-index="${index}">
      <button type="button" class="parent-reference-audio" data-parent-reference-fact="${index}" aria-label="Play ${fact.a} times ${fact.b} equals ${fact.result}"><span aria-hidden="true">▶</span></button>
      <div class="parent-reference-equation"><strong>${fact.a} × ${fact.b} = ${fact.result}</strong><span>${canonicalChantText(fact)}</span></div>
      <small>${numberGuide}</small>
    </article>`;
  }).join('');

  shell(`${pageHead(
    'Parent Final Recitation Check',
    mode.label,
    'Let the child finish independently first. Then use the standard audio and written references below to check accuracy.'
  )}
    <section class="parent-recitation-check-layout">
      <article class="parent-recitation-instructions">
        <span class="usage-label">PARENT CHECK</span>
        <h2>Check three things</h2>
        <ol>
          <li><b>1</b><span>The child recites without looking at these equations or hearing the reference audio.</span></li>
          <li><b>2</b><span>Both factors are spoken in the displayed order and the product is correct.</span></li>
          <li><b>3</b><span>Use the English guide to verify number wording, including <em>onety</em> for answers from 10 to 19.</span></li>
        </ol>
        <button class="group-audio-button parent-complete-reference" id="playParentCompleteReference" type="button"><span aria-hidden="true">▶</span><strong>Play Complete Reference</strong></button>
        <p class="showcase-hint">Reference audio is for parent verification after the child’s independent attempt.</p>
      </article>
      <section class="parent-recitation-reference-list" aria-label="${mode.label} recitation reference">${referenceRows}</section>
    </section>
    <section class="parent-recitation-decision" data-progress-state="${confirmed ? 'completed' : 'not-completed'}">
      <div><small>Final decision</small><strong>${confirmed ? 'Parent confirmed this recitation' : ready ? 'Ready for the parent’s decision' : 'Complete the formal tests before confirming'}</strong><p>${confirmed ? 'Tap again only if you need to undo this confirmation.' : 'The App does not score this final independent recitation.'}</p></div>
      <button class="${confirmed ? 'secondary' : 'primary'}" id="confirmParentRecitation" type="button" ${ready ? '' : 'disabled'}>${confirmed ? 'Undo Parent Confirmation' : 'Confirm Independent Recitation'}</button>
    </section>
    <div class="action-row"><button class="secondary" data-route="parent-recitation-check">Choose Another Group</button><button class="secondary" data-route="parent-progress">Open Learning Progress</button></div>`, 'parent', 'parent-recitation-check');

  const completeAudioButton = document.querySelector('#playParentCompleteReference');
  completeAudioButton.onclick = () => playParentReferenceSequence(factsForMode, completeAudioButton);
  document.querySelectorAll('[data-parent-reference-fact]').forEach((button) => {
    button.onclick = () => {
      parentReferencePlaybackId += 1;
      const fact = factsForMode[Number(button.dataset.parentReferenceFact)];
      if (fact) playMultiplicationFact(fact.a, fact.b);
    };
  });
  const confirmButton = document.querySelector('#confirmParentRecitation');
  if (ready && progressKey) {
    confirmButton.onclick = () => {
      if (!requireActiveParentAccess(`parent-recitation-check-${mode.id}`, '#confirmParentRecitation')) return;
      save({ [progressKey]: !confirmed });
      parentRecitationCheckDetail(mode.id);
    };
  }
}

function parentProgress() {
  const colors = ['blue', 'green', 'orange', 'sky', 'pink', 'purple', 'coral', 'teal'];

  const columns = FULL_GROUPS.map((group, index) => {
    const unlocked = hasFullAccess() || TRIAL_GROUPS.includes(group);
    const recalled = unlocked && Boolean(progress[`test${group}`]);
    const bare = recalled && Boolean(progress[`bareRecite${group}`]);
    const progressState = bare ? 'bare-confirmed' : recalled ? 'test-passed' : 'not-started';
    const confirmLabel = !unlocked
      ? `Group ${group}: available in the Full Version`
      : !recalled
        ? `Group ${group}: pass the formal test first`
        : bare
          ? `Group ${group}: independent recitation confirmed; tap again to undo`
          : `Group ${group}: confirm independent recitation`;
    const equations = chantFacts(group).map((fact) => {
      return `<span>${fact.left} × ${fact.right} = ${fact.answer}</span>`;
    }).join('');

    return `<div class="core-column core-${colors[index]}" data-progress-group="${group}" data-progress-state="${progressState}" data-content-locked="${unlocked ? 'false' : 'true'}">
      <button
        type="button"
        class="progress-group-confirm"
        data-bare-group="${group}"
        aria-pressed="${bare}"
        aria-label="${confirmLabel}"
        title="${confirmLabel}"
        ${recalled ? '' : 'disabled'}
      ><span>${group}</span>${bare ? '<i aria-hidden="true">✓</i>' : ''}</button>
      ${equations}
    </div>`;
  }).join('');

  const voiceProgressCards = FULL_GROUPS.map((group, index) => {
    const groupFacts = chantFacts(group);
    const passedAnswerCount = readPractice(groupFacts).worked;
    const voiceAnswersComplete = passedAnswerCount === groupFacts.length;
    const parentConfirmed = Boolean(progress[`bareRecite${group}`]);
    const completedCount = [voiceAnswersComplete, parentConfirmed].filter(Boolean).length;
    const complete = completedCount === 2;

    return `<article class="progress-status-card core-${colors[index]}" data-progress-state="${complete ? 'completed' : 'not-completed'}">
      <div class="progress-status-card-head">
        <span class="progress-status-group" aria-hidden="true">${group}</span>
        <div><small>Group ${group}</small><strong>${completedCount} / 2 complete</strong></div>
      </div>
      <ul class="progress-stage-list" aria-label="Group ${group} voice practice details">
        <li data-progress-state="${voiceAnswersComplete ? 'completed' : 'not-completed'}"><span>Listen &amp; Repeat</span><b>${passedAnswerCount} / ${groupFacts.length} worked through</b></li>
        <li data-progress-state="${parentConfirmed ? 'completed' : 'not-completed'}"><span>Parent Final Check</span><b>${parentConfirmed ? 'Independent recitation confirmed' : 'Not confirmed'}</b></li>
      </ul>
    </article>`;
  }).join('');

  const towerProgressItems = [
    {
      label: '6+7 Combined Tower',
      complete: Boolean(progress.mixedGame || progress.mixed),
      mistakes: progress.towerMistakesMixed,
    },
    ...FULL_TOWER_MODES.map((towerMode) => ({
      label: towerMode.label,
      complete: Boolean(progress[towerMode.progressKey]),
      mistakes: progress[towerMode.mistakesKey],
    })),
  ];
  const towerProgressCards = towerProgressItems.map((item, index) => `
    <article class="progress-status-card progress-tower-card core-${colors[(index + 4) % colors.length]}" data-progress-state="${item.complete ? 'completed' : 'not-completed'}">
      <span class="progress-tower-icon" aria-hidden="true">♜</span>
      <div>
        <small>Tower Defense</small>
        <strong>${item.label}</strong>
        <p>${item.complete ? `Completed${item.mistakes === null ? '' : ` · ${item.mistakes} mistakes`}` : 'Not completed'}</p>
      </div>
    </article>`).join('');

  const mixedTestComplete = Boolean(progress.mixedTest || progress.mixed);

  shell(`${pageHead(
    'Learning Progress',
    'See exactly what your child has completed',
    'Groups 2–9 use the core chant table for tests, parent-confirmed recitation, voice practice, and tower-defense progress.'
  )}

    <section class="structure-card core-overview progress-overview multiplication-table-surface">
      <div class="progress-overview-head">
        <div class="progress-confirmation-copy">
          <span class="usage-label">Independent Recitation</span>
          <h2>When your child can recite independently, tap the group number</h2>
          <p>When your child can recite a group without text or audio prompts, tap its group number below. Only groups with a passed test can be confirmed; tap again to undo.</p>
        </div>
        <div class="progress-legend" aria-label="Progress status key">
          <span class="progress-legend-item is-not-started"><i aria-hidden="true"></i>Gray: not started</span>
          <span class="progress-legend-item is-test-passed"><i aria-hidden="true"></i>Color: test passed</span>
          <span class="progress-legend-item is-bare-confirmed"><i aria-hidden="true"></i>Filled color: independent recitation confirmed</span>
        </div>
      </div>
      <div class="core-table-scroll overview-table-scroll" aria-label="Multiplication progress for groups 2–9">
        <div class="core-table progress-core-table">${columns}</div>
      </div>
      ${tableLandscapeEntryMarkup('progress-table-landscape-entry')}
    </section>

    <section class="progress-detail-section progress-voice-section" aria-labelledby="voiceProgressTitle">
      <div class="progress-detail-head">
        <span class="usage-label">PRACTICE + PARENT CHECK</span>
        <h2 id="voiceProgressTitle">Follow-Along and Final Recitation</h2>
        <p>Web follow-along records chants worked through manually, not speech recognition or mastery. A parent separately confirms independent recitation.</p>
        <button class="secondary" data-route="parent-recitation-check">Open Parent Final Recitation Check →</button>
      </div>
      <div class="progress-status-grid progress-voice-grid">${voiceProgressCards}</div>
    </section>

    <section class="progress-detail-section progress-tower-section" aria-labelledby="towerProgressTitle">
      <div class="progress-detail-head">
        <span class="usage-label">Challenges</span>
        <h2 id="towerProgressTitle">Tower Defense Progress</h2>
        <p>Completed tower challenges are shown in color. Unfinished challenges remain gray.</p>
      </div>
      <div class="progress-status-grid progress-tower-grid">${towerProgressCards}</div>
      <article class="progress-mixed-test" data-progress-state="${mixedTestComplete ? 'completed' : 'not-completed'}">
        <div><small>Assessment</small><strong>Mixed 6+7 Test</strong></div>
        <b>${mixedTestComplete ? bestScoreLabel(progress.mixedAttempted, progress.mixedAccuracy) : 'Not completed'}</b>
      </article>
    </section>`, 'parent', 'parent-progress');

  document.querySelectorAll('[data-bare-group]').forEach((button) => {
    button.onclick = () => {
      const group = Number(button.dataset.bareGroup);
      if (!progress[`test${group}`]) return;
      if (!requireActiveParentAccess('parent-progress', `[data-bare-group="${group}"]`)) return;
      save({ [`bareRecite${group}`]: !Boolean(progress[`bareRecite${group}`]) });
      parentProgress();
    };
  });
}

function parentMore() {
  const bookUnlocked = hasFullAccess();
  const purchaseItems = FREE_FULL_ACCESS ? '' : `
    <button class="full-version-purchase-item" id="fullVersionPurchase" type="button" data-purchase-full-version><span>★</span><div><strong>${hasFullAccess() ? 'Full Version Unlocked' : 'Unlock Full Version'}</strong><small>${hasFullAccess() ? 'Open the complete learning path' : 'One-time purchase. No subscription.'}</small></div><b>→</b></button>
    ${DEV_TEST_MODE
      ? `<button id="restore"><span>↻</span><div><strong>Restore Purchases</strong><small>Development mode · App Store restore remains available in iOS</small></div><b>→</b></button>`
      : `<button id="restore"><span>↻</span><div><strong>Restore Purchases</strong><small>Restore a previous App Store purchase</small></div><b>→</b></button>`}
    <button id="redeemGiftCode" type="button"><span aria-hidden="true">★</span><div><strong>Redeem Code</strong><small>Redeem an Apple Offer Code through the App Store</small></div><b>→</b></button>`;
  const bookSection = DEV_TEST_MODE ? '' : `
    <section class="more-section" aria-labelledby="aboutTitle">
      <h2 id="aboutTitle">About</h2>
      <div class="more-list">
        <button class="about-chantcode-item" data-route="parent-about-chantcode" data-full-version-locked="${bookUnlocked ? 'false' : 'true'}"><span aria-hidden="true">B</span><div><strong>ChantCode Book</strong><small>${bookUnlocked ? 'Full Version content · Read the complete ChantCode manuscript' : 'Included with Full Version · Parent access required'}</small></div><b aria-hidden="true">${bookUnlocked ? '→' : '🔒'}</b></button>
      </div>
    </section>`;

  shell(`${pageHead('More', 'App & Support', FREE_FULL_ACCESS
    ? 'Learning controls, ChantCode information, and support.'
    : 'Learning controls, ChantCode information, support, and App Store purchases.')}
    <section class="more-section" aria-labelledby="appLearningTitle">
      <h2 id="appLearningTitle">App & Learning</h2>
      <div class="more-list">
        <button class="settings-reset-button" id="resetLearningProgress" type="button">
          <span aria-hidden="true">↺</span>
          <div><strong>Reset Learning Progress</strong><small>Clear all learning progress on this device</small></div>
          <b>→</b>
        </button>
      </div>
      <p class="support-message more-section-message" id="resetStatus" aria-live="polite"></p>
    </section>

    ${bookSection}

    <section class="more-section" aria-labelledby="supportStoreTitle">
      <h2 id="supportStoreTitle">${FREE_FULL_ACCESS ? 'Support' : 'Support & App Store'}</h2>
      <div class="more-list review-more-list">
        <button data-route="parent-support"><span>↗</span><div><strong>Support & Website</strong><small class="support-entry-details"><span>chantcode.com</span><span>support@chantcode.com</span></small></div><b>→</b></button>
        <button data-route="parent-privacy"><span>?</span><div><strong>Help, Privacy & Terms</strong><small>How to use ChantCode, Privacy Policy, and Terms of Use</small></div><b>→</b></button>
        ${purchaseItems}
        ${!FREE_FULL_ACCESS && REFERRALS_ENABLED ? `<button data-route="parent-referrals"><span aria-hidden="true">🎁</span><div><strong>Refer &amp; Gift Codes</strong><small>Invite families and share ChantCode</small></div><b>→</b></button>` : ''}
        ${!FREE_FULL_ACCESS && REFERRAL_SANDBOX_TESTING ? '<button id="sandboxRefund" type="button"><span aria-hidden="true">↩</span><div><strong>Test Sandbox Refund</strong><small>Open Apple’s refund sheet for this test purchase</small></div><b>→</b></button>' : ''}
        <div class="app-version-info" aria-label="App Version ${APP_VERSION}">
          <span aria-hidden="true">i</span>
          <div><strong>App Version</strong><small>Version ${APP_VERSION}</small></div>
        </div>
      </div>
    </section>
    <p class="support-message" id="supportMessage"></p>`, 'parent', 'parent-more');

  document.querySelector('#resetLearningProgress')?.addEventListener('click', () => {
    if (!requireActiveParentAccess('parent-more', '#resetLearningProgress')) return;
    const confirmed = window.confirm(FREE_FULL_ACCESS
      ? 'Reset learning progress? Tests, challenge results, and recitation records will be cleared. Your Full Version access will remain available.'
      : 'Reset learning progress? Tests, challenge results, and recitation records will be cleared. Your Full Version purchase will not be affected.');
    if (!confirmed) return;
    progress = resetLearningProgress(progress);
    document.querySelector('#resetStatus').textContent = FREE_FULL_ACCESS
      ? 'Learning progress has been reset. Your Full Version access remains available.'
      : 'Learning progress has been reset. Your Full Version purchase is preserved.';
  });

  document.querySelector('#redeemGiftCode')?.addEventListener('click', async (event) => {
    if (!requireActiveParentAccess('parent-more', '#redeemGiftCode')) return;
    const button = event.currentTarget;
    button.disabled = true;
    try {
      await redeemGiftCode();
      await fullVersionAccess.refresh();
      if (currentRoute === 'parent-more') {
        parentMore();
        document.querySelector('#supportMessage').textContent = fullVersionAccess.active
          ? 'Full Version is available.' : 'If you redeemed a code, use Restore Purchases to check your App Store purchase.';
      }
    } catch {
      if (button.isConnected) document.querySelector('#supportMessage').textContent = 'Code redemption is available through the App Store in the iPhone or iPad App. Please try again.';
    } finally { button.disabled = false; }
  });

  document.querySelector('#sandboxRefund')?.addEventListener('click', async (event) => {
    if (!REFERRAL_SANDBOX_TESTING || !requireActiveParentAccess('parent-more', '#sandboxRefund')) return;
    const button = event.currentTarget;
    button.disabled = true;
    let message;
    try {
      const result = await requestSandboxRefund();
      message = result.status === 'submitted'
        ? 'Request submitted to Apple. Access and referral rewards update after Apple confirms the refund.'
        : 'Refund request cancelled or not submitted.';
      await fullVersionAccess.refresh();
    } catch { message = 'No eligible Sandbox purchase, or Apple could not open the refund sheet. Use this test on iOS 16 or later.'; }
    finally { button.disabled = false; }
    if (currentRoute === 'parent-more') document.querySelector('#supportMessage').textContent = message;
  });

  document.querySelector('#restore')?.addEventListener('click', async (event) => {
    if (!requireActiveParentAccess('parent-more', '#restore')) return;
    const button = event.currentTarget;
    let message = document.querySelector('#supportMessage');
    if (DEV_TEST_MODE) {
      message.textContent = 'Restore Purchases is available in the iOS build.';
      return;
    }

    button.disabled = true;
    message.textContent = 'Checking your App Store purchases…';
    const result = await fullVersionAccess.restore();
    if (currentRoute !== 'parent-more') return;
    message = document.querySelector('#supportMessage');
    if (result.status === 'restored' && fullVersionAccess.active) {
      parentMore();
      document.querySelector('#supportMessage').textContent = 'Full Version restored successfully.';
      return;
    } else if (result.status === 'not-found') {
      message.textContent = 'No previous Full Version purchase was found for this Apple ID.';
    } else if (result.status === 'cancelled') {
      message.textContent = 'Restore cancelled.';
    } else if (result.status === 'pending') {
      message.textContent = 'The App Store is still processing this purchase.';
    } else if (result.status === 'unavailable') {
      message.textContent = 'Restore Purchases is available in the iPhone App.';
    } else {
      message.textContent = 'Purchases could not be restored. Please try again.';
    }
    button.disabled = false;
  });
}

function parentReferrals() {
  if (FREE_FULL_ACCESS) return go('parent-more', { fromHistory: true });
  shell(`${pageHead('Refer & Gift Codes', 'Invite Families', 'Share multiplication practice with friends and family.')}<div id="referralPage"></div>`, 'parent', 'parent-more');
  void mountReferralPage(document.querySelector('#referralPage'), (event) => purchaseFullVersionFromButton(event.currentTarget), () => requireActiveParentAccess('parent-referrals'));
}

function parentSupport(target = 'all') {
  shell(`${pageHead('官方网站与联系', '获得 ChantCode 支持', '即使设备没有配置邮件，也可以复制网址或邮箱。')}
    <div class="support-options">
      <article class="support-option ${target === 'website' || target === 'all' ? 'active' : ''}" id="supportWebsite">
        <span class="support-option-icon" aria-hidden="true">↗</span>
        <div>
          <small>官方网站</small>
          <h2>chantcode.com</h2>
          <p>查看 ChantCode 的产品介绍和后续更新。打开网站需要网络连接。</p>
          <div class="support-actions">
            <button class="primary" id="openWebsite" type="button">打开官方网站</button>
            <button class="secondary" id="copyWebsite" type="button">复制网址</button>
          </div>
        </div>
      </article>

      <article class="support-option ${target === 'contact' || target === 'all' ? 'active' : ''}" id="supportContact">
        <span class="support-option-icon" aria-hidden="true">✉</span>
        <div>
          <small>联系邮箱</small>
          <h2>support@chantcode.com</h2>
          <p>设备没有配置邮件 App 时，可以复制邮箱后使用其他邮件工具联系。请不要在邮件中填写儿童姓名、学校或住址等隐私信息。</p>
          <div class="support-actions">
            <button class="primary" id="sendEmail" type="button">发送邮件</button>
            <button class="secondary" id="copyEmail" type="button">复制邮箱</button>
          </div>
        </div>
      </article>
    </div>
    <p class="support-message support-page-message" id="supportStatus" aria-live="polite"></p>`, 'parent', 'parent-more');

  const status = document.querySelector('#supportStatus');
  document.querySelector('#openWebsite').onclick = () => {
    if (!requireActiveParentAccess('parent-support', '#openWebsite')) return;
    status.textContent = '正在打开官方网站；如果没有响应，可以复制网址后在浏览器中打开。';
    window.open('https://chantcode.com/', '_blank', 'noopener');
  };
  document.querySelector('#copyWebsite').onclick = async () => {
    status.textContent = await copyText('https://chantcode.com/') ? '网址已复制。' : '复制失败，请手动输入 chantcode.com。';
  };
  document.querySelector('#sendEmail').onclick = () => {
    if (!requireActiveParentAccess('parent-support', '#sendEmail')) return;
    status.textContent = '正在打开系统邮件；如果没有响应，可以复制邮箱地址。';
    window.location.href = 'mailto:support@chantcode.com?subject=ChantCode%20App%20Support';
  };
  document.querySelector('#copyEmail').onclick = async () => {
    status.textContent = await copyText('support@chantcode.com') ? '邮箱已复制。' : '复制失败，请手动输入 support@chantcode.com。';
  };

  if (target === 'contact') {
    requestAnimationFrame(() => document.querySelector('#supportContact')?.scrollIntoView({ block: 'center' }));
  }
}

function parentAboutChantCode() {
  shell(`${pageHead('Book', 'ChantCode: Multiplication', 'Read the complete manuscript, including the onety structure, learning theory, and App learning path.')}
    ${CHANTCODE_BOOK_HTML}`, 'parent', 'parent-more');
}

function parentPrivacy() {
  shell(`${pageHead('Help, Privacy & Terms', 'Help, Privacy Policy & Terms of Use', 'Important support and legal information for ChantCode.')}
    <article class="usage-section">
      <h2>Help / How to Use</h2>
      <p>Children learn in this order: Read & Follow → Recite → Test → Tower Challenge. Test and challenge results are saved automatically and can be reviewed in Progress.</p>
    </article>
    <article class="usage-section">
      <h2>Privacy Policy</h2>
      <p>ChantCode requires no account, includes no advertising or third-party analytics, and does not upload learning progress to a developer-operated server. Test scores, completion status, and display preferences remain on the device.</p>
      <p>Voice Follow-Along uses Apple Speech to provide forgiving practice feedback after a child repeats a prompted chant. Voice is sent to Apple’s Speech service only when its network processing is required. ChantCode does not save recordings or transcripts. Final independent recitation is not scored by speech recognition; it is evaluated by a parent.</p>
      <p>The App does not request access to the camera, contacts, or location. Local learning records may not be recoverable after deleting the App or resetting its data.</p>
      ${!FREE_FULL_ACCESS && REFERRALS_ENABLED ? '<p>Refer &amp; Gift Codes is optional and available in the parent area. When you use it, ChantCode verifies Apple purchase transactions and stores purchase identifiers, invite attributions, refund status, and issued Gift Codes to manage referral rewards. Learning progress and children’s practice data are not sent to the referral service. No ChantCode account is required.</p>' : ''}
    </article>
    <article class="usage-section">
      <h2>Terms of Use</h2>
      <p>${FREE_FULL_ACCESS
        ? 'ChantCode provides multiplication practice and does not replace classroom teaching or professional educational advice.'
        : 'ChantCode provides multiplication practice and does not replace classroom teaching or professional educational advice. App Store purchases are handled by Apple, and ChantCode does not store payment information.'}</p>
      <p>Apple’s Standard End User License Agreement applies. For support or questions about these terms, contact support@chantcode.com.</p>
    </article>`, 'parent', 'parent-more');
}

async function purchaseFullVersionFromButton(button) {
  if (!(button instanceof HTMLButtonElement)) return;
  const returnRoute = currentRoute;
  const resumeSelector = button.id ? `#${button.id}` : '[data-buy]';
  if (!requireActiveParentAccess(returnRoute, resumeSelector)) return;
  if (hasFullAccess()) {
    go('child-full');
    return;
  }

  const originalMarkup = button.innerHTML;
  const localMessage = button.closest('article, section')?.querySelector('[data-message], .support-message');
  button.disabled = true;
  button.textContent = 'Connecting to the App Store…';
  if (localMessage) localMessage.textContent = '';

  const result = await fullVersionAccess.purchase();
  if (REFERRALS_ENABLED && result.status === 'purchased') {
    try { await qualifyPendingReferral(); }
    catch (error) {
      if (localMessage?.isConnected) localMessage.textContent = referralErrorText(error);
    }
  }

  if (result.status === 'purchased' && fullVersionAccess.active) {
    if (currentRoute === returnRoute) render(returnRoute);
    return;
  }
  if (!button.isConnected) return;

  button.disabled = false;
  button.innerHTML = originalMarkup;
  const text = result.status === 'cancelled'
    ? 'Purchase cancelled.'
    : result.status === 'pending'
      ? 'The purchase is pending approval in the App Store.'
      : result.status === 'unavailable'
        ? 'Full Version purchasing is available in the iPhone App.'
        : 'The purchase could not be completed. Please try again.';
  if (localMessage) localMessage.textContent = text;
  else button.setAttribute('aria-label', text);
}

function groupStatus(group) {
  const number = Number(group);
  if (FOUNDATION_GROUPS.includes(number)) return 'Available anytime';
  if (progress[`test${number}`]) return 'Test passed';
  if (progress[`attempted${number}`]) return 'Continue practice';
  return 'Not started';
}
function fullLearningCompleted() {
  return FULL_GROUPS.every((group) => Boolean(progress[`test${group}`]));
}
function fullCourseCompleted() {
  return fullLearningCompleted();
}
function groupUnlocked(group) { return isTrialGroupUnlocked(group); }
function fullGroupUnlocked(group) {
  if (DEV_FULL_ACCESS) return FULL_LEARNING_GROUPS.includes(Number(group));
  return isFullLearningGroupUnlocked({ ...progress, fullUnlocked: hasFullAccess() }, group);
}

function testUnlocked(group) {
  return groupUnlocked(group) || fullGroupUnlocked(group);
}

function gameUnlocked(group) {
  if (DEV_FULL_ACCESS) return group === 'mixed' || Boolean(getTowerMode(group));
  return isTowerChallengeUnlocked({ ...progress, fullUnlocked: hasFullAccess() }, group);
}
function chantFacts(group) {
  if (group === 1) {
    return Array.from({ length: 9 }, (_, index) => ({
      left: 1,
      right: index + 1,
      answer: index + 1,
    }));
  }
  if (group === 10) {
    return Array.from({ length: 9 }, (_, index) => ({
      left: index + 1,
      right: 10,
      answer: (index + 1) * 10,
    }));
  }
  return Array.from({ length: 10 - group }, (_, index) => {
    const right = group + index;
    return { left: group, right, answer: group * right };
  });
}
function practiceFacts(group) {
  if (FOUNDATION_GROUPS.includes(group)) {
    return chantFacts(group).map((fact, index) => index % 2 === 1 && fact.left !== fact.right
      ? { left: fact.right, right: fact.left, answer: fact.answer }
      : fact);
  }
  return chantFacts(group).flatMap((fact) => fact.left === fact.right
    ? [fact]
    : [fact, { left: fact.right, right: fact.left, answer: fact.answer }]);
}

function recitationModeUnlocked(mode) {
  return !mode.requiresFull || hasFullAccess();
}

function recitationModeCompleted(mode) {
  const detailedResult = progress.recitationResults?.[mode.id];
  if (detailedResult?.completed) return true;
  if (mode.groups.length === 1) {
    const group = mode.groups[0];
    return Boolean(progress[`verified${group}`] || progress[`bareRecite${group}`]);
  }
  return Boolean(mode.progressKey && progress[mode.progressKey]);
}

function childRecitation() {
  const modeCards = RECITATION_MODES.map((mode) => {
    const unlocked = recitationModeUnlocked(mode);
    const completed = recitationModeCompleted(mode);
    const detailedResult = progress.recitationResults?.[mode.id];
    const count = getRecitationFacts(mode).length;
    return `<button class="recitation-mode-card" data-route="child-recitation-${mode.id}" ${unlocked ? '' : 'disabled'}>
      <span>${mode.shortLabel}</span>
      <strong>${mode.label}</strong>
      <small>${unlocked ? `${count} chants${completed ? ' · Practice completed' : ''}` : 'Available in the full version'}</small>
    </button>`;
  }).join('');

  shell(
    `<div class="task-selection-layout recitation-selection-layout">
      <section class="task-selection-copy">
        ${pageHead('Chant Coach', 'Recite the Whole Group in Order', 'Your coach will help when you get stuck. Independent Recitation has no hints, and a parent confirms the final result.')}
        <p class="native-speech-note" id="recitationAvailability">Checking voice-recognition availability…</p>
      </section>
      <section class="task-selection-panel">
        <div class="recitation-mode-grid">${modeCards}</div>
      </section>
    </div>`,
    'child',
    'child'
  );

  void refreshRecitationSelectorAvailability();
}

async function refreshRecitationSelectorAvailability() {
  const status = document.querySelector('#recitationAvailability');
  const availability = await getChantSpeechAvailability();
  if (!status || currentRoute !== 'child-recitation') return;
  status.textContent = availability.native
    ? 'Voice recognition is available. Microphone and speech permissions are requested only when recitation starts.'
    : 'Speech recitation is available in the iPhone/iPad app.';
  status.dataset.state = availability.native ? 'ready' : 'unavailable';
}

function startRecitationMode(modeId, runKind = 'coach') {
  const mode = getRecitationMode(modeId);
  if (!mode || !recitationModeUnlocked(mode)) return childRecitation();
  const facts = getRecitationFacts(mode);
  if (!IS_NATIVE_IOS) return startWebFollowAlong(facts, null);
  const normalizedRunKind = runKind === 'strict' ? 'strict' : 'coach';
  clearRecitationModeTimers();
  stopVoice();
  session = {
    type: 'recitation',
    mode,
    facts,
    runKind: normalizedRunKind,
    index: 0,
    currentQuestionId: '',
    nativeSessionId: null,
    recognitionWindowStartIndex: 0,
    recognitionWindowMatchedCount: 0,
    candidateHistory: [],
    coachAttemptStartedAt: 0,
    wrongRetryActive: false,
    shouldCoachPromptAfterWrong: false,
    uncertainRetryCount: 0,
    shouldAdvanceAfterReview: false,
    heardSpeechThisTurn: false,
    noSpeechCount: 0,
    isStarting: false,
    isListening: false,
    isEvaluating: false,
    isAdvancing: false,
    isCoaching: false,
    isPaused: false,
    hasStarted: false,
    voiceBlocked: false,
    factStates: facts.map(() => RECITATION_OUTCOMES.UNCERTAIN),
    promptedFacts: new Set(),
    needsReview: new Set(),
    silencePromptCount: 0,
    promptCount: 0,
    wrongCount: 0,
    pendingWrongKey: '',
    pendingWrongAt: 0,
    pendingWrongCount: 0,
    lastWrongSignature: '',
    partialDecisionKey: '',
    partialDecisionPayload: null,
    settledQuestionId: '',
    lastActivityAt: 0,
    strictTimingActive: false,
    fluentEligible: normalizedRunKind === 'strict',
    maxPauseMs: 0,
    hesitationCount: 0,
  };
  renderRecitationSession();
}

function renderRecitationSession() {
  const state = session;
  if (!state || state.type !== 'recitation') return childRecitation();
  const isCoach = state.runKind === 'coach';
  const title = isCoach ? 'Chant Coach' : 'Independent Recitation';
  const detail = isCoach
    ? 'Recite the whole group in order. Your coach will help when you get stuck.'
      : 'Recite the whole group in order with no hints. The App helps you practise; a parent confirms the final result.';

  shell(
    `<section class="recitation-page">
      <div class="recitation-toolbar">
        <button class="text-button" data-route="child-recitation">← Back</button>
        <strong>${state.mode.label}</strong>
        <span id="recitationCount">0 / ${state.facts.length}</span>
      </div>
      <div class="recitation-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${state.facts.length}" aria-valuenow="0">
        <span style="width:0%"></span>
      </div>
      <div class="recitation-kind-switch" role="group" aria-label="Recitation mode">
        <button type="button" data-recitation-kind="coach" aria-pressed="${isCoach}">Coach Mode</button>
        <button type="button" data-recitation-kind="strict" aria-pressed="${!isCoach}">Independent Recitation</button>
      </div>
      <article class="recitation-card">
        <div class="recitation-memory-mode">
          <span aria-hidden="true">♫</span>
          <div><strong>${title}</strong><small>${detail}</small></div>
        </div>
        <div class="recitation-status" id="recitationStatus" data-state="ready" data-outcome="${RECITATION_OUTCOMES.UNCERTAIN}" role="status" aria-live="polite" aria-atomic="true">
          <span aria-hidden="true">●</span>
          <div><strong>Ready when you are</strong><small>Wait for “Your turn”, say one whole chant, then pause.</small></div>
        </div>
        <div class="recitation-passed-fact" id="recitationPassedFact" hidden aria-hidden="true">
          <span aria-hidden="true">✓</span><strong></strong>
        </div>
        <div class="recitation-actions">
          <button class="primary big" id="startRecitationListening" type="button">${isCoach ? 'Start Coach' : 'Start Independent Recitation'}</button>
          <button class="text-button recitation-stop" id="stopRecitationListening" type="button" disabled>Stop</button>
          <button class="text-button recitation-reset" id="resetRecitationActivity" type="button" aria-label="Reset this recitation session and start again from the first chant">Reset Session</button>
        </div>
        <p class="native-speech-note" id="recitationNativeNote">Checking voice-recognition availability…</p>
      </article>
    </section>`,
    'child',
    'child',
    { focus: true }
  );

  document.querySelectorAll('[data-recitation-kind]').forEach((button) => {
    button.onclick = () => startRecitationMode(state.mode.id, button.dataset.recitationKind);
  });
  document.querySelector('#startRecitationListening').onclick = () => void beginRecitationListening(!state.hasStarted);
  document.querySelector('#stopRecitationListening').onclick = () => void stopCurrentRecitationListening();
  document.querySelector('#resetRecitationActivity').onclick = () => void resetRecitationActivity();
  void refreshRecitationPageAvailability();
}

async function resetRecitationActivity() {
  const state = session;
  if (!state || state.type !== 'recitation') return;
  const modeId = state.mode.id;
  const runKind = state.runKind;
  await cleanupSpeechSession();
  if (session !== state) return;
  session = null;
  startRecitationMode(modeId, runKind);
}

function setRecitationStatus(stateName, title, detail, icon = '●', outcome = RECITATION_OUTCOMES.UNCERTAIN) {
  const status = document.querySelector('#recitationStatus');
  if (!status) return;
  status.dataset.state = stateName;
  status.dataset.outcome = outcome;
  status.querySelector(':scope > span').textContent = icon;
  status.querySelector('strong').textContent = title;
  status.querySelector('small').textContent = detail;
}

function hidePassedRecitationFact() {
  const feedback = document.querySelector('#recitationPassedFact');
  if (!feedback) return;
  feedback.hidden = true;
  feedback.setAttribute('aria-hidden', 'true');
  feedback.removeAttribute('aria-label');
  const equation = feedback.querySelector('strong');
  if (equation) equation.textContent = '';
}

function showPassedRecitationFact(fact) {
  const feedback = document.querySelector('#recitationPassedFact');
  if (!feedback || !fact) return;
  const equation = `${fact.a} × ${fact.b} = ${fact.result}`;
  feedback.querySelector('strong').textContent = equation;
  feedback.hidden = false;
  feedback.setAttribute('aria-hidden', 'false');
  feedback.setAttribute('aria-label', `Correct: ${fact.a} times ${fact.b} equals ${fact.result}`);
}

function updateRecitationProgressUI() {
  const state = session;
  if (!state || state.type !== 'recitation') return;
  const completed = Math.min(state.index, state.facts.length);
  const count = document.querySelector('#recitationCount');
  const progressBar = document.querySelector('.recitation-progress');
  const fill = progressBar?.querySelector('span');
  if (count) count.textContent = `${completed} / ${state.facts.length}`;
  if (progressBar) progressBar.setAttribute('aria-valuenow', String(completed));
  if (fill) fill.style.width = `${(completed / state.facts.length) * 100}%`;
}

function updateRecitationControls() {
  const state = session;
  if (!state || state.type !== 'recitation') return;
  const startButton = document.querySelector('#startRecitationListening');
  const stopButton = document.querySelector('#stopRecitationListening');
  const busy = state.isStarting || state.isListening || state.isEvaluating || state.isAdvancing || state.isCoaching;
  if (startButton) {
    startButton.disabled = state.voiceBlocked || busy || state.index >= state.facts.length;
    startButton.textContent = state.hasStarted
      ? 'Resume'
      : state.runKind === 'coach' ? 'Start Coach' : 'Start Independent Recitation';
  }
  if (stopButton) stopButton.disabled = !busy || state.isEvaluating || state.isAdvancing || state.isCoaching;
  document.querySelectorAll('[data-recitation-kind]').forEach((button) => { button.disabled = busy; });
}

async function refreshRecitationPageAvailability() {
  const state = session;
  if (!state || state.type !== 'recitation') return;
  const questionId = state.currentQuestionId;
  const availability = await getChantSpeechAvailability();
  if (session !== state || state.currentQuestionId !== questionId) return;
  const note = document.querySelector('#recitationNativeNote');
  if (!note) return;

  if (!availability.native) {
    state.voiceBlocked = true;
    note.textContent = 'Speech recitation is available in the iPhone/iPad app.';
    note.dataset.state = 'unavailable';
    setRecitationStatus('unavailable', 'Voice recognition needs the app', 'Open this activity in the iPhone/iPad app.');
    updateRecitationControls();
    return;
  }

  const denied = ['denied', 'restricted'].includes(availability.speechPermission)
    || ['denied', 'restricted'].includes(availability.microphonePermission);
  state.voiceBlocked = denied;
  note.textContent = denied
    ? 'Speech Recognition or Microphone access is turned off. Enable access in iOS Settings.'
    : 'Speak naturally and pause after each chant. Only the multiplication numbers are checked; accent and pronunciation are not graded.';
  note.dataset.state = denied ? 'unavailable' : 'ready';
  if (denied) setRecitationStatus('unavailable', 'Microphone access is needed', 'Enable Speech Recognition and Microphone access in iOS Settings.');
  updateRecitationControls();
}

async function ensureChantSpeechListeners() {
  if (chantSpeechListenerHandles.length) return;
  if (chantSpeechListenerSetupPromise) return chantSpeechListenerSetupPromise;

  chantSpeechListenerSetupPromise = Promise.all([
    addChantSpeechListener('partialResult', handleChantSpeechPartialResult),
    addChantSpeechListener('finalResult', handleChantSpeechFinalResult),
    addChantSpeechListener('speechError', handleChantSpeechError),
    addChantSpeechListener('speechActivity', handleChantSpeechActivity),
  ]).then((handles) => {
    chantSpeechListenerHandles = handles;
  }).finally(() => {
    chantSpeechListenerSetupPromise = null;
  });
  return chantSpeechListenerSetupPromise;
}

function clearRecitationModeTimers() {
  if (recitationSilenceTimer !== null) window.clearTimeout(recitationSilenceTimer);
  if (recitationRestartTimer !== null) window.clearTimeout(recitationRestartTimer);
  if (recitationPartialDecisionTimer !== null) window.clearTimeout(recitationPartialDecisionTimer);
  recitationSilenceTimer = null;
  recitationRestartTimer = null;
  recitationPartialDecisionTimer = null;
  if (session?.type === 'recitation') {
    session.partialDecisionKey = '';
    session.partialDecisionPayload = null;
  }
}

function clearRecitationPartialDecision(state) {
  if (recitationPartialDecisionTimer !== null) window.clearTimeout(recitationPartialDecisionTimer);
  recitationPartialDecisionTimer = null;
  if (!state || state.type !== 'recitation') return;
  state.partialDecisionKey = '';
  state.partialDecisionPayload = null;
}

function armRecitationTiming(state) {
  if (recitationSilenceTimer !== null) window.clearTimeout(recitationSilenceTimer);
  recitationSilenceTimer = null;
  if (session !== state || !state.isListening || state.isCoaching || state.isPaused) return;

  if (state.runKind === 'coach') {
    const elapsed = Date.now() - state.coachAttemptStartedAt;
    const delay = Math.max(40, COACH_SILENCE_MS - elapsed);
    recitationSilenceTimer = window.setTimeout(() => {
      recitationSilenceTimer = null;
      if (session !== state || !state.isListening || Date.now() - state.coachAttemptStartedAt < COACH_SILENCE_MS) {
        armRecitationTiming(state);
        return;
      }
      void handleCoachSilenceTimeout(state);
    }, delay);
    return;
  }

  if (!state.strictTimingActive || !state.fluentEligible || !state.lastActivityAt) return;
  const elapsed = Date.now() - state.lastActivityAt;
  const delay = Math.max(40, FLUENT_PAUSE_LIMIT_MS - elapsed);
  recitationSilenceTimer = window.setTimeout(() => {
    recitationSilenceTimer = null;
    if (session !== state || !state.isListening || !state.strictTimingActive) return;
    const pause = Date.now() - state.lastActivityAt;
    if (pause < FLUENT_PAUSE_LIMIT_MS) return armRecitationTiming(state);
    state.maxPauseMs = Math.max(state.maxPauseMs, pause);
    state.fluentEligible = false;
    setRecitationStatus('uncertain', 'Keep going', 'This pause affects fluency, but the test continues with no hints.', '…', RECITATION_OUTCOMES.UNCERTAIN);
  }, delay);
}

function scheduleRecitationRestart(state, delay = 160) {
  if (recitationRestartTimer !== null) window.clearTimeout(recitationRestartTimer);
  if (session !== state || state.isPaused || state.isCoaching || state.index >= state.facts.length) return;
  recitationRestartTimer = window.setTimeout(() => {
    recitationRestartTimer = null;
    if (session === state && !state.isPaused && !state.isCoaching) void beginRecitationListening(false);
  }, delay);
}

function resetRecitationRecognitionWindow(state) {
  clearRecitationPartialDecision(state);
  state.recognitionWindowStartIndex = state.index;
  state.recognitionWindowMatchedCount = 0;
  state.candidateHistory = [];
  state.coachAttemptStartedAt = 0;
  state.pendingWrongKey = '';
  state.pendingWrongAt = 0;
  state.pendingWrongCount = 0;
  state.lastWrongSignature = '';
  state.heardSpeechThisTurn = false;
  state.settledQuestionId = '';
}

async function beginRecitationListening(requestPermissions) {
  const state = session;
  if (!state || state.type !== 'recitation' || state.isStarting || state.isListening || state.isEvaluating || state.isAdvancing || state.isCoaching) return;
  const fact = state.facts[state.index];
  if (!fact) return completeRecitationMode();
  hidePassedRecitationFact();
  state.isStarting = true;
  state.isPaused = false;
  state.hasStarted = true;
  resetRecitationRecognitionWindow(state);
  const questionId = `${state.mode.id}:${state.runKind}:${state.index}:${++recitationAttemptCounter}`;
  state.currentQuestionId = questionId;
  updateRecitationControls();
  setRecitationStatus('listening', 'Getting ready…', 'You can begin when “Your turn” appears.');
  stopVoice();

  try {
    const availability = await getChantSpeechAvailability();
    if (!availability.native) throw Object.assign(new Error('Speech recitation is available in the iPhone/iPad app.'), { code: 'native_speech_unavailable' });

    if (requestPermissions) {
      const permissions = await requestChantSpeechPermissions({ localOnly: state.runKind === 'coach' });
      const localCoachAvailable = state.runKind === 'coach' && permissions.localTemplateMatching === true;
      if (permissions.microphonePermission !== 'authorized'
        || (permissions.speechPermission !== 'authorized' && !localCoachAvailable)) {
        throw Object.assign(new Error(localCoachAvailable
          ? 'Microphone access is required.'
          : 'Speech Recognition and Microphone access are required.'), { code: 'permission_denied' });
      }
    }

    if (session !== state || state.currentQuestionId !== questionId || state.isPaused) {
      await cancelChantSpeech();
      return;
    }

    await ensureChantSpeechListeners();
    const started = await startChantSpeech({
      questionId,
      contextualStrings: buildContextualStrings(state.mode, fact),
      localTemplatePath: state.runKind === 'coach'
        ? multiplicationFactAudioPath(fact.a, fact.b)
        : '',
      localCompetitorPaths: state.runKind === 'coach'
        ? state.facts
          .filter((candidate) => candidate.a !== fact.a || candidate.b !== fact.b)
          .map((candidate) => multiplicationFactAudioPath(candidate.a, candidate.b))
          .filter(Boolean)
        : [],
      continuous: true,
      finalizeOnSilence: true,
      silenceDuration: state.runKind === 'coach' ? 3.0 : 2.5,
      initialSilenceDuration: state.runKind === 'coach' ? 10 : 12,
    });

    if (session !== state || state.currentQuestionId !== questionId || state.isPaused) {
      await cancelChantSpeech();
      return;
    }

    state.nativeSessionId = started.sessionId ?? null;
    state.isStarting = false;
    state.isListening = true;
    if (!state.lastActivityAt) state.lastActivityAt = Date.now();
    if (!state.coachAttemptStartedAt) state.coachAttemptStartedAt = Date.now();
    setRecitationStatus(
      'listening',
      'Your turn',
      state.runKind === 'coach' ? 'Say one whole chant at your own pace, then pause.' : 'Say one whole chant, then pause. No answers will be played.',
      '●'
    );
    updateRecitationControls();
    armRecitationTiming(state);
  } catch (error) {
    if (session !== state || state.currentQuestionId !== questionId || state.isPaused) return;
    state.isStarting = false;
    state.isListening = false;
    const permissionError = error?.code === 'permission_denied' || /permission|authorized/i.test(error?.message ?? '');
    if (permissionError) state.voiceBlocked = true;
    setRecitationStatus(
      'retry',
      permissionError ? 'Microphone access is needed' : 'Unable to start listening',
      permissionError ? 'Enable Speech Recognition and Microphone access in iOS Settings.' : 'Tap Resume to continue from the same chant.',
      '!'
    );
    updateRecitationControls();
  }
}

async function stopCurrentRecitationListening() {
  const state = session;
  if (!state || state.type !== 'recitation') return;
  clearRecitationModeTimers();
  state.isStarting = false;
  state.isListening = false;
  state.isEvaluating = false;
  state.isAdvancing = false;
  state.isCoaching = false;
  state.isPaused = true;
  state.nativeSessionId = null;
  stopVoice();
  await cancelChantSpeech();
  if (session !== state) return;
  setRecitationStatus('ready', 'Recitation paused', 'Tap Resume to continue from the same place.');
  updateRecitationControls();
}

function recitationPayloadMatches(state, payload) {
  return Boolean(
    state
    && state.type === 'recitation'
    && payload?.questionId === state.currentQuestionId
    && payload.questionId !== state.settledQuestionId
    && (!payload?.sessionId || !state.nativeSessionId || payload.sessionId === state.nativeSessionId)
  );
}

function recitationCandidates(payload) {
  return [...(Array.isArray(payload?.candidates) ? payload.candidates : []), payload?.transcript]
    .filter((value, index, values) => typeof value === 'string' && value.trim() && values.indexOf(value) === index);
}

function handleRecitationActivity(payload) {
  const state = session;
  if (!recitationPayloadMatches(state, payload) || !state.isListening || state.isCoaching) return;
  if (payload?.source === 'processing') {
    state.isEvaluating = true;
    setRecitationStatus('checking', 'Checking what you said…', 'Your chant is finished. You do not need to say it again yet.', '…');
    updateRecitationControls();
    return;
  }
  const now = Date.now();
  if (payload?.source === 'recognition') {
    state.noSpeechCount = 0;
    if (!state.heardSpeechThisTurn) {
      state.heardSpeechThisTurn = true;
      setRecitationStatus('speaking', 'I can hear you', 'Finish the chant at your own pace, then pause.', '◉');
    }
    if (state.runKind === 'coach') state.coachAttemptStartedAt = now;
  }
  if (state.runKind === 'strict' && state.strictTimingActive && state.lastActivityAt) {
    const pause = now - state.lastActivityAt;
    if (pause >= FLUENT_PAUSE_WARN_MS) {
      state.maxPauseMs = Math.max(state.maxPauseMs, pause);
      if (pause > FLUENT_PAUSE_LIMIT_MS) state.fluentEligible = false;
      else state.hesitationCount += 1;
    }
  }
  if (state.runKind === 'strict') state.lastActivityAt = now;
  armRecitationTiming(state);
}

function handleChantSpeechActivity(payload) {
  if (session?.type === 'spoken-answer') return handleSpokenAnswerActivity(payload);
  if (session?.type === 'recitation') handleRecitationActivity(payload);
}

function setCurrentRecitationOutcome(state, outcome) {
  if (state.index >= state.factStates.length) return;
  if (outcome === RECITATION_OUTCOMES.UNCERTAIN && state.factStates[state.index] !== RECITATION_OUTCOMES.UNCERTAIN) return;
  state.factStates[state.index] = outcome;
}

function resetCurrentRecitationFact(state) {
  clearRecitationPartialDecision(state);
  state.silencePromptCount = 0;
  state.pendingWrongKey = '';
  state.pendingWrongAt = 0;
  state.pendingWrongCount = 0;
  state.lastWrongSignature = '';
  state.candidateHistory = [];
  state.coachAttemptStartedAt = 0;
  state.wrongRetryActive = false;
  state.shouldCoachPromptAfterWrong = false;
  state.uncertainRetryCount = 0;
  state.shouldAdvanceAfterReview = false;
  state.heardSpeechThisTurn = false;
  state.noSpeechCount = 0;
}

function markUncertainRecitationAttempt(state, title, detail) {
  state.uncertainRetryCount += 1;
  state.shouldAdvanceAfterReview = state.uncertainRetryCount >= 2;
  setCurrentRecitationOutcome(state, RECITATION_OUTCOMES.UNCERTAIN);
  setRecitationStatus(
    'uncertain',
    state.shouldAdvanceAfterReview ? 'Good try — let’s keep going' : title,
    state.shouldAdvanceAfterReview
      ? 'We’ll save this chant for a parent to check later and continue with the next one.'
      : detail,
    '…',
    RECITATION_OUTCOMES.UNCERTAIN
  );
  return RECITATION_OUTCOMES.UNCERTAIN;
}

function advanceRecitationFactForParentReview(state, outcome = RECITATION_OUTCOMES.UNCERTAIN) {
  if (session !== state || state.index >= state.facts.length) return true;
  const fact = state.facts[state.index];
  state.needsReview.add(`${fact.a}x${fact.b}`);
  state.factStates[state.index] = outcome;
  state.index += 1;
  resetCurrentRecitationFact(state);
  updateRecitationProgressUI();
  if (state.index >= state.facts.length) {
    completeRecitationMode();
    return true;
  }
  setRecitationStatus('review', 'Saved for a parent to check', 'Nice effort. The next chant is coming up.', '☆', outcome);
  scheduleRecitationRestart(state, 1000);
  return false;
}

function acceptRecitationFacts(state, count) {
  const accepted = Math.max(0, Math.min(count, state.facts.length - state.index));
  if (!accepted) return false;
  let lastAcceptedFact = null;

  for (let offset = 0; offset < accepted; offset += 1) {
    const factIndex = state.index;
    lastAcceptedFact = state.facts[factIndex];
    state.factStates[factIndex] = state.promptedFacts.has(factIndex)
      ? RECITATION_OUTCOMES.PROMPTED
      : RECITATION_OUTCOMES.PASS;
    state.index += 1;
    resetCurrentRecitationFact(state);
  }

  updateRecitationProgressUI();
  showPassedRecitationFact(lastAcceptedFact);
  if (state.index >= state.facts.length) {
    state.isAdvancing = true;
    setRecitationStatus('correct', 'Great work — group complete!', 'Here is the last chant you completed.', '✓', RECITATION_OUTCOMES.PASS);
    updateRecitationControls();
    if (recitationAdvanceTimer !== null) window.clearTimeout(recitationAdvanceTimer);
    recitationAdvanceTimer = window.setTimeout(() => {
      recitationAdvanceTimer = null;
      if (session === state) completeRecitationMode();
    }, 900);
    return true;
  }

  state.strictTimingActive = state.runKind === 'strict';
  state.coachAttemptStartedAt = Date.now();
  setRecitationStatus('correct', 'Nice! That chant is complete', 'Get ready for the next chant.', '✓', RECITATION_OUTCOMES.PASS);
  armRecitationTiming(state);
  return false;
}

function shouldAcceptExplicitWrong(state, evaluation, isFinal) {
  if (!evaluation.mismatch) return false;
  const signature = `${state.index}:${evaluation.mismatch.join(',')}`;
  if (state.lastWrongSignature === signature) return false;
  if (isFinal) {
    state.lastWrongSignature = signature;
    return true;
  }

  const now = Date.now();
  if (state.pendingWrongKey !== signature) {
    state.pendingWrongKey = signature;
    state.pendingWrongAt = now;
    state.pendingWrongCount = 1;
    return false;
  }
  state.pendingWrongCount += 1;
  if (now - state.pendingWrongAt < RECITATION_WRONG_CONFIRM_MS && state.pendingWrongCount < 3) return false;
  state.lastWrongSignature = signature;
  return true;
}

function evaluateCurrentRecitationPayload(state, payload) {
  state.candidateHistory = mergeSpeechCandidateHistory(state.candidateHistory, recitationCandidates(payload));
  const candidates = state.candidateHistory;
  let evaluation = evaluateRecitationCandidates(candidates, state.facts, state.recognitionWindowStartIndex);
  let previousMatched = state.recognitionWindowMatchedCount;

  if (evaluation.matchedCount <= previousMatched && state.index > state.recognitionWindowStartIndex) {
    const currentWindow = evaluateRecitationCandidates(candidates, state.facts, state.index);
    if (currentWindow.matchedCount > 0 || (evaluation.matchedCount < previousMatched && currentWindow.mismatch)) {
      state.recognitionWindowStartIndex = state.index;
      state.recognitionWindowMatchedCount = 0;
      previousMatched = 0;
      evaluation = currentWindow;
    }
  }

  return { evaluation, newMatchCount: Math.max(0, evaluation.matchedCount - previousMatched) };
}

function evaluateCompletedRecitationPayload(state, payload) {
  const finalCandidates = recitationCandidates(payload);
  const candidates = mergeSpeechCandidateHistory(state.candidateHistory, finalCandidates);
  const evaluation = evaluateCompletedRecitationTurn(
    candidates,
    state.facts,
    state.index
  );
  return { evaluation, newMatchCount: evaluation.matchedCount };
}

function processRecitationResult(payload, isFinal) {
  const state = session;
  if (!recitationPayloadMatches(state, payload) || state.isCoaching || state.isPaused) return;
  if (state.runKind === 'coach' && payload?.localTemplateMatched === true) {
    if (acceptRecitationFacts(state, 1)) return RECITATION_OUTCOMES.PASS;
    return RECITATION_OUTCOMES.PASS;
  }
  const { evaluation, newMatchCount } = isFinal
    ? evaluateCompletedRecitationPayload(state, payload)
    : evaluateCurrentRecitationPayload(state, payload);

  if (newMatchCount > 0) {
    state.recognitionWindowMatchedCount = evaluation.matchedCount;
    if (acceptRecitationFacts(state, newMatchCount)) return RECITATION_OUTCOMES.PASS;
    if (!evaluation.mismatch) return RECITATION_OUTCOMES.PASS;
  }

  if (!evaluation.mismatch) {
    return markUncertainRecitationAttempt(state, 'Let’s try that one again', 'I may not have heard the whole chant. Say it once more at your own pace.');
  }

  if (isLikelyIncompleteTeenChant(evaluation.mismatch, state.facts[state.index])) {
    return markUncertainRecitationAttempt(state, 'Let’s try that one again', 'I may not have heard the whole Onety answer. Take your time.');
  }

  if (isLikelyIncompleteCompoundChant(evaluation.mismatch, state.facts[state.index])) {
    return markUncertainRecitationAttempt(state, 'Let’s try that one again', 'I may have heard only part of the answer. Take your time.');
  }

  const confidence = Number(payload?.confidence);
  if (isFinal && Number.isFinite(confidence) && confidence > 0 && confidence < 0.32) {
    return markUncertainRecitationAttempt(state, 'Let’s try that one again', 'I may not have heard that clearly. Say the same chant once more.');
  }

  if (!shouldAcceptExplicitWrong(state, evaluation, isFinal)) {
    return markUncertainRecitationAttempt(state, 'Let’s try that one again', 'I may not have heard that clearly. Say the same chant once more at your own pace.');
  }

  state.wrongCount += 1;
  state.fluentEligible = false;
  setCurrentRecitationOutcome(state, RECITATION_OUTCOMES.WRONG);
  if (state.runKind === 'coach') {
    const alreadyRetried = state.wrongRetryActive;
    state.wrongRetryActive = true;
    state.shouldCoachPromptAfterWrong = alreadyRetried;
    state.coachAttemptStartedAt = Date.now();
    setRecitationStatus(
      alreadyRetried ? 'prompted' : 'uncertain',
      alreadyRetried ? 'Let’s listen once' : 'Let’s try that chant once more',
      alreadyRetried
        ? 'The coach will play it once, then you can repeat it.'
        : 'Nice try. I may have heard that one incorrectly, so say it once more at your own pace.',
      alreadyRetried ? '♫' : '↻',
      RECITATION_OUTCOMES.WRONG
    );
  } else {
    const alreadyRetried = state.wrongRetryActive;
    state.wrongRetryActive = true;
    state.shouldAdvanceAfterReview = alreadyRetried;
    setRecitationStatus(
      alreadyRetried ? 'review' : 'uncertain',
      alreadyRetried ? 'Good try — let’s keep going' : 'Let’s try that one again',
      alreadyRetried
        ? 'We’ll save this chant for a parent to check. No answer will be played.'
        : 'Say the same chant once more. No answer will be played during Independent Recitation.',
      alreadyRetried ? '☆' : '↻',
      RECITATION_OUTCOMES.WRONG
    );
  }
  return RECITATION_OUTCOMES.WRONG;
}

function finishRecitationAttempt(state, payload) {
  if (!recitationPayloadMatches(state, payload) || state.isAdvancing) return;
  clearRecitationPartialDecision(state);
  state.isStarting = false;
  state.isListening = false;
  state.isEvaluating = false;
  const outcome = processRecitationResult(payload, true);
  state.nativeSessionId = null;
  state.settledQuestionId = payload.questionId;
  updateRecitationControls();
  if (session !== state || state.isPaused || state.index >= state.facts.length) return;
  if (outcome === RECITATION_OUTCOMES.WRONG && state.runKind === 'coach' && state.shouldCoachPromptAfterWrong) {
    state.needsReview.add(`${state.facts[state.index].a}x${state.facts[state.index].b}`);
    void playRecitationCoachPrompt(state, { advanceAfter: true, reason: 'wrong' });
    return;
  }
  if (state.shouldAdvanceAfterReview) {
    if (state.runKind === 'coach') {
      state.needsReview.add(`${state.facts[state.index].a}x${state.facts[state.index].b}`);
      void playRecitationCoachPrompt(state, { advanceAfter: true, reason: 'uncertain' });
    } else {
      advanceRecitationFactForParentReview(state, outcome);
    }
    return;
  }
  if (!state.isCoaching) scheduleRecitationRestart(state, outcome === RECITATION_OUTCOMES.PASS ? 700 : 1100);
}

function settleRecitationPartialAttempt(state, payload) {
  if (!recitationPayloadMatches(state, payload) || !state.isListening || state.isAdvancing) return;
  state.isListening = false;
  state.isEvaluating = true;
  setRecitationStatus('checking', 'Checking what you said…', 'Your chant is complete.', '…');
  updateRecitationControls();
  // The three-number structure is already complete, so the saved Apple
  // alternatives can be scored now without waiting for the native silence end.
  void cancelChantSpeech().catch(() => {});
  finishRecitationAttempt(state, {
    ...payload,
    candidates: state.candidateHistory,
    transcript: payload?.transcript ?? state.candidateHistory.at(-1) ?? '',
  });
}

function armPartialRecitationDecision(state, payload, decisionKey, delay) {
  state.partialDecisionPayload = payload;
  if (recitationPartialDecisionTimer !== null && state.partialDecisionKey === decisionKey) return;
  clearRecitationPartialDecision(state);
  state.partialDecisionKey = decisionKey;
  state.partialDecisionPayload = payload;
  recitationPartialDecisionTimer = window.setTimeout(() => {
    recitationPartialDecisionTimer = null;
    if (
      session !== state
      || !state.isListening
      || state.isAdvancing
      || state.partialDecisionKey !== decisionKey
    ) return;
    const savedPayload = state.partialDecisionPayload;
    state.partialDecisionKey = '';
    state.partialDecisionPayload = null;
    settleRecitationPartialAttempt(state, savedPayload);
  }, delay);
}

function handleRecitationPartialResult(payload) {
  const state = session;
  if (!recitationPayloadMatches(state, payload) || !state.isListening || state.isEvaluating || state.isAdvancing) return;
  const previousCandidateCount = state.candidateHistory.length;
  state.candidateHistory = mergeSpeechCandidateHistory(state.candidateHistory, recitationCandidates(payload));
  if (state.runKind === 'coach' && state.candidateHistory.length > previousCandidateCount) {
    state.coachAttemptStartedAt = Date.now();
    armRecitationTiming(state);
  }
  if (!state.heardSpeechThisTurn) setRecitationStatus('listening', 'Your turn', 'Say one whole chant at your own pace, then pause.', '●');

  const { evaluation, newMatchCount } = evaluateCompletedRecitationPayload(state, payload);
  if (newMatchCount > 0) {
    clearRecitationPartialDecision(state);
    settleRecitationPartialAttempt(state, payload);
    return;
  }
  if (!evaluation.mismatch) return;

  const fact = state.facts[state.index];
  const incompleteResult = isLikelyIncompleteTeenChant(evaluation.mismatch, fact)
    || isLikelyIncompleteCompoundChant(evaluation.mismatch, fact);
  const mismatchKey = evaluation.mismatch.join(',');
  armPartialRecitationDecision(
    state,
    payload,
    `${state.currentQuestionId}:${state.index}:${incompleteResult ? 'compound' : 'wrong'}:${mismatchKey}`,
    incompleteResult ? RECITATION_COMPOUND_GRACE_MS : RECITATION_WRONG_CONFIRM_MS
  );
}

function handleChantSpeechPartialResult(payload) {
  if (session?.type === 'spoken-answer') return handleSpokenAnswerPartialResult(payload);
  handleRecitationPartialResult(payload);
}

function handleChantSpeechFinalResult(payload) {
  if (session?.type === 'spoken-answer') return handleSpokenAnswerFinalResult(payload);
  handleRecitationFinalResult(payload);
}

function handleChantSpeechError(payload) {
  if (session?.type === 'spoken-answer') return handleSpokenAnswerSpeechError(payload);
  handleRecitationSpeechError(payload);
}

function handleRecitationFinalResult(payload) {
  const state = session;
  finishRecitationAttempt(state, payload);
}

function handleRecitationSpeechError(payload) {
  const state = session;
  if (!state || state.type !== 'recitation' || (payload?.questionId && payload.questionId !== state.currentQuestionId)) return;
  if (payload?.questionId && payload.questionId === state.settledQuestionId) return;
  if (payload?.sessionId && state.nativeSessionId && payload.sessionId !== state.nativeSessionId) return;
  if (payload?.code === 'no_final_result' && (state.candidateHistory.length || payload?.localTemplateMatched === true)) {
    finishRecitationAttempt(state, {
      ...payload,
      candidates: state.candidateHistory,
      transcript: state.candidateHistory.at(-1) ?? '',
    });
    return;
  }
  state.isStarting = false;
  state.isListening = false;
  state.isEvaluating = false;
  state.nativeSessionId = null;
  const permissionError = payload?.code === 'permission_denied';
  const inactiveError = payload?.code === 'app_inactive';
  const noSpeechError = payload?.code === 'no_speech';
  if (noSpeechError) {
    state.noSpeechCount += 1;
    if (state.noSpeechCount >= 2) {
      state.isPaused = true;
      setRecitationStatus('ready', 'Take a little break', 'Nothing was scored. Tap Resume whenever you are ready.', '○');
    } else {
      setRecitationStatus('uncertain', 'I’m ready when you are', 'Nothing was scored. We’ll listen again in a moment.', '○');
      scheduleRecitationRestart(state, 1200);
    }
    updateRecitationControls();
    return;
  }
  if (permissionError || inactiveError) {
    state.isPaused = true;
    if (permissionError) state.voiceBlocked = true;
    setRecitationStatus(
      'retry',
      permissionError ? 'Microphone access is needed' : 'Recitation paused',
      permissionError ? 'Enable Speech Recognition and Microphone access in iOS Settings.' : 'Tap Resume when the app is active again.',
      '!'
    );
  } else {
    setCurrentRecitationOutcome(state, RECITATION_OUTCOMES.UNCERTAIN);
    setRecitationStatus('uncertain', 'Listening is reconnecting…', 'No answer was scored. Continue from the same chant.', '…', RECITATION_OUTCOMES.UNCERTAIN);
    scheduleRecitationRestart(state, 240);
  }
  updateRecitationControls();
}

async function handleCoachSilenceTimeout(state) {
  if (session !== state || state.runKind !== 'coach' || state.isCoaching || state.index >= state.facts.length) return;
  state.silencePromptCount += 1;
  const advanceAfter = state.silencePromptCount >= 2;
  if (advanceAfter) state.needsReview.add(`${state.facts[state.index].a}x${state.facts[state.index].b}`);
  await playRecitationCoachPrompt(state, { advanceAfter, reason: 'silence' });
}

async function playRecitationCoachPrompt(state, { advanceAfter, reason }) {
  if (session !== state || state.runKind !== 'coach' || state.isCoaching) return;
  const factIndex = state.index;
  const fact = state.facts[factIndex];
  if (!fact) return;
  if (recitationSilenceTimer !== null) window.clearTimeout(recitationSilenceTimer);
  recitationSilenceTimer = null;
  state.isCoaching = true;
  state.isListening = false;
  state.nativeSessionId = null;
  state.promptCount += 1;
  state.promptedFacts.add(factIndex);
  state.factStates[factIndex] = RECITATION_OUTCOMES.PROMPTED;
  updateRecitationControls();
  setRecitationStatus(
    'prompted',
    advanceAfter ? 'Listen once more' : 'Your coach will help',
    advanceAfter ? 'This chant is marked for review, then the group will continue.' : reason === 'wrong' ? 'Listen to the correct chant, then repeat the same chant.' : 'Listen to the chant, then repeat it.',
    '♫',
    RECITATION_OUTCOMES.PROMPTED
  );

  try { await cancelChantSpeech(); } catch {
    // The native recognizer may already have ended; coaching audio can still continue.
  }
  if (session !== state || state.index !== factIndex) return;

  const finishPrompt = () => {
    if (session !== state || state.index !== factIndex) return;
    state.isCoaching = false;
    if (advanceAfter) {
      state.index += 1;
      resetCurrentRecitationFact(state);
      updateRecitationProgressUI();
      if (state.index >= state.facts.length) return completeRecitationMode();
      setRecitationStatus('review', 'Nice effort — keep going', 'Get ready for the next chant.', '☆', RECITATION_OUTCOMES.PROMPTED);
    } else {
      state.wrongRetryActive = false;
      state.shouldCoachPromptAfterWrong = false;
      setRecitationStatus('prompted', 'Now it’s your turn', 'Repeat the chant you just heard at your own pace.', '♫', RECITATION_OUTCOMES.PROMPTED);
    }
    state.lastActivityAt = Date.now();
    state.coachAttemptStartedAt = Date.now();
    updateRecitationControls();
    scheduleRecitationRestart(state, advanceAfter ? 800 : 500);
  };

  playMultiplicationFact(fact.a, fact.b, { onEnded: finishPrompt, onError: finishPrompt });
}

function completeRecitationMode() {
  const state = session;
  if (!state || state.type !== 'recitation') return childRecitation();
  const mode = state.mode;
  const runKind = state.runKind;
  const fluent = runKind === 'strict'
    && state.fluentEligible
    && state.promptCount === 0
    && state.wrongCount === 0
    && state.maxPauseMs <= FLUENT_PAUSE_LIMIT_MS;
  // Speech recognition supplies practice feedback only. A parent confirms
  // independent recitation separately from the Progress page.
  const previous = progress.recitationResults?.[mode.id] ?? {};
  const patch = {
    recitationResults: {
      ...(progress.recitationResults ?? {}),
      [mode.id]: {
        completed: true,
        coachCompleted: Boolean(previous.coachCompleted || runKind === 'coach'),
        independentCompleted: Boolean(previous.independentCompleted || runKind === 'strict'),
        fluent: Boolean(previous.fluent || fluent),
        mastered: false,
        needsReview: fluent || previous.fluent ? [] : [...state.needsReview],
        maxPauseMs: previous.fluent && !fluent ? previous.maxPauseMs : Math.round(state.maxPauseMs),
        hesitationCount: state.hesitationCount,
        promptCount: state.promptCount,
        wrongCount: state.wrongCount,
      },
    },
  };
  if (mode.groups.length > 1 && mode.progressKey) {
    patch[mode.progressKey] = true;
  }
  save(patch);
  clearRecitationModeTimers();
  void cleanupSpeechSession();
  session = null;
  const needsReviewCount = state.needsReview.size;
  const resultTitle = runKind === 'coach' ? 'Coach Session Complete!' : 'Independent Recitation Complete!';
  const fluentPauseDetail = state.hesitationCount
    ? ` ${state.hesitationCount} pause${state.hesitationCount === 1 ? ' was' : 's were'} between 3 and 5 seconds.`
    : '';
  const resultDetail = runKind === 'coach'
      ? `You completed every chant in ${mode.label}.${needsReviewCount ? ` ${needsReviewCount} chant${needsReviewCount === 1 ? '' : 's'} marked for review.` : ''}`
      : fluent
        ? `You completed every chant in ${mode.label} smoothly.${fluentPauseDetail} Ask a parent to confirm the independent recitation in Progress.`
        : `Every chant was attempted.${needsReviewCount ? ` ${needsReviewCount} chant${needsReviewCount === 1 ? '' : 's'} marked for parent review.` : ''} Ask a parent to listen and confirm the independent recitation in Progress.`;
  shell(
    `<section class="result-screen is-success recitation-result-screen">
      <span>✓</span>
      <h1>${resultTitle}</h1>
      <p>${resultDetail}</p>
      <div class="recitation-result-badges" aria-label="Recitation results">
        <span class="is-earned">Completed</span>
        <span class="${fluent ? 'is-earned' : ''}">Fluent</span>
        <span>Parent Confirms</span>
      </div>
      <strong>${state.facts.length}<small> chants</small></strong>
      <button class="primary big" id="retryRecitationMode" type="button">${runKind === 'strict' ? 'Practise Independent Recitation Again' : 'Practice Again'}</button>
      ${runKind === 'strict' ? '<button class="secondary big" data-route="parent-progress" type="button">Parent Confirmation →</button>' : ''}
      <button class="text-button" data-route="child-recitation">Choose Another Group</button>
    </section>`,
    'child',
    'child',
    { focus: true }
  );
  document.querySelector('#retryRecitationMode').onclick = () => startRecitationMode(mode.id, runKind);
}

async function cleanupSpeechSession() {
  clearRecitationModeTimers();
  if (recitationAdvanceTimer !== null) {
    window.clearTimeout(recitationAdvanceTimer);
    recitationAdvanceTimer = null;
  }
  const handles = chantSpeechListenerHandles;
  chantSpeechListenerHandles = [];
  chantSpeechListenerSetupPromise = null;
  if (isSpeechSession()) {
    if (session.type === 'recitation') stopVoice();
    session.isStarting = false;
    session.isListening = false;
    session.isEvaluating = false;
    session.isAdvancing = false;
  }
  await Promise.allSettled([
    cancelChantSpeech(),
    removeChantSpeechListeners(handles),
  ]);
}

function childHome() {
  const fullVersion = hasFullAccess();
  const trialComplete = testIntroLearningComplete();
  const fullLearningAvailable = fullVersion && (!DEV_TEST_MODE || trialComplete);
  const fullComplete = fullLearningAvailable && fullCourseCompleted();
  const mixedTowerReady = gameUnlocked('mixed');
  const towerStatus = fullLearningAvailable
    ? 'Combined tower challenges'
    : mixedTowerReady
      ? '6+7 tower ready'
      : 'Complete the 6s, 7s, and mixed tests';
  const taskMessage = DEV_TEST_MODE && !trialComplete
    ? 'Start with Groups 6 and 7. The other groups open after both group tests are passed.'
    : fullVersion
      ? 'Continue learning, review completed groups, or enter the tower challenges.'
      : 'Continue the trial path or check your tower challenge.';

  shell(
    `<div class="child-dashboard">
      <div class="child-home-overview">
        ${multiplicationOverview(fullVersion)}
      </div>

      <section class="child-dashboard-actions" data-child-play-hub aria-label="Choose a learning path">
        <div class="child-play-heading">
          <span class="kicker">Current Task</span>
          <h1>What will you practice today?</h1>
          <p>${taskMessage}</p>
        </div>
        <div class="group-grid child-home-route-grid">
          <button class="group-card child-play-card child-play-card-trial" data-route="child-trial">
            <small>${DEV_TEST_MODE && !trialComplete ? 'Complete these groups first' : fullVersion ? 'Included in full learning' : trialComplete ? 'Trial path completed' : 'Continue current progress'}</small>
            <strong>6–7</strong>
            <span>Multiplication groups</span>
            <b>Start with 6–7 →</b>
          </button>

          ${fullLearningAvailable ? `<button class="group-card group-7 child-play-card child-play-card-full" id="childFullPathChoice" type="button" aria-haspopup="dialog">
            <small>${fullComplete ? 'Complete path finished' : 'Full learning path'}</small>
            <strong>1–10</strong>
            <span>Learning</span>
            <b>${fullComplete ? 'Review →' : 'Start learning →'}</b>
          </button>` : ''}

          <button class="group-card tower-route-card child-play-card child-play-card-tower" data-route="child-challenges">
            <small>${towerStatus}</small>
            <strong class="child-tower-art" aria-hidden="true"><img src="/free-multiplication-app/game/assets/castle.webp" alt=""></strong>
            <span>Tower Challenges</span>
            <b>Open challenges →</b>
          </button>
        </div>
        ${fullLearningAvailable ? `<div class="child-path-suggestion" id="childPathSuggestion" hidden>
          <section class="child-path-suggestion-card" role="dialog" aria-modal="true" aria-labelledby="childPathSuggestionTitle">
            <small>Recommended starting point</small>
            <h2 id="childPathSuggestionTitle">Start with Groups 6–7</h2>
            <p>We recommend beginning with Groups 6 and 7 before continuing through the complete 1–10 learning path.</p>
            <div class="child-path-suggestion-actions">
              <button class="primary" data-route="child-trial">Start with 6–7 →</button>
              <button class="secondary" id="continueFullLearning" type="button">Continue 1–10 →</button>
            </div>
          </section>
        </div>` : ''}
      </section>
    </div>`,
    'child',
    'child',
    { homeScreen: true }
  );

  bindOverviewTableAudio();
  bindOverviewVideo();
  const fullPathChoice = document.querySelector('#childFullPathChoice');
  const pathSuggestion = document.querySelector('#childPathSuggestion');
  fullPathChoice?.addEventListener('click', () => {
    pathSuggestion.hidden = false;
    pathSuggestion.querySelector('.primary')?.focus({ preventScroll: true });
  });
  document.querySelector('#continueFullLearning')?.addEventListener('click', () => go('child-full'));
}

function trialChildHome() {
  shell(
    `<div class="selection-landscape-layout trial-selection-layout">
      <section class="selection-groups-panel" aria-label="Available learning groups">
        ${pageHead(
          'Today’s Task',
          'Choose a Group and Start',
          'Tap an available card to begin.'
        )}
        <section class="trial-music-entry" aria-labelledby="trialMusicTitle">
          <div>
            <small>Music Practice</small>
            <h2 id="trialMusicTitle">6–7 Multiplication Chant</h2>
            <p>Watch and sing along with the multiplication music for Groups 6 and 7.</p>
          </div>
          <button class="trial-music-play" id="trialMusicPlay" type="button" aria-label="Play multiplication chant video for groups 6 and 7">
            <span aria-hidden="true">▶</span>
            <strong>Play Video</strong>
          </button>
        </section>
        <div class="video-player-shell" id="trialMusicPlayer" data-video-player data-lock-landscape role="dialog" aria-modal="true" aria-label="6–7 multiplication chant video" hidden>
          <video id="trialMusicVideo" playsinline webkit-playsinline preload="metadata" controlslist="nodownload noplaybackrate noremoteplayback" disablepictureinpicture src="${VIDEO}" aria-label="Multiplication music video for groups 6 and 7"></video>
          ${videoPlayerControlsMarkup()}
        </div>
        <div class="group-grid">
          ${GROUPS.map((group) => {
            const unlocked = groupUnlocked(group);
            const status = groupStatus(group);
            const action = status === 'Test passed'
              ? 'Practice Again →'
              : status === 'Continue practice'
                ? 'Continue →'
                : 'Start →';

            return `
              <button
                class="group-card group-${group}"
                data-route="child-follow-${group}"
                ${unlocked ? '' : 'disabled'}
              >
                <small>${unlocked ? status : 'Pass the 6s test to unlock'}</small>
                <strong>${group}</strong>
                <span>Multiplication Group</span>
                <b>${unlocked ? action : 'Locked'}</b>
              </button>
            `;
          }).join('')}
        </div>
      </section>
    </div>`,
    'child',
    'child'
  );
  const trialMusicPlayer = bindCustomVideoPlayer(document.querySelector('#trialMusicPlayer'), {
    lockLandscape: true,
    tapVideoSurfaceTogglesPlayback: true,
  });
  document.querySelector('#trialMusicPlay')?.addEventListener('click', () => {
    stopVoice();
    void trialMusicPlayer?.open();
  });
}function childLesson(step, group) {
  if (group === 'mixed') return childComplete('mixed');
  const number = Number(group); const list = chantFacts(number);
  if (!groupUnlocked(number) && !fullGroupUnlocked(number)) return childHome();
  if (FOUNDATION_GROUPS.includes(number)) return childFoundationFollow(number, list);
  if (step === 'song') return childFollow(number, list);
  if (step === 'chant') return childFollow(number, list);
  if (step === 'follow') return childFollow(number, list);
  if (step === 'recite') return childRecite(number, list);
  return childComplete(group);
}

function lessonSteps(current, group) {
  const number = Number(group);
  const steps = FOUNDATION_GROUPS.includes(number)
    ? [
        ['follow', 'Read & Repeat', `child-follow-${group}`],
        ['listen-choose', 'Listen & Choose', `listen-choose-${group}`],
      ]
    : [
        ['follow', 'Read & Repeat', `child-follow-${group}`],
        ['recite', IS_NATIVE_IOS ? 'Recite Yourself' : 'Listen & Repeat', `child-recite-${group}`],
        ['test', 'Test', `test-${group}`],
        ['listen-choose', 'Listen & Choose', `listen-choose-${group}`],
      ];

  return `
    <nav class="lesson-steps lesson-steps-${steps.length}" aria-label="Group ${group} learning steps">
      ${steps.map(([key, label, route, unlocked = true], index) => `
        <button
          type="button"
          class="${key === current ? 'active' : ''}"
          data-route="${route}"
          ${unlocked ? '' : 'disabled'}
          ${key === current ? 'aria-current="step"' : ''}
        >
          <b>${index + 1}</b>
          <span${label === 'Read & Repeat' ? ' data-mobile-label="Read"' : ''}${label === 'Recite Yourself' ? ' data-mobile-label="Recite"' : label === 'Listen & Repeat' ? ' data-mobile-label="Repeat"' : ''}${label === 'Listen & Choose' ? ' data-mobile-label="Listen"' : ''}${label === 'Test' ? ' data-mobile-label="Test"' : ''}>${label}</span>
        </button>
      `).join('')}
    </nav>
  `;
}

function childFoundationFollow(group, list) {
  shell(
    `${lessonSteps('follow', group)}
    <div class="child-learning-stage">
      <div class="child-learning-core">
        <div class="lesson-landscape-layout foundation-lesson-layout">
          <section class="lesson-action-panel">
            <button class="group-audio-button" id="playAllGroup" type="button">
              <span aria-hidden="true">▶</span>
              <strong>播放${group}组完整口诀</strong>
            </button>
            <div class="foundation-board" aria-label="${group}组乘法表">
              ${list.map((q, index) => `<button type="button" data-foundation-index="${index}" aria-label="播放 ${q.left} 乘 ${q.right} 等于 ${q.answer}"><span>${q.left} × ${q.right}</span><i>=</i><strong>${q.answer}</strong><small>▶ 点击播放</small></button>`).join('')}
            </div>
          </section>
        </div>
      </div>
    </div>`,
    'child',
    'child',
    { focus: true, shellClass: 'child-learning-shell', pageClass: 'child-learning-page' }
  );
  const buttons = [...document.querySelectorAll('[data-foundation-index]')];
  const groupButton = document.querySelector('#playAllGroup');
  let groupPlaying = false;

  const resetButtons = () => {
    buttons.forEach((button) => {
      button.classList.remove('active');
      button.querySelector('small').textContent = '▶ 点击播放';
    });
  };

  const setGroupButtonPlaying = (playing) => {
    groupPlaying = playing;
    groupButton.classList.toggle('active', playing);
    groupButton.querySelector('span').textContent = playing ? '■' : '▶';
    groupButton.querySelector('strong').textContent = playing
      ? `停止播放${group}组口诀`
      : `播放${group}组完整口诀`;
  };

  buttons.forEach((button) => {
    button.onclick = () => {
      stopVoice();
      setGroupButtonPlaying(false);
      buttons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const fact = list[Number(button.dataset.foundationIndex)];
      playMultiplicationFact(fact.left, fact.right, {
        onEnded: () => button.classList.remove('active'),
        onError: () => button.classList.remove('active'),
      });
    };
  });

  groupButton.onclick = () => {
    if (groupPlaying) {
      stopVoice();
      setGroupButtonPlaying(false);
      resetButtons();
      return;
    }

    stopVoice();
    setGroupButtonPlaying(true);
    buttons[0]?.classList.add('active');

    playGroupFactsSequentially(group, {
      onSentenceStart: (index) => {
        buttons.forEach((button, buttonIndex) => {
          button.classList.toggle('active', buttonIndex === index);
        });
      },
      onEnded: () => {
        setGroupButtonPlaying(false);
        resetButtons();
      },
      onError: () => {
        setGroupButtonPlaying(false);
        resetButtons();
      },
    });
  };
}

function childFollow(group, list) {
  if (FOUNDATION_GROUPS.includes(group)) return childFoundationFollow(group, list);
  let currentIndex = -1;
  let groupPlaying = false;

  shell(
    `${lessonSteps('follow', group)}
    <div class="child-learning-stage has-bottom-cta">
      <div class="child-learning-core">
        <div class="lesson-landscape-layout">
          <section class="lesson-copy-panel">
            ${pageHead(
              `${group}组 · 第1步`,
              '看口诀，跟着声音读',
              '可以播放整组口诀，也可以点击任意口诀单独听。'
            )}

            <button
              class="group-audio-button"
              id="playAllGroup"
              type="button"
            >
              <span aria-hidden="true">▶</span>
              <strong>播放${group}组完整口诀</strong>
            </button>
          </section>

          <section class="lesson-action-panel" aria-label="选择要播放的口诀">
            <div class="chant-board follow-chant-board">
              ${list.map((q, itemIndex) => `
                <button
                  type="button"
                  data-follow-index="${itemIndex}"
                  aria-label="播放 ${q.left} 乘 ${q.right} 等于 ${q.answer}"
                >
                  <span class="fact-line">
                    <span>${q.left}</span>
                    <i>×</i>
                    <span class="group-number">${q.right}</span>
                    <i>=</i>
                    <strong>${q.answer}</strong>
                  </span>

                  <small>
                    <b aria-hidden="true">▶</b>
                    <em>点我播放</em>
                  </small>
                </button>
              `).join('')}
            </div>
          </section>
        </div>
      </div>
      <button
        class="primary big lesson-next child-learning-cta"
        data-route="child-recite-${group}"
      >
        我会跟读了 →
      </button>
    </div>`,
    'child',
    'child',
    { focus: true, shellClass: 'child-learning-shell', pageClass: 'child-learning-page' }
  );

  const cards = [
    ...document.querySelectorAll('[data-follow-index]')
  ];

  const groupButton =
    document.querySelector('#playAllGroup');

  const resetCards = () => {
    cards.forEach((card) => {
      card.classList.remove('active');
      card.querySelector('small b').textContent = '▶';
      card.querySelector('small em').textContent = '点我播放';
    });

    currentIndex = -1;
  };

  const highlightCard = (index) => {
    cards.forEach((card, cardIndex) => {
      const active = cardIndex === index;

      card.classList.toggle('active', active);

      card.querySelector('small b').textContent =
        active ? '●' : '▶';

      card.querySelector('small em').textContent =
        active ? '正在播放' : '点我播放';
    });

    currentIndex = index;

    cards[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  };

  const setGroupButtonPlaying = (playing) => {
    groupPlaying = playing;

    groupButton.classList.toggle('active', playing);

    groupButton.querySelector('span').textContent =
      playing ? '■' : '▶';

    groupButton.querySelector('strong').textContent =
      playing
        ? `停止播放${group}组口诀`
        : `播放${group}组完整口诀`;
  };

  // 单独点击某一句
  cards.forEach((card) => {
    card.onclick = () => {
      stopVoice();

      setGroupButtonPlaying(false);

      const index =
        Number(card.dataset.followIndex);

      highlightCard(index);

      const q = list[index];

      playMultiplicationFact(
        q.left,
        q.right
      );
    };
  });

  // 播放整组口诀
  groupButton.onclick = () => {
    if (groupPlaying) {
      stopVoice();
      setGroupButtonPlaying(false);
      resetCards();
      return;
    }

    stopVoice();

    setGroupButtonPlaying(true);
    highlightCard(0);

    playGroupFactsSequentially(group, {
  onSentenceStart: (index) => {
    highlightCard(index);
  },

  onEnded: () => {
    setGroupButtonPlaying(false);
    resetCards();
  },

  onError: () => {
    setGroupButtonPlaying(false);
    resetCards();
  }
});


  };
}

function childRecite(group, list) {
  if (!IS_NATIVE_IOS) return startWebFollowAlong(list, group);
  if (FOUNDATION_GROUPS.includes(group)) return childFoundationFollow(group, list);
  const mode = getRecitationMode(`group-${group}`);
  const speechFacts = getRecitationFacts(mode);
  session = {
    type: 'spoken-answer',
    group,
    mode,
    questions: list.map((question, index) => ({
      ...question,
      key: `${question.left}x${question.right}`,
      speechFact: speechFacts[index],
    })),
    revealed: new Set(),
    reviewed: new Set(),
    attemptCounts: new Map(),
    queue: [],
    currentIndex: -1,
    currentQuestionId: '',
    nativeSessionId: null,
    candidateHistory: [],
    turn: 0,
    isStarting: false,
    isListening: false,
    isEvaluating: false,
    isAdvancing: false,
    isPrompting: false,
    heardSpeechThisTurn: false,
    completedRound: false,
  };
  renderSpokenAnswerPage();
}

function spokenAnswerIsPassed(question) {
  return progress.spokenAnswerPassed?.[question.key] === true;
}

function unpassedSpokenAnswerQueue(state) {
  return state.questions
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => !spokenAnswerIsPassed(question) && !state.reviewed.has(question.key))
    .map(({ index }) => index);
}

function spokenChantIsComplete(state, question) {
  return spokenAnswerIsPassed(question) || state.reviewed.has(question.key);
}

function findMatchingSpokenChant(candidates, expectedFact) {
  const evaluation = evaluateRecitationCandidates(candidates, [expectedFact], 0);
  return evaluation.matchedCount >= 1 ? evaluation : null;
}

function renderSpokenAnswerPage() {
  const state = session;
  if (!state || state.type !== 'spoken-answer') return childHome();
  const allComplete = state.questions.every((question) => spokenChantIsComplete(state, question));
  const cards = state.questions.map((question, index) => {
    const passed = spokenAnswerIsPassed(question);
    const reviewed = state.reviewed.has(question.key);
    const revealed = state.revealed.has(question.key);
    const answer = passed || reviewed || revealed ? question.answer : '?';
    const detail = passed ? 'Follow-along complete' : reviewed ? 'Practised · parent check' : revealed ? 'Chant replayed' : 'Tap to hear the chant';
    return `<button class="spoken-answer-card${passed ? ' is-passed' : ''}${reviewed ? ' is-reviewed' : ''}" type="button" data-spoken-index="${index}" data-spoken-key="${question.key}" aria-label="${question.left} times ${question.right}${passed ? ` follow-along completed with answer ${question.answer}` : reviewed ? ` practised with answer ${question.answer}` : ', tap to hear the chant'}">
      <span>${question.left} × ${question.right} =</span>
      <strong><em>${answer}</em>${passed ? '<i aria-hidden="true">★</i>' : ''}</strong>
      <small>${detail}</small>
    </button>`;
  }).join('');

  shell(`${lessonSteps('recite', state.group)}<div class="child-learning-stage has-bottom-cta">
    <div class="child-learning-core">
      <div class="lesson-landscape-layout spoken-answer-layout">
        <section class="lesson-copy-panel spoken-answer-copy">
          ${pageHead(`Group ${state.group} · Step 2`, 'Listen, Then Repeat', 'Hear one complete chant, then repeat the same three numbers at your own pace.')}
          <div class="spoken-answer-test-controls">
            <button class="primary big lesson-next" id="startSpokenAnswerTest" type="button" ${allComplete ? 'disabled' : ''}>${allComplete ? 'Practice Complete' : 'Start Follow-Along'}</button>
            <button class="text-button" id="stopSpokenAnswerTest" type="button" disabled>Pause</button>
            <button class="text-button" id="resetSpokenAnswerActivity" type="button" aria-label="Reset this follow-along activity and clear its stars">Reset</button>
          </div>
          <div class="spoken-answer-status" id="spokenAnswerStatus" data-state="${allComplete ? 'correct' : 'ready'}" role="status" aria-live="polite" aria-atomic="true">
            <span aria-hidden="true">${allComplete ? '★' : '●'}</span>
            <div><strong>${allComplete ? 'Follow-along complete!' : 'Ready to listen and repeat'}</strong><small>${allComplete ? 'Every chant was repeated or saved for a parent to check.' : 'The microphone opens as soon as each chant ends.'}</small></div>
          </div>
        </section>
        <section class="lesson-action-panel"><div class="recite-grid spoken-answer-grid">${cards}</div></section>
      </div>
    </div>
    <button class="${allComplete ? 'primary' : 'secondary'} big lesson-next spoken-answer-continue" data-route="test-${state.group}" type="button">I Practised the Chants — Start the Test →</button>
  </div>
  `, 'child', 'child', { focus: true, shellClass: 'child-learning-shell', pageClass: 'child-learning-page' });

  document.querySelector('#startSpokenAnswerTest')?.addEventListener('click', () => void startSpokenAnswerTest());
  document.querySelector('#stopSpokenAnswerTest')?.addEventListener('click', () => void stopCurrentSpokenAnswerListening());
  document.querySelector('#resetSpokenAnswerActivity')?.addEventListener('click', () => void resetSpokenAnswerActivity());
  document.querySelectorAll('[data-spoken-index]').forEach((button) => {
    button.addEventListener('click', () => revealSpokenAnswer(Number(button.dataset.spokenIndex)));
  });
  void refreshSpokenAnswerAvailability();
}

async function resetSpokenAnswerActivity() {
  const state = session;
  if (!state || state.type !== 'spoken-answer') return;
  const group = state.group;
  await cleanupSpeechSession();
  if (session !== state) return;
  const spokenAnswerPassed = { ...(progress.spokenAnswerPassed ?? {}) };
  state.questions.forEach((question) => { delete spokenAnswerPassed[question.key]; });
  save({ spokenAnswerPassed });
  session = null;
  childRecite(group, chantFacts(group));
}

function revealSpokenAnswer(index) {
  const state = session;
  if (!state || state.type !== 'spoken-answer') return;
  const question = state.questions[index];
  if (!question) return;
  state.revealed.add(question.key);
  updateSpokenAnswerCard(question);
  playMultiplicationFact(question.left, question.right);
}

function updateSpokenAnswerCard(question) {
  const state = session;
  if (!state || state.type !== 'spoken-answer') return;
  const card = document.querySelector(`[data-spoken-key="${question.key}"]`);
  if (!card) return;
  const passed = spokenAnswerIsPassed(question);
  const reviewed = state.reviewed.has(question.key);
  const revealed = state.revealed.has(question.key);
  const answer = passed || reviewed || revealed ? question.answer : '?';
  card.classList.toggle('is-passed', passed);
  card.classList.toggle('is-reviewed', reviewed);
  card.querySelector('strong').innerHTML = `<em>${answer}</em>${passed ? '<i aria-hidden="true">★</i>' : ''}`;
  card.querySelector('small').textContent = passed ? 'Follow-along complete' : reviewed ? 'Practised · parent check' : revealed ? 'Chant replayed' : 'Tap to hear the chant';
  card.setAttribute('aria-label', `${question.left} times ${question.right}${passed ? ` follow-along completed with answer ${question.answer}` : reviewed ? ` practised with answer ${question.answer}` : ', tap to hear the chant'}`);
}

function setSpokenAnswerStatus(stateName, title, detail, icon = '●') {
  const status = document.querySelector('#spokenAnswerStatus');
  if (!status) return;
  status.dataset.state = stateName;
  status.querySelector(':scope > span').textContent = icon;
  status.querySelector('strong').textContent = title;
  status.querySelector('small').textContent = detail;
}

function setActiveSpokenAnswerCard(question, stateName = '') {
  document.querySelectorAll('[data-spoken-key]').forEach((card) => {
    card.classList.remove('is-active', 'is-correct', 'is-wrong');
  });
  if (!question) return;
  const card = document.querySelector(`[data-spoken-key="${question.key}"]`);
  if (!card) return;
  card.classList.add('is-active');
  if (stateName) card.classList.add(stateName);
  card.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
}

function updateSpokenAnswerControls() {
  const state = session;
  if (!state || state.type !== 'spoken-answer') return;
  const remaining = state.questions.filter((question) => !spokenChantIsComplete(state, question));
  const busy = state.isStarting || state.isPrompting || state.isListening || state.isEvaluating || state.isAdvancing;
  const startButton = document.querySelector('#startSpokenAnswerTest');
  const stopButton = document.querySelector('#stopSpokenAnswerTest');
  if (startButton) {
    startButton.disabled = busy || remaining.length === 0;
    startButton.textContent = remaining.length === 0
      ? 'Practice Complete'
      : state.completedRound
        ? 'Practise Again'
        : 'Start Follow-Along';
  }
  const continueButton = document.querySelector('.spoken-answer-continue');
  if (continueButton) {
    continueButton.classList.toggle('primary', remaining.length === 0);
    continueButton.classList.toggle('secondary', remaining.length !== 0);
  }
  if (stopButton) stopButton.disabled = !state.isListening || state.isEvaluating || state.isAdvancing;
}

async function refreshSpokenAnswerAvailability() {
  const state = session;
  if (!state || state.type !== 'spoken-answer') return;
  const availability = await getChantSpeechAvailability();
  if (session !== state) return;
  const startButton = document.querySelector('#startSpokenAnswerTest');

  if (!availability.native) {
    if (startButton) startButton.disabled = true;
    setSpokenAnswerStatus('unavailable', 'Voice follow-along needs the app', 'Open this activity in the iPhone/iPad app.', '!');
    return;
  }

  const denied = ['denied', 'restricted'].includes(availability.speechPermission)
    || ['denied', 'restricted'].includes(availability.microphonePermission);
  if (denied) {
    if (startButton) startButton.disabled = true;
    setSpokenAnswerStatus('unavailable', 'Microphone access is needed', 'Enable Speech Recognition and Microphone access in iOS Settings.', '!');
    return;
  }
  updateSpokenAnswerControls();
}

async function startSpokenAnswerTest() {
  const state = session;
  if (!state || state.type !== 'spoken-answer' || state.isStarting || state.isListening || state.isEvaluating || state.isAdvancing) return;
  state.queue = unpassedSpokenAnswerQueue(state);
  if (!state.queue.length) {
    setSpokenAnswerStatus('correct', 'Follow-along complete!', 'Every chant was repeated or saved for a parent to check.', '★');
    updateSpokenAnswerControls();
    return;
  }
  state.completedRound = false;
  state.currentIndex = state.queue[0];
  await beginSpokenAnswerListening(true);
}

async function beginSpokenAnswerListening(requestPermissions) {
  const state = session;
  if (!state || state.type !== 'spoken-answer' || state.currentIndex < 0 || state.isStarting || state.isListening || state.isEvaluating || state.isAdvancing) return;
  const question = state.questions[state.currentIndex];
  if (!question) return;
  state.turn += 1;
  const questionId = `spoken-answer:${state.group}:${question.key}:${state.turn}`;
  state.currentQuestionId = questionId;
  state.nativeSessionId = null;
  state.candidateHistory = [];
  state.heardSpeechThisTurn = false;
  state.isStarting = true;
  state.isPrompting = false;
  setActiveSpokenAnswerCard(question);
  setSpokenAnswerStatus('listening', 'Getting ready…', 'The chant will play first. Listen, then repeat it.');
  updateSpokenAnswerControls();
  stopVoice();

  try {
    const availability = await getChantSpeechAvailability();
    if (!availability.native) throw Object.assign(new Error('Voice follow-along needs the iPhone/iPad app.'), { code: 'native_speech_unavailable' });

    if (requestPermissions) {
      const permissions = await requestChantSpeechPermissions();
      if (permissions.speechPermission !== 'authorized' || permissions.microphonePermission !== 'authorized') {
        throw Object.assign(new Error('Speech Recognition and Microphone access are required.'), { code: 'permission_denied' });
      }
    }

    if (session !== state || state.currentQuestionId !== questionId) {
      await cancelChantSpeech();
      return;
    }

    await ensureChantSpeechListeners();
    state.isPrompting = true;
    setSpokenAnswerStatus('prompted', 'Listen first', 'When the chant finishes, repeat the same three numbers.', '♫');
    updateSpokenAnswerControls();
    const startAfterPrompt = () => {
      if (session !== state || state.currentQuestionId !== questionId || !state.isStarting) return;
      state.isPrompting = false;
      void startSpokenChantRecognition(state, question, questionId);
    };
    playMultiplicationFact(question.left, question.right, {
      onEnded: startAfterPrompt,
      onError: startAfterPrompt,
    });
  } catch (error) {
    if (session !== state || state.currentQuestionId !== questionId) return;
    state.isStarting = false;
    state.isPrompting = false;
    state.isListening = false;
    const permissionError = error?.code === 'permission_denied' || /permission|authorized/i.test(error?.message ?? '');
    setSpokenAnswerStatus(
      'retry',
      permissionError ? 'Microphone access is needed' : 'Unable to start the voice test',
      permissionError ? 'Enable Speech Recognition and Microphone access in iOS Settings.' : 'Tap Start Test to try again.',
      '!'
    );
    setActiveSpokenAnswerCard(null);
    updateSpokenAnswerControls();
  }
}

async function startSpokenChantRecognition(state, question, questionId) {
  try {
    const chant = question.speechFact?.chant ?? '';
    const contextualStrings = [
      chant,
      ...buildContextualStrings(state.mode, question.speechFact),
    ].filter((value, index, values) => value && values.indexOf(value) === index);
    const started = await startChantSpeech({
      questionId,
      contextualStrings,
      localTemplatePath: multiplicationFactAudioPath(question.left, question.right),
      silenceDuration: FOLLOW_ALONG_SPEECH_END_SILENCE_SECONDS,
      initialSilenceDuration: FOLLOW_ALONG_NO_SPEECH_TIMEOUT_SECONDS,
      initialSilenceRequiresRecognition: true,
      silenceRequiresRecognitionActivity: true,
      finalResultWaitDuration: FOLLOW_ALONG_FINAL_RESULT_WAIT_SECONDS,
    });

    if (session !== state || state.currentQuestionId !== questionId) {
      await cancelChantSpeech();
      return;
    }

    state.nativeSessionId = started.sessionId ?? null;
    state.isStarting = false;
    state.isListening = true;
    setSpokenAnswerStatus('listening', 'Your turn', 'Repeat the whole chant at your own pace, then pause.', '●');
    updateSpokenAnswerControls();
  } catch (error) {
    if (session !== state || state.currentQuestionId !== questionId) return;
    state.isStarting = false;
    state.isPrompting = false;
    state.isListening = false;
    const permissionError = error?.code === 'permission_denied' || /permission|authorized/i.test(error?.message ?? '');
    setSpokenAnswerStatus(
      'retry',
      permissionError ? 'Microphone access is needed' : 'Unable to start listening',
      permissionError ? 'Enable Speech Recognition and Microphone access in iOS Settings.' : 'Tap Start Follow-Along to try again.',
      '!'
    );
    setActiveSpokenAnswerCard(null);
    updateSpokenAnswerControls();
  }
}

async function stopCurrentSpokenAnswerListening() {
  const state = session;
  if (!state || state.type !== 'spoken-answer' || !state.isListening || state.isEvaluating || state.isAdvancing) return;
  state.isEvaluating = true;
  setSpokenAnswerStatus('listening', 'Checking the chant…', 'Please wait for the final voice result.');
  updateSpokenAnswerControls();
  try {
    await stopChantSpeech();
  } catch {
    state.isEvaluating = false;
    state.isListening = false;
    setSpokenAnswerStatus('retry', 'Voice test paused', 'Tap Start Test to continue.', '!');
    setActiveSpokenAnswerCard(null);
    updateSpokenAnswerControls();
  }
}

function handleSpokenAnswerPartialResult(payload) {
  const state = session;
  if (!state || state.type !== 'spoken-answer' || payload?.questionId !== state.currentQuestionId || !state.isListening || state.isEvaluating || state.isAdvancing) return;
  state.candidateHistory = mergeSpeechCandidateHistory(state.candidateHistory, recitationCandidates(payload));
  if (state.candidateHistory.length) state.heardSpeechThisTurn = true;
  if (!state.heardSpeechThisTurn) setSpokenAnswerStatus('listening', 'Your turn', 'Repeat the whole chant, then pause.');
  const question = state.questions[state.currentIndex];
  if (!question || !findMatchingSpokenChant(state.candidateHistory, question.speechFact)) return;
  // A complete three-number chant in any stable partial candidate is enough.
  // A later Apple rewrite must not erase a child-friendly successful match.
  void cancelChantSpeech().catch(() => {});
  handleSpokenAnswerFinalResult({
    ...payload,
    candidates: state.candidateHistory,
    transcript: payload?.transcript ?? state.candidateHistory.at(-1) ?? '',
  });
}

function handleSpokenAnswerActivity(payload) {
  const state = session;
  if (!state || state.type !== 'spoken-answer' || payload?.questionId !== state.currentQuestionId || !state.isListening || state.isAdvancing) return;
  if (payload?.source === 'processing') {
    state.isEvaluating = true;
    setSpokenAnswerStatus('listening', 'Checking what you said…', 'Your chant is finished. Wait for the result.', '…');
    updateSpokenAnswerControls();
    return;
  }
  if (payload?.source === 'recognition' && !state.heardSpeechThisTurn) {
    state.heardSpeechThisTurn = true;
    setSpokenAnswerStatus('listening', 'I can hear you', 'Finish the whole chant, then pause.', '◉');
  }
}

function completeSpokenChantGroup(state) {
  const completedCount = state.questions.filter(spokenAnswerIsPassed).length;
  const reviewCount = state.questions.filter((question) => state.reviewed.has(question.key)).length;
  state.currentIndex = -1;
  state.currentQuestionId = '';
  state.completedRound = true;
  setActiveSpokenAnswerCard(null);
  setSpokenAnswerStatus(
    'correct',
    'Follow-along complete!',
    reviewCount
      ? `${completedCount} completed · ${reviewCount} saved for a parent to check.`
      : 'Every chant was repeated. Great work!',
    '★'
  );
  updateSpokenAnswerControls();
}

function handleSpokenAnswerFinalResult(payload) {
  const state = session;
  if (!state || state.type !== 'spoken-answer' || payload?.questionId !== state.currentQuestionId || state.isAdvancing) return;
  const question = state.questions[state.currentIndex];
  if (!question) return;
  const finalCandidates = recitationCandidates(payload);
  state.candidateHistory = mergeSpeechCandidateHistory(state.candidateHistory, finalCandidates);
  const finalMatch = findMatchingSpokenChant(finalCandidates, question.speechFact);
  // Follow-along is intentionally forgiving: if Apple heard the complete
  // three-number chant once, a later rewrite does not erase that success.
  const historyMatch = findMatchingSpokenChant(state.candidateHistory, question.speechFact);
  const exactMatch = historyMatch ?? finalMatch ?? null;
  const followedPrompt = Boolean(exactMatch) || isForgivingFollowAlongAttempt({
    candidates: state.candidateHistory,
    heardRecognition: state.heardSpeechThisTurn,
    localTemplateMatched: payload?.localTemplateMatched,
    localTemplateScore: payload?.localTemplateScore,
    localSpokenDuration: payload?.localSpokenDuration ?? payload?.speechDuration,
  });
  state.isStarting = false;
  state.isPrompting = false;
  state.isListening = false;
  state.isEvaluating = false;
  state.isAdvancing = true;
  state.nativeSessionId = null;
  if (state.queue[0] === state.currentIndex) state.queue.shift();

  if (followedPrompt) {
    const spokenAnswerPassed = { ...progress.spokenAnswerPassed, [question.key]: true };
    save({ spokenAnswerPassed });
    state.attemptCounts.delete(question.key);
    updateSpokenAnswerCard(question);
    setActiveSpokenAnswerCard(question, 'is-correct');
    setSpokenAnswerStatus(
      'correct',
      'Great repeating!',
      exactMatch ? 'I heard the whole chant. Moving to the next one.' : 'I heard you follow the chant. Moving to the next one.',
      '★'
    );
  } else {
    const attemptCount = (state.attemptCounts.get(question.key) ?? 0) + 1;
    state.attemptCounts.set(question.key, attemptCount);
    if (attemptCount < 2) {
      state.queue.unshift(state.currentIndex);
      setActiveSpokenAnswerCard(question);
      setSpokenAnswerStatus('uncertain', 'Let’s repeat it once more', 'Listen again, then say the same three numbers at your own pace.', '↻');
    } else {
      state.reviewed.add(question.key);
      updateSpokenAnswerCard(question);
      setActiveSpokenAnswerCard(question);
      setSpokenAnswerStatus('review', 'Nice practice — keep going', 'This chant is saved for a parent to check. It will not hold you back.', '☆');
    }
  }
  updateSpokenAnswerControls();

  const advanceDelay = followedPrompt
    ? 550
    : state.heardSpeechThisTurn
      ? 650
      : 250;

  if (recitationAdvanceTimer !== null) window.clearTimeout(recitationAdvanceTimer);
  recitationAdvanceTimer = window.setTimeout(() => {
    recitationAdvanceTimer = null;
    if (session !== state || state.type !== 'spoken-answer') return;
    state.isAdvancing = false;
    if (!state.queue.length) {
      completeSpokenChantGroup(state);
      return;
    }
    state.currentIndex = state.queue[0];
    void beginSpokenAnswerListening(false);
  }, advanceDelay);
}

function handleSpokenAnswerSpeechError(payload) {
  const state = session;
  if (!state || state.type !== 'spoken-answer' || (payload?.questionId && payload.questionId !== state.currentQuestionId) || state.isAdvancing) return;
  if (payload?.code === 'no_final_result' || payload?.code === 'no_speech') {
    handleSpokenAnswerFinalResult({
      ...payload,
      candidates: state.candidateHistory,
      transcript: state.candidateHistory.at(-1) ?? '',
    });
    return;
  }
  state.isStarting = false;
  state.isPrompting = false;
  state.isListening = false;
  state.isEvaluating = false;
  state.queue = [];
  state.currentIndex = -1;
  state.completedRound = true;
  const permissionError = payload?.code === 'permission_denied';
  const noSpeechError = payload?.code === 'no_speech';
  setActiveSpokenAnswerCard(null);
  setSpokenAnswerStatus(
    noSpeechError ? 'uncertain' : 'retry',
    permissionError ? 'Microphone access is needed' : noSpeechError ? 'I’m ready when you are' : 'Voice practice paused',
    permissionError ? 'Enable Speech Recognition and Microphone access in iOS Settings.' : noSpeechError ? 'Nothing was scored. Tap Try Again when you are ready.' : 'Tap Try Again to continue.',
    noSpeechError ? '○' : '!'
  );
  updateSpokenAnswerControls();
}

function choices(answer, group, multiplier) {
  return shuffle(multiplicationChoiceOptions(answer, group, multiplier));
}
function listenChooseChoices(answer, group, multiplier) {
  return choices(answer, group, multiplier);
}
function resetAssessmentSession() {
  stopVoice();
  session = null;
}
function startTest(scope) {
  resetAssessmentSession();
  if (FOUNDATION_GROUPS.includes(Number(scope))) return fullChildHome();
  if (scope !== 'mixed' && !testUnlocked(scope)) return childPractice();
  if (scope === 'mixed' && !DEV_FULL_ACCESS && !(progress.test6 && progress.test7)) return childPractice();
  const mixed = scope === 'mixed';
  const questions = mixed
    ? shuffle([...practiceFacts(6), ...practiceFacts(7)])
    : shuffle(practiceFacts(Number(scope)));
  session = { type: 'test', scope, questions, index: 0, correct: 0, mastered: new Set(), answered: false, sawCommutativeHint: false }; renderTest();
}
function renderTest() {
  const s = session; const q = s.questions[s.index]; const total = s.questions.length;
  const needsOrderHint = !progress.commutativeHintSeen && !s.sawCommutativeHint && q.left > q.right;
  const orderHint = needsOrderHint ? `<div class="order-hint" role="dialog" aria-modal="true" aria-labelledby="orderHintTitle"><div class="order-hint-card"><small>记住这个规则</small><div class="order-hint-equations"><strong>${q.right} × ${q.left} = ${q.answer}</strong><span aria-hidden="true">↕</span><strong>${q.left} × ${q.right} = ${q.answer}</strong></div><div class="order-swap" aria-hidden="true"><b>${q.right}</b><i>↔</i><b>${q.left}</b></div><h2 id="orderHintTitle">两个因数交换位置，<br>答案仍然相同。</h2><p>口诀只记一个方向，交换两个因数后答案不变。</p><button class="primary" id="dismissOrderHint">明白了，继续 →</button></div></div>` : '';
  const stepNavigation = s.scope === 'mixed' ? '' : lessonSteps('test', s.scope);
  const questionGroup = Math.min(q.left, q.right);
  const questionMultiplier = Math.max(q.left, q.right);
  shell(`${stepNavigation}<section class="child-learning-stage"><section class="quiz-page"><div class="quiz-meta"><div class="quiz-top"><span class="quiz-title">${s.scope === 'mixed' ? '6 + 7混合测试' : `${s.scope}组测试`}</span><b>${s.index + 1} / ${total}</b></div><div class="quiz-progress" role="progressbar" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${s.index + 1}"><span style="width:${((s.index + 1) / total) * 100}%"></span></div></div><div class="child-learning-core"><article class="quiz-card" aria-labelledby="quizQuestion"><div class="quiz-prompt"><small>轮到你了</small><h1 id="quizQuestion">${q.left} × ${q.right} = ?</h1></div><div class="quiz-response"><div class="choice-grid">${choices(q.answer, questionGroup, questionMultiplier).map((answer) => `<button data-choice="${answer}">${answer}</button>`).join('')}</div><div id="feedback" class="feedback" role="status" aria-live="polite" aria-atomic="true"></div></div></article></div><div class="child-learning-cta quiz-page-cta" id="quizPageCta"></div>${orderHint}</section></section>`, 'child', 'child-practice', { focus: true, shellClass: 'child-learning-shell', pageClass: 'child-learning-page' });
  if (needsOrderHint) document.querySelector('#dismissOrderHint').onclick = () => { s.sawCommutativeHint = true; document.querySelector('.order-hint').remove(); };
  document.querySelectorAll('[data-choice]').forEach((button) => button.onclick = () => answerTest(Number(button.dataset.choice)));
}
function answerTest(answer) {
  const s = session; if (s.answered) return; s.answered = true; const q = s.questions[s.index]; const correct = answer === q.answer;
  if (correct) { s.correct += 1; s.mastered.add(`${q.left}×${q.right}`); }
  document.querySelectorAll('[data-choice]').forEach((button) => { button.disabled = true; if (Number(button.dataset.choice) === q.answer) button.classList.add('correct'); else if (Number(button.dataset.choice) === answer) button.classList.add('wrong'); });
  const quizCard = document.querySelector('.quiz-card');
  quizCard.classList.add(correct ? 'is-correct' : 'is-wrong');
  quizCard.querySelector('.quiz-response').classList.add('has-feedback');
  document.querySelector('#feedback').innerHTML = `<div class="feedback-summary"><span class="feedback-icon" aria-hidden="true">${correct ? '✓' : '!'}</span><div><strong class="${correct ? 'feedback-correct' : 'feedback-wrong'}">${correct ? '答对了！' : '再记一次'}</strong><span class="feedback-answer${correct ? '' : ' highlighted'}">${q.left} × ${q.right} = <b>${q.answer}</b></span></div></div>`;
  document.querySelector('#quizPageCta').innerHTML = `<div class="feedback-actions"><button class="secondary" id="hear">再听一次</button><button class="primary" id="nextQuestion">${s.index + 1 === s.questions.length ? '查看结果' : '下一题 →'}</button></div>`;
  document.querySelector('#hear').onclick = () => playMultiplicationFact(q.left, q.right);
  document.querySelector('#nextQuestion').onclick = () => { stopVoice(); s.index += 1; s.answered = false; s.index < s.questions.length ? renderTest() : finishTest(); };
  playMultiplicationFact(q.left, q.right);
}

function startListenChoose(scope) {
  resetAssessmentSession();
  const group = Number(scope);
  if (!testUnlocked(group)) return childHome();
  if (!FULL_LEARNING_GROUPS.includes(group)) return childHome();
  const questions = shuffle(chantFacts(group));
  session = { type: 'listen-choose', scope: group, questions, index: 0, correct: 0, answered: false, started: false };
  renderListenChoose();
}

function renderListenChoose() {
  const s = session;
  if (!s.started) {
    shell(`${lessonSteps('listen-choose', s.scope)}<section class="child-learning-stage has-bottom-cta"><section class="listen-choose-page quiz-page listen-choose-intro"><div class="child-learning-core"><article class="quiz-card listen-choose-start"><div class="quiz-prompt"><small>Listen and choose</small><h1>Ready to listen?</h1><p>Hear the first two numbers, then choose the answer.</p></div></article></div></section><button class="primary big child-learning-cta" id="startListenChoose">Start Test</button></section>`, 'child', 'child', { focus: true, shellClass: 'child-learning-shell', pageClass: 'child-learning-page' });
    document.querySelector('#startListenChoose').onclick = () => {
      s.started = true;
      s.index = 0;
      renderListenChoose();
    };
    return;
  }
  const q = s.questions[s.index];
  const total = s.questions.length;
  const questionMultiplier = q.left === Number(s.scope) ? q.right : q.left;
  shell(`${lessonSteps('listen-choose', s.scope)}<section class="child-learning-stage"><section class="listen-choose-page quiz-page"><div class="quiz-meta"><div class="quiz-top"><span class="quiz-title">${s.scope}s Listen &amp; Choose</span><b>${s.index + 1} / ${total}</b></div><div class="quiz-progress" role="progressbar" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${s.index + 1}"><span style="width:${((s.index + 1) / total) * 100}%"></span></div></div><div class="child-learning-core"><article class="quiz-card"><div class="quiz-prompt"><small>Listen and choose</small><button class="group-audio-button prompt-audio-button" id="replayPrompt" type="button"><span aria-hidden="true">▶</span><strong>Hear the Question</strong></button></div><div class="quiz-response"><div class="choice-grid">${listenChooseChoices(q.answer, s.scope, questionMultiplier).map((answer) => `<button data-listen-choice="${answer}">${answer}</button>`).join('')}</div><div id="feedback" class="feedback" role="status" aria-live="polite" aria-atomic="true"></div></div></article></div><div class="child-learning-cta quiz-page-cta" id="quizPageCta"></div></section></section>`, 'child', 'child', { focus: true, shellClass: 'child-learning-shell', pageClass: 'child-learning-page' });
  document.querySelector('#replayPrompt').onclick = () => playListenChoosePrompt(q.left, q.right);
  document.querySelectorAll('[data-listen-choice]').forEach((button) => button.onclick = () => answerListenChoose(Number(button.dataset.listenChoice)));
  playListenChoosePrompt(q.left, q.right);
}

function answerListenChoose(answer) {
  const s = session;
  if (s?.type !== 'listen-choose' || s.answered) return;
  s.answered = true;
  const q = s.questions[s.index];
  const correct = answer === q.answer;
  if (correct) s.correct += 1;
  document.querySelectorAll('[data-listen-choice]').forEach((button) => {
    button.disabled = true;
    if (Number(button.dataset.listenChoice) === q.answer) button.classList.add('correct');
    else if (Number(button.dataset.listenChoice) === answer) button.classList.add('wrong');
  });
  const quizCard = document.querySelector('.quiz-card');
  quizCard.classList.add(correct ? 'is-correct' : 'is-wrong');
  quizCard.querySelector('.quiz-response').classList.add('has-feedback');
  document.querySelector('#feedback').innerHTML = `<div class="feedback-summary"><span class="feedback-icon" aria-hidden="true">${correct ? '✓' : '×'}</span><div><strong class="${correct ? 'feedback-correct' : 'feedback-wrong'}">${correct ? '答对了！' : '再听一次'}</strong><span class="feedback-answer highlighted">${q.right} × ${q.left} = <b>${q.answer}</b></span></div></div>`;
  document.querySelector('#quizPageCta').innerHTML = `<div class="feedback-actions"><button class="primary" id="nextListenChoice">${s.index + 1 === s.questions.length ? '完成' : '下一题 →'}</button></div>`;
  document.querySelector('#nextListenChoice').onclick = () => {
    stopVoice();
    s.index += 1;
    s.answered = false;
    s.index < s.questions.length ? renderListenChoose() : finishListenChoose();
  };
  playMultiplicationFact(q.left, q.right);
}

function finishListenChoose() {
  const s = session;
  const total = s.questions.length;
  const mistakes = total - s.correct;
  const passed = mistakes <= 1;
  const coreGroup = s.scope >= 2 && s.scope <= 9;
  const actionRoute = passed
    ? coreGroup ? `parent-recitation-check-group-${s.scope}` : 'child-full'
    : `listen-choose-${s.scope}`;
  const actionLabel = passed
    ? coreGroup ? `Ask a Parent for the ${s.scope}s Final Check →` : 'Return to Full Learning →'
    : 'Restart Listen & Choose →';
  const resultTitle = passed
    ? coreGroup ? `Congratulations! You completed the ${s.scope}s learning steps!` : 'Congratulations! Listen & Choose Passed!'
    : 'What a pity. Keep trying!';
  const resultMessage = passed
    ? coreGroup
      ? `Now ask a parent to evaluate the ${s.scope}s independent recitation. The App will provide the parent with the standard audio and written reference.`
      : `You completed the ${s.scope}s foundation practice.`
    : 'You may restart Listen & Choose and try again.';
  session = null;
  shell(`<section class="child-learning-stage has-bottom-cta"><div class="child-learning-core"><section class="result-screen ${passed ? 'is-success' : 'is-retry'}"><span>${passed ? '★' : '↻'}</span><h1>${resultTitle}</h1><p>${resultMessage}</p><strong>${s.correct}<small>/ ${total}</small></strong><div class="result-metrics"><small>Incorrect ${mistakes} / ${total}</small><small>Accuracy ${Math.round((s.correct / total) * 100)}%</small></div></section></div><button class="primary big child-learning-cta" data-route="${actionRoute}">${actionLabel}</button></section>`, 'child', 'child', { focus: true, shellClass: 'child-learning-shell', pageClass: 'child-learning-page' });
}

function finishTest() {
  const s = session;
  const total = s.questions.length;
  const mistakes = total - s.correct;
  const accuracy = Math.round((s.correct / total) * 100);
  const passed = mistakes <= 1;

  if (s.scope === 'mixed') {
    save({
      mixedAttempted: true,
      mixedAccuracy: getBestAccuracy(progress.mixedAccuracy, accuracy),
      commutativeHintSeen: progress.commutativeHintSeen || s.sawCommutativeHint,
      ...(passed ? { mixedTest: true } : {})
    });
  } else {
    save({
      [`attempted${s.scope}`]: true,
      [`lastAccuracy${s.scope}`]: getBestAccuracy(progress[`lastAccuracy${s.scope}`], accuracy),
      [`mastered${s.scope}`]: s.mastered.size,
      commutativeHintSeen: progress.commutativeHintSeen || s.sawCommutativeHint,
      ...(passed ? { [`test${s.scope}`]: true } : {})
    });
  }

  let next;
  let nextLabel;
  const group = Number(s.scope);

  if (!passed) {
    next = s.scope === 'mixed' ? 'test-mixed' : `child-follow-${s.scope}`;
    nextLabel = s.scope === 'mixed' ? 'Retry the Mixed Test →' : 'Return to Chant Practice →';
  } else if (s.scope === 'mixed') {
    next = 'game-mixed';
    nextLabel = 'Enter the 6+7 Combined Tower →';
  } else if (FOUNDATION_GROUPS.includes(group)) {
    next = 'child-full';
    nextLabel = 'Return to Full Learning →';
  } else if (group >= 2 && group <= 9) {
    next = `listen-choose-${group}`;
    nextLabel = 'I Passed the Test — Start Listen & Choose →';
  } else {
    next = 'child';
    nextLabel = 'Return to Child Home →';
  }

  session = null;
  shell(`<section class="child-learning-stage has-bottom-cta"><div class="child-learning-core"><section class="result-screen ${passed ? 'is-success' : 'is-retry'}"><span>${passed ? '★' : '↻'}</span><h1>${passed ? 'Test Passed!' : 'One More Try Will Make You Faster'}</h1><p>${passed ? 'Great work. Keep recalling the answers quickly.' : 'Follow the chant once more, then try again.'}</p><strong>${s.correct}<small>/ ${total}</small></strong><div class="result-metrics"><small>Incorrect ${mistakes} / ${total}</small><small>Accuracy ${accuracy}%</small></div></section></div><button class="primary big child-learning-cta" data-route="${next}">${nextLabel}</button></section>`, 'child', 'child-practice', { focus: true, shellClass: 'child-learning-shell', pageClass: 'child-learning-page' });
}

function childPractice() {
  const sevenReady = true;
  const mixedReady = Boolean(progress.test6 && progress.test7);

  shell(`<div class="task-selection-layout"><section class="task-selection-copy">${pageHead('Practice', 'Choose a Quick Test', 'Miss no more than one question to pass.')}</section><section class="task-selection-panel"><div class="practice-grid"><button data-route="test-6"><strong>6s Test</strong><span>${bestScoreLabel(progress.attempted6, progress.lastAccuracy6)}</span></button><button data-route="test-7" ${sevenReady ? '' : 'disabled'}><strong>7s Test</strong><span>${sevenReady ? bestScoreLabel(progress.attempted7, progress.lastAccuracy7) : 'Pass the 6s test first'}</span></button><button data-route="test-mixed" ${mixedReady ? '' : 'disabled'}><strong>Mixed 6+7 Test</strong><span>${mixedReady ? bestScoreLabel(progress.mixedAttempted, progress.mixedAccuracy) : 'Pass both the 6s and 7s tests first'}</span></button></div></section></div>`, 'child', 'child-practice');
}

function childChallenges() {
  const mixedReady = gameUnlocked('mixed');
  const mixedCompleted = Boolean(progress.mixedGame || progress.mixed);
  const towerLabels = {
    'full-2-4': ['2–4', 'Combined Tower'],
    'full-5-9': ['5–9', 'Combined Tower'],
    'full-2-9': ['2–9', 'Full Combined Tower'],
    'full-2-9-speed': ['2–9', 'Speed Tower'],
  };

  const fullChallenges = hasFullAccess() ? FULL_TOWER_MODES.map((towerMode) => {
    const unlocked = gameUnlocked(towerMode.mode);
    const completed = Boolean(progress[towerMode.progressKey]);
    const [range, title] = towerLabels[towerMode.mode] || [towerMode.mode, 'Tower Challenge'];
    const lockedLabel = towerMode.mode === 'full-2-9-speed'
      ? 'Complete the full 2–9 combined tower first'
      : towerMode.mode === 'full-2-9'
        ? 'Complete the 2–4 and 5–9 combined towers first'
        : towerMode.mode === 'full-2-4'
        ? 'Pass the 2s, 3s, and 4s tests to unlock'
        : towerMode.mode === 'full-5-9'
          ? 'Pass the 5s through 9s tests to unlock'
          : 'Complete the required earlier challenge';
    const status = !unlocked
      ? lockedLabel
      : completed
        ? `Completed · Play Again · ${towerMode.total} questions`
        : `Start Challenge · ${towerMode.total} questions`;
    return `<button data-route="game-${towerMode.mode}" ${unlocked ? '' : 'disabled'}><span>${range}</span><strong>${title}</strong><small>${status}</small></button>`;
  }).join('') : '';

  shell(`<div class="task-selection-layout"><section class="task-selection-copy">${pageHead('Challenges', 'Combined Tower Challenges', 'Complete the required formal group tests, then clear each combined tower in order.')}</section><section class="task-selection-panel"><div class="challenge-grid"><button data-route="game-mixed" ${mixedReady ? '' : 'disabled'}><span>6+7</span><strong>Combined Tower</strong><small>${mixedCompleted ? 'Completed · Play Again · 12 questions' : mixedReady ? 'Start Challenge · 12 questions' : 'Pass the 6s and 7s tests first'}</small></button>${fullChallenges}</div></section></div>`, 'child', 'child-challenges');
}

function startGame(mode) {
  if (!gameUnlocked(mode)) return childChallenges();
  void closeLandscapeTable({ restoreFocus: false });
  clearReadingNavigation();
  clearEdgeSwipeNavigation();
  session = { type: 'tower', mode: String(mode) };
  void lockGameLandscape();
  app.innerHTML = `<main class="tower-host">
    <iframe title="ChantCode Tower Challenge" src="/free-multiplication-app/game/runtime/index.html?mode=${encodeURIComponent(mode)}" allow="autoplay"></iframe>
  </main>`;
  document.querySelector('.tower-host iframe')?.addEventListener('error', () => {
    if (session?.type !== 'tower') return;
    session = null;
    go('child-challenges');
  }, { once: true });
  bindRoutes();
}

function onTowerMessage(event) {
  if (event.origin !== location.origin || !session || session.type !== 'tower') return;
  const mode = String(event.data?.mode || session.mode);
  if (event.data?.type === 'chantcode:tower-exit') return go('child-challenges');
  if (event.data?.type !== 'chantcode:tower-complete') return;

  const mistakes = Number(event.data?.mistakes || 0);
  const numericMode = Number(mode);
  const fullTowerMode = getTowerMode(mode);
  const fallbackTotal = fullTowerMode?.total ?? (mode === 'mixed'
    ? 12
    : FULL_GROUPS.includes(numericMode)
      ? practiceFacts(numericMode).length
      : 0);
  const total = Number(event.data?.total || fallbackTotal);
  const correct = Number(event.data?.correct ?? Math.max(0, total - mistakes));
  const passed = mistakes <= 1;

  if (mode === 'mixed') {
    save({
      towerMistakesMixed: mistakes,
      ...(passed ? {
        mixedGame: true,
        mixed: true,
        completed: true,
        highestScore: Math.max(Number(progress.highestScore) || 0, 8)
      } : {})
    });
  } else if (fullTowerMode) {
    save({
      [fullTowerMode.mistakesKey]: mistakes,
      ...(passed ? { [fullTowerMode.progressKey]: true } : {})
    });
  } else if (FULL_GROUPS.includes(numericMode)) {
    save({
      [`towerMistakes${numericMode}`]: mistakes,
      ...(passed ? {
        [`game${numericMode}`]: true,
        highestScore: Math.max(Number(progress.highestScore) || 0, 8)
      } : {})
    });
  }

  towerResult = { scope: mode, mistakes, correct, total, passed };
  session = null;
  go(`child-complete-${mode}`);
}
function childComplete(scope) {
  const mixed = scope === 'mixed';
  const fullTowerMode = getTowerMode(scope);
  const fallbackTotal = fullTowerMode?.total ?? (mixed ? 12 : 0);
  const mistakesKey = fullTowerMode?.mistakesKey ?? 'towerMistakesMixed';
  const completionKey = fullTowerMode?.progressKey ?? 'mixedGame';
  const savedMistakes = Number(progress[mistakesKey] || 0);
  const result = towerResult || {
    mistakes: savedMistakes,
    correct: Math.max(0, fallbackTotal - savedMistakes),
    total: fallbackTotal,
    passed: Boolean(mixed ? (progress.mixedGame || progress.mixed) : progress[completionKey])
  };
  towerResult = null;

  if (!result.passed) {
    return shell(`<section class="handoff-screen complete is-retry"><span>↻</span><h1>Challenge Not Cleared Yet</h1><p>Correct <strong>${result.correct}</strong> · Incorrect <strong>${result.mistakes}</strong></p><p>Miss no more than one question to clear the challenge.</p><button class="primary big" data-route="game-${scope}">Try Again →</button><button class="text-button" data-route="child-challenges">Return to Challenges</button></section>`, 'child', 'child-challenges', { focus: true });
  }

  let nextRoute = 'child-challenges';
  let nextLabel = 'Return to Challenges →';
  if (mixed && hasFullAccess()) {
    nextRoute = 'child-follow-8';
    nextLabel = 'Continue to the 8s →';
  }

  const completionText = fullTowerMode
    ? `You completed ${fullTowerMode.label}.`
    : 'You completed the mixed 6s and 7s tower challenge.';
  shell(`<section class="handoff-screen complete is-success"><span>★</span><h1>Great Job — Challenge Cleared!</h1><p>Correct <strong>${result.correct}</strong> · Incorrect <strong>${result.mistakes}</strong></p><p>${completionText}</p><button class="primary big" data-route="${nextRoute}">${nextLabel}</button></section>`, 'child', 'child-challenges', { focus: true });
}
function fullChildHome() {
  if (!hasFullAccess()) return trialChildHome();
  const foundationCards = FOUNDATION_GROUPS.map((group) => `
    <button class="group-card group-${group}" data-route="child-follow-${group}">
      <small>Helpful rule · Listen anytime</small>
      <strong>${group}</strong>
      <span>Foundation rule</span>
      <b>View rule &amp; listen →</b>
    </button>`).join('');

  shell(
    `<div class="selection-landscape-layout full-selection-layout">
      <section class="selection-groups-panel" aria-label="Complete learning groups">
        ${pageHead(
          'Full Learning Path',
          'Complete Groups 1–10 Learning',
          'Use the simple 1s and 10s rules as helpers, then complete all 36 core chants from groups 2 through 9.'
        )}
        <section class="learning-section-head">
          <small>Foundation Rules</small>
          <h2>The 1s and 10s</h2>
          <p>These two groups are available anytime for rule practice. They do not have tests or tower stages.</p>
        </section>
        <div class="group-grid foundation-group-grid">${foundationCards}</div>

        <section class="trial-music-entry full-path-music-entry" aria-labelledby="fullPathMusicTitle">
          <div>
            <small>Complete Multiplication Music</small>
            <h2 id="fullPathMusicTitle">Complete 2–9 Multiplication Music</h2>
            <p>Watch and sing along with all 36 core chants in order.</p>
          </div>
          <button class="trial-music-play" id="fullPathMusicPlay" type="button" aria-label="Play the complete multiplication music video">
            <span aria-hidden="true">▶</span>
            <strong>Play Complete Multiplication Music</strong>
          </button>
        </section>
        <div class="video-player-shell" id="fullPathMusicPlayer" data-video-player data-lock-landscape role="dialog" aria-modal="true" aria-label="Complete multiplication music video" hidden>
          <video id="fullPathMusicVideo" playsinline webkit-playsinline preload="metadata" controlslist="nodownload noplaybackrate noremoteplayback" disablepictureinpicture src="${COMPLETE_VIDEO}" aria-label="Complete multiplication music video for groups 2 through 9"></video>
          ${videoPlayerControlsMarkup({ loop: true })}
        </div>

        <section class="learning-section-head core-learning-head">
          <small>Core Chants</small>
          <h2>Groups 2–9 · 36 Chants</h2>
          <p>Complete each group test to unlock the next learning group. Combined tower challenges are available from the Child Home tower card.</p>
        </section>

        <div class="group-grid">
          ${FULL_GROUPS.map((group) => {
            const unlocked = fullGroupUnlocked(group);
            const completed = Boolean(progress[`test${group}`]);
            const status = unlocked ? groupStatus(group) : 'Complete the previous stage to unlock';
            return `
              <button
                class="group-card group-${group}"
                data-route="child-follow-${group}"
                ${unlocked ? '' : 'disabled'}
              >
                <small>${status}</small>
                <strong>${group}</strong>
                <span>Multiplication Group</span>
                <b>${unlocked ? completed ? 'Test passed · Review →' : 'Start learning →' : 'Locked'}</b>
              </button>
            `;
          }).join('')}
        </div>
      </section>
    </div>`,
    'child',
    'child'
  );
  const fullPathMusicPlayer = bindCustomVideoPlayer(document.querySelector('#fullPathMusicPlayer'), {
    lockLandscape: true,
    tapVideoSurfaceTogglesPlayback: true,
  });
  document.querySelector('#fullPathMusicPlay')?.addEventListener('click', () => {
    stopVoice();
    void fullPathMusicPlayer?.open();
  });
}
window.addEventListener('message', onTowerMessage);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    lockParentAccess();
    void restorePhonePortrait();
    if (!isSpeechSession()) return;
    void cancelChantSpeech();
    if (recitationAdvanceTimer !== null) {
      window.clearTimeout(recitationAdvanceTimer);
      recitationAdvanceTimer = null;
    }
    session.isStarting = false;
    session.isListening = false;
    session.isEvaluating = false;
    session.isAdvancing = false;
    if (session.type === 'recitation') {
      clearRecitationModeTimers();
      stopVoice();
      session.isCoaching = false;
      session.isPaused = true;
      setRecitationStatus('ready', 'Recitation paused', 'Tap Start Recitation when you return.');
      updateRecitationControls();
    } else {
      session.queue = [];
      session.currentIndex = -1;
      session.completedRound = true;
      setActiveSpokenAnswerCard(null);
      setSpokenAnswerStatus('ready', 'Voice test paused', 'Tap Retry Unpassed when you return.');
      updateSpokenAnswerControls();
    }
    return;
  }
  if (!FREE_FULL_ACCESS && !DEV_FULL_ACCESS) void fullVersionAccess.refresh();
  if (session?.type === 'tower') void lockGameLandscape();
  if (document.body.classList.contains('has-video-overlay')) void lockVideoLandscape();
  if (document.body.classList.contains('landscape-table-open')) void lockVideoLandscape();
});
window.addEventListener('pagehide', () => {
  void closeLandscapeTable({ restoreFocus: false });
  void restorePhonePortrait();
}, { once: true });
window.addEventListener('beforeunload', () => {
  void fullVersionAccess.stop();
  if (welcomeTimer !== null) window.clearTimeout(welcomeTimer);
  lockParentAccess();
  void closeLandscapeTable({ restoreFocus: false });
  void restorePhonePortrait();
  stopVoice();
  void cleanupSpeechSession();
  clearReadingNavigation();
  clearEdgeSwipeNavigation();
});
if (!FREE_FULL_ACCESS && !DEV_FULL_ACCESS) void fullVersionAccess.start();
showWelcome();
