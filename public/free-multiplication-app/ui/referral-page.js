import { getFullVersionReferralTransaction } from './purchases.js';
import { applyInviteCode, pendingReferralCode, progressText, referralRequest, referralErrorText, copyReferralText, shareInvite, qualifyPendingReferral } from './referrals.js';

const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
export function inviteCodeEntry() {
  return `<section class="referral-entry" id="referralEntry"><button class="text-button" id="showInviteCode" type="button">Have an invite code?</button>
    <form id="inviteCodeForm" hidden><label for="inviteCodeInput">Enter Invite Code</label><div class="action-row"><input id="inviteCodeInput" maxlength="18" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="CC7K4M2P" required><button class="secondary" type="submit">Apply Code</button></div></form>
    <p id="inviteCodeStatus" class="support-message" aria-live="polite"></p></section>`;
}
export async function bindInviteCodeEntry(requireParent, isPurchased) {
  const root = document.querySelector('#referralEntry');
  if (!root) return;
  const button = root.querySelector('#showInviteCode');
  const form = root.querySelector('form');
  const input = root.querySelector('input');
  const status = root.querySelector('#inviteCodeStatus');
  input.value = pendingReferralCode();
  if (input.value) status.textContent = 'Invite code applied ✓';
  let transaction = null;
  const checkExistingPurchase = async () => {
    transaction = await getFullVersionReferralTransaction();
    if (!root.isConnected || !transaction) return;
    const existing = await referralRequest('status', { transaction });
    if (!root.isConnected) return;
    if (existing.attributed) { button.hidden = true; form.hidden = true; status.textContent = 'Your purchase already has an invite code. It cannot be changed.'; }
    else button.textContent = 'Were you invited by someone? Enter Invite Code';
  };
  button.onclick = async () => {
    if (!requireParent()) return;
    form.hidden = !form.hidden;
    if (!form.hidden) input.focus();
  };
  form.onsubmit = async event => {
    event.preventDefault();
    if (!requireParent()) return;
    const submit = form.querySelector('button');
    submit.disabled = true;
    status.textContent = 'Checking invite code…';
    try {
      transaction = await getFullVersionReferralTransaction();
      await applyInviteCode(input.value, transaction);
      if (!root.isConnected) return;
      status.textContent = 'Invite code applied ✓';
      form.hidden = true;
      if (transaction) button.hidden = true;
    } catch (error) { if (root.isConnected) status.textContent = referralErrorText(error); }
    finally { submit.disabled = false; }
  };
  if (isPurchased) {
    button.disabled = true;
    try {
      await qualifyPendingReferral();
      await checkExistingPurchase();
    } catch (error) { if (root.isConnected) status.textContent = referralErrorText(error); }
    finally { button.disabled = false; }
  }
}

export async function mountReferralPage(root, buyFullVersion, requireParent = () => true) {
  let transaction;
  let claimRequest = null;
  const message = (text) => { const node = root.querySelector('[data-message]'); if (node) node.textContent = text; };
  const unavailable = text => {
    if (!root.isConnected) return;
    root.innerHTML = `<article class="usage-section"><h2>Refer &amp; Gift Codes</h2><p>${escape(text)}</p><div class="action-row"><button class="primary" data-buy>Buy Full Version</button><button class="secondary" data-retry>Try Again</button></div><p data-message class="support-message" aria-live="polite"></p></article>`;
    root.querySelector('[data-buy]').onclick = buyFullVersion;
    root.querySelector('[data-retry]').onclick = () => void load();
  };
  const render = (data) => {
    if (!root.isConnected) return;
    const progress = progressText(data.referralBalance ?? 0);
    root.innerHTML = `<article class="usage-section referral-card"><h2>Invite Families</h2><p>Invite 2 families who purchase ChantCode Full Version and receive 1 Gift Code to share with a friend or family member.</p>
      ${data.eligible ? `<p>Your Invite Code</p><strong class="referral-code">${escape(data.referralCode)}</strong><div class="action-row"><button class="primary" data-share>Share Invite</button><button class="secondary" data-copy-code>Copy Code</button><button class="secondary" data-copy-link>Copy Link</button></div>` : '<p>Referral eligibility is paused because your purchase was refunded. Previously claimed Gift Codes remain available.</p>'}
      <h3>${escape(progress.title)}</h3><p>${escape(progress.detail)}</p>
      ${data.eligible && data.referralBalance >= 2 ? '<button class="primary" data-claim>Claim Gift Code</button>' : ''}<button class="secondary" data-refresh>Refresh</button><p data-message class="support-message" aria-live="polite"></p></article>
      ${data.rewards.map(reward => `<article class="usage-section referral-card"><h2>Your ChantCode Gift Code 🎁</h2><strong class="referral-code">${escape(reward.code)}</strong><div class="action-row"><button class="secondary" data-gift="${escape(reward.id)}">Copy Gift Code</button></div><p>Share this code with a friend or family member. They can redeem it through ChantCode or the App Store.</p>${reward.expires_at ? `<small>Expires ${escape(new Date(reward.expires_at).toLocaleDateString())}</small>` : ''}</article>`).join('')}`;
    const action = (selector, operation) => {
      const button = root.querySelector(selector);
      if (button) button.onclick = async () => {
        if (!requireParent()) return;
        button.disabled = true;
        try { await operation(); } catch (error) { message(referralErrorText(error)); }
        finally { button.disabled = false; }
      };
    };
    action('[data-share]', async () => { const result = await shareInvite(data.referralCode, data.referralLink); if (result?.copied) message('Invite copied.'); });
    action('[data-copy-code]', async () => { await copyReferralText(data.referralCode); message('Invite code copied.'); });
    action('[data-copy-link]', async () => { await copyReferralText(data.referralLink); message('Invite link copied.'); });
    action('[data-refresh]', load);
    action('[data-claim]', async () => {
      if (!claimRequest || claimRequest.version !== data.claimedRewardCount) claimRequest = { key: crypto.randomUUID(), version: data.claimedRewardCount };
      message('Checking your reward…');
      const result = await referralRequest('rewards/claim', { transaction, requestKey: claimRequest.key, body: { expectedClaimedRewardCount: claimRequest.version } });
      if (result.status === 'reward_available_but_codes_out_of_stock') { message('Your Gift Code is ready, but codes are temporarily out of stock. Your reward progress is saved. Please try again later.'); return; }
      await load();
      message('Your Gift Code is saved below.');
    });
    for (const button of root.querySelectorAll('[data-gift]')) button.onclick = async () => {
      if (!requireParent()) return;
      try { await copyReferralText(data.rewards.find(reward => reward.id === button.dataset.gift).code); message('Gift Code copied.'); }
      catch { message('Please select and copy the Gift Code.'); }
    };
  };
  async function load() {
    if (!root.isConnected) return;
    try {
      transaction = await getFullVersionReferralTransaction({ includeHistory: true });
      if (!transaction) { unavailable('Purchase ChantCode Full Version to unlock referrals.'); return; }
      let data;
      try { data = await referralRequest('profile', { transaction, body: {} }); }
      catch (error) {
        if (!['purchase_refunded', 'referrer_suspended'].includes(error.code)) throw error;
        data = await referralRequest('status', { transaction });
        if (!data.referralCode) throw error;
      }
      render(data);
    } catch (error) { unavailable(referralErrorText(error)); }
  }
  root.innerHTML = '<article class="usage-section"><p role="status">Checking your App Store purchase…</p></article>';
  await load();
}
