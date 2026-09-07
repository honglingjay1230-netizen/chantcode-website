import { SITE } from "../config";

function StoreLink({ href, label, compact }: { href: string; label: string; compact?: boolean }) {
  if (!href) {
    return (
      <span className={`store-button disabled${compact ? " compact" : ""}`} aria-disabled="true">
        <small>{label}</small><strong>Coming Soon</strong>
      </span>
    );
  }
  return (
    <a className={`store-button${compact ? " compact" : ""}`} href={href} rel="noopener noreferrer">
      <small>{label}</small><strong>{label.includes("App Store") ? "App Store" : "Google Play"}</strong>
    </a>
  );
}

export function StoreButtons({ compact = false, showQr = false }: { compact?: boolean; showQr?: boolean }) {
  return (
    <div className="store-buttons">
      <div className={`store-download-option${compact ? " compact" : ""}`}>
        <StoreLink href={SITE.appStoreUrl} label="Download on the App Store" compact={compact} />
        {showQr && SITE.appStoreUrl ? (
          <a className="app-store-qr" href={SITE.appStoreUrl} aria-label="Open ChantCode in the App Store">
            <img src="/chantcode-app-store-qr.png" alt="QR code for the official ChantCode App Store download page" />
            <span>Scan to download</span>
          </a>
        ) : null}
      </div>
      <StoreLink href={SITE.googlePlayUrl} label="Get it on Google Play" compact={compact} />
    </div>
  );
}
