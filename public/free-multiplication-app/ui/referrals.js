import { getFullVersionReferralTransaction } from './purchases.js';
import { REFERRAL_ORIGIN, REFERRALS_ENABLED } from './referral-config.js';

export const REFERRAL_SANDBOX_TESTING = REFERRALS_ENABLED && REFERRAL_ORIGIN === 'https://chantcode-referrals-sandbox.pages.dev';
export async function requestSandboxRefund() {
  if (!REFERRAL_SANDBOX_TESTING) throw new Error('Sandbox refund testing is disabled.');
  const native = nativeReferral();
  if (!native?.requestSandboxRefund) throw new Error('Open this test in the iPhone App.');
  return native.requestSandboxRefund();
}

const PENDING_KEY = 'pendingReferralCode';
export const pendingReferralCode = () => { try { return localStorage.getItem(PENDING_KEY) || ''; } catch { return ''; } };
const clearPending = () => { try { localStorage.removeItem(PENDING_KEY); } catch { /* Optional local cache. */ } };
export const normalizeInviteCode = value => String(value).trim().toUpperCase();
export function progressText(balance) {
  if (balance < 0) return { title: `${Math.abs(balance)} referral${balance === -1 ? '' : 's'} need${balance === -1 ? 's' : ''} to be replaced`, detail: 'A previous referred purchase was refunded. Your next successful referral will restore your reward progress.' };
  if (balance >= 2) return { title: 'Gift Code Ready 🎁', detail: 'Claim a Gift Code to share with a friend or family member.' };
  return { title: `${balance} / 2 purchases`, detail: balance === 1 ? 'One more purchase to unlock your Gift Code.' : 'Invite 2 families who purchase Full Version to unlock a Gift Code.' };
}
export class ReferralApiError extends Error {
  constructor(code) { super(code); this.code = code; }
}
export function referralErrorText(error) {
  return ({
    offer_code_not_eligible: 'Full Version purchases redeemed with an Offer Code are not eligible for referrals.',
    paid_purchase_required: 'Purchase ChantCode Full Version to unlock referrals.',
    own_purchase_required: 'Only your own paid Full Version purchase is eligible for referrals.',
    purchase_refunded: 'Referral eligibility is paused because this purchase was refunded. Previously claimed Gift Codes remain available.',
    referrer_suspended: 'This referrer’s eligibility is currently paused.',
    invalid_referral_code: 'This invite code is not valid. Check the code and try again.',
    already_attributed: 'This purchase already has an invite code. It cannot be changed.',
    self_referral: 'You cannot use your own invite code.',
    not_eligible: 'Two qualifying purchases are needed before you can claim a Gift Code.',
    claim_progress_changed: 'Your reward progress changed. Refresh to see your latest Gift Codes.',
    rate_limited: 'Please wait a moment before trying again.',
    no_transaction: 'Purchase ChantCode Full Version to unlock referrals.',
  })[error?.code] || 'The referral service is temporarily unavailable. Please try again. Your Full Version access is not affected.';
}
export async function referralRequest(path, { transaction, body, requestKey } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (transaction?.jwsRepresentation) headers.Authorization = `Bearer ${transaction.jwsRepresentation}`;
  if (requestKey) headers['Idempotency-Key'] = requestKey;
  let response;
  try {
    response = await fetch(`${REFERRAL_ORIGIN}/api/referral/${path}`, {
      method: body === undefined ? 'GET' : 'POST', headers,
      body: body === undefined ? undefined : JSON.stringify(body), credentials: 'omit',
      signal: AbortSignal.timeout(45000),
    });
    const data = await response.json();
    if (!response.ok) throw new ReferralApiError(data.error);
    return data;
  } catch (error) {
    if (error instanceof ReferralApiError) throw error;
    throw new ReferralApiError('service_temporarily_unavailable');
  }
}
export async function applyInviteCode(value, transaction = null) {
  const code = normalizeInviteCode(value);
  if (!/^CC[A-Z2-9]{6,16}$/.test(code)) throw new ReferralApiError('invalid_referral_code');
  if (transaction) {
    const result = await referralRequest('qualify', { transaction, body: { referralCode: code } });
    clearPending();
    return result;
  }
  await referralRequest('code/validate', { body: { referralCode: code } });
  try { localStorage.setItem(PENDING_KEY, code); } catch { throw new ReferralApiError('local_storage_unavailable'); }
  return { status: 'pending' };
}
export async function qualifyPendingReferral(transaction = null) {
  const code = pendingReferralCode();
  if (!code) return null;
  transaction ??= await getFullVersionReferralTransaction();
  if (!transaction) return null;
  try { return await applyInviteCode(code, transaction); }
  catch (error) {
    if (['already_attributed', 'offer_code_not_eligible', 'self_referral', 'purchase_refunded', 'own_purchase_required'].includes(error.code)) clearPending();
    throw error;
  }
}

function nativeReferral() {
  const cap = globalThis.Capacitor;
  if (!cap?.isNativePlatform?.() || cap.getPlatform?.() !== 'ios') return null;
  return cap.Plugins?.ReferralActions ?? cap.registerPlugin?.('ReferralActions') ?? null;
}
export async function copyReferralText(text) {
  const native = nativeReferral();
  if (native) return native.copyText({ text });
  return navigator.clipboard.writeText(text);
}
export async function shareInvite(code, link) {
  const text = `I’ve been using ChantCode for multiplication practice. If you’d like to try it, use my invite code:\n\n${code}\n\n${link}`;
  const native = nativeReferral();
  if (native) return native.shareInvite({ text });
  if (navigator.share) return navigator.share({ title: 'ChantCode', text });
  await copyReferralText(text);
  return { copied: true };
}
export async function redeemGiftCode() {
  const native = nativeReferral();
  if (!native) throw new ReferralApiError('redemption_unavailable');
  return native.redeemGiftCode();
}
