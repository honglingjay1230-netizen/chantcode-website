export const FULL_VERSION_PRODUCT_ID = 'com.chantcode.app.fullversion';

const PRODUCT_TYPE = 'inapp';

function getNativePurchases() {
  const capacitor = globalThis.Capacitor;
  if (!capacitor?.isNativePlatform?.() || capacitor.getPlatform?.() !== 'ios') return null;
  if (!capacitor.isPluginAvailable?.('NativePurchases')) return null;
  return capacitor.Plugins?.NativePurchases
    ?? capacitor.registerPlugin?.('NativePurchases')
    ?? null;
}

function isMatchingTransaction(transaction) {
  return transaction?.productIdentifier === FULL_VERSION_PRODUCT_ID
    && transaction.isNonConsumable === true
    && transaction.revocationDate == null
    && transaction.revocationReason == null
    && typeof transaction.transactionId === 'string'
    && transaction.transactionId.length > 0;
}

function errorMessage(error) {
  if (typeof error === 'string') return error;
  if (typeof error?.message === 'string') return error.message;
  return '';
}

function errorStatus(error) {
  const message = errorMessage(error).toLowerCase();
  if (message.includes('user cancel') || message.includes('payment cancelled')) return 'cancelled';
  if (message.includes('pending')) return 'pending';
  return 'failed';
}

export function isNativePurchaseAvailable() {
  return Boolean(getNativePurchases());
}

export async function getFullVersionProduct() {
  const purchases = getNativePurchases();
  if (!purchases) return null;
  try {
    const billing = await purchases.isBillingSupported();
    if (!billing?.isBillingSupported) return null;
    const result = await purchases.getProduct({
      productIdentifier: FULL_VERSION_PRODUCT_ID,
      productType: PRODUCT_TYPE,
    });
    return result?.product?.identifier === FULL_VERSION_PRODUCT_ID ? result.product : null;
  } catch {
    return null;
  }
}

// Referral proof is read separately from access checks. It never grants or removes Full Version.
// NativePurchases already returns VerificationResult.jwsRepresentation on purchases and restores.
export async function getFullVersionReferralTransaction({ includeHistory = false } = {}) {
  const purchases = getNativePurchases();
  if (!purchases) return null;
  const current = await purchases.getPurchases({ productType: PRODUCT_TYPE, onlyCurrentEntitlements: true });
  if (!Array.isArray(current?.purchases)) throw new Error('Invalid StoreKit response');
  const matching = current.purchases.find(transaction => isMatchingTransaction(transaction) && typeof transaction.jwsRepresentation === 'string');
  if (matching || !includeHistory) return matching ?? null;
  // Historical proof lets a refunded referrer re-open previously claimed codes. The server
  // still rechecks Apple and suspends referral eligibility; this is not an entitlement query.
  const history = await purchases.getPurchases({ productType: PRODUCT_TYPE, onlyCurrentEntitlements: false });
  return history?.purchases?.filter(transaction => transaction.productIdentifier === FULL_VERSION_PRODUCT_ID
    && typeof transaction.jwsRepresentation === 'string').sort((a, b) => Date.parse(b.purchaseDate) - Date.parse(a.purchaseDate))[0] ?? null;
}

export async function hasFullVersionEntitlement(revokedTransactionIds = new Set()) {
  // 查询当前设备的 App Store 账号权益，也包括该账号在其他 iOS 设备上的购买；
  // 不要求本机购买过，也不以本机 fullPurchased/fullUnlocked 为查询前提。
  const purchases = getNativePurchases();
  if (!purchases) throw new Error('StoreKit unavailable');
  const result = await purchases.getPurchases({
    productType: PRODUCT_TYPE,
    onlyCurrentEntitlements: true,
  });
  // 桥接异常/缺少数据不是 Apple 明确返回的空权益列表。
  if (!Array.isArray(result?.purchases)) throw new Error('Invalid StoreKit entitlement response');
  return result.purchases.some((transaction) => isMatchingTransaction(transaction)
    && !revokedTransactionIds.has(transaction.transactionId));
}

export async function purchaseFullVersion() {
  const purchases = getNativePurchases();
  if (!purchases) return { status: 'unavailable' };
  try {
    const billing = await purchases.isBillingSupported();
    if (!billing?.isBillingSupported) return { status: 'unavailable' };
    const transaction = await purchases.purchaseProduct({
      productIdentifier: FULL_VERSION_PRODUCT_ID,
      productType: PRODUCT_TYPE,
      quantity: 1,
    });
    if (isMatchingTransaction(transaction) && await hasFullVersionEntitlement()) {
      return { status: 'purchased' };
    }
    return { status: 'failed' };
  } catch (error) {
    return { status: errorStatus(error) };
  }
}

// 唯一的运行时权益同步入口。学习进度由调用方单独合并保存。
export function createFullVersionAccess(onChange) {
  let revision = 0;
  let active = false;
  let stopped = false;
  const handles = [];
  const revokedTransactionIds = new Set();
  const publish = (value) => {
    active = value;
    onChange(value);
  };
  const run = async (operation) => {
    const request = ++revision;
    let result;
    try {
      result = await operation();
    } catch {
      result = { status: 'failed' };
    }
    // 退款/新的查询已发生时，不允许较早返回的成功结果重新解锁。
    // 临时失败不是退款；保留本次运行中最近一次 Apple 已确认的状态。
    if (!stopped && request === revision && result.status !== 'failed') {
      publish(result.status === 'active');
    }
    return result;
  };
  const refresh = () => run(async () => ({
    status: await hasFullVersionEntitlement(revokedTransactionIds) ? 'active' : 'inactive',
  }));
  const invalidate = () => {
    ++revision;
    if (!stopped) publish(false);
  };
  const start = async () => {
    const purchases = getNativePurchases();
    if (purchases?.addListener) {
      const listeners = [
        ['transactionUpdated', (transaction) => {
          // StoreKit 也会在这里发送同一账号从其他设备完成的购买/交易更新。
          if (transaction?.productIdentifier !== FULL_VERSION_PRODUCT_ID) return;
          if (transaction.revocationDate != null || transaction.revocationReason != null) {
            // 已撤销的同一笔交易不能被延迟缓存重新授予；再次购买会有新交易。
            if (transaction.transactionId) revokedTransactionIds.add(transaction.transactionId);
            invalidate();
          }
          void refresh();
        }],
        ['transactionVerificationFailed', () => { void refresh(); }],
        ['entitlementRefreshRequested', () => { void refresh(); }],
      ];
      for (const [event, listener] of listeners) {
        try {
          const handle = await purchases.addListener(event, listener);
          if (stopped) await handle.remove();
          else handles.push(handle);
        } catch {
          // 监听器错误不是退款；继续执行启动查询及已有的前台刷新。
        }
      }
    }
    if (!stopped) return refresh();
  };
  return {
    get active() { return active; },
    start,
    refresh,
    purchase: async () => {
      const result = await purchaseFullVersion();
      // Apple 付款弹窗也会触发前台事件；操作结束后发起新的查询，
      // 避免付款中途的空查询覆盖刚完成的购买。取消后也仅信任当前权益。
      await refresh();
      return result;
    },
    restore: async () => {
      const result = await restoreFullVersion();
      if (result.status !== 'restored') {
        if (result.status === 'not-found') invalidate();
        return result;
      }
      const current = await refresh();
      return { status: current.status === 'active' ? 'restored' : current.status === 'inactive' ? 'not-found' : 'failed' };
    },
    stop: async () => {
      stopped = true;
      ++revision;
      await Promise.all(handles.splice(0).map((handle) => handle.remove()));
    },
  };
}

export async function restoreFullVersion() {
  const purchases = getNativePurchases();
  if (!purchases) return { status: 'unavailable' };
  try {
    const billing = await purchases.isBillingSupported();
    if (!billing?.isBillingSupported) return { status: 'unavailable' };
    await purchases.restorePurchases();
    return await hasFullVersionEntitlement()
      ? { status: 'restored' }
      : { status: 'not-found' };
  } catch (error) {
    return { status: errorStatus(error) };
  }
}
