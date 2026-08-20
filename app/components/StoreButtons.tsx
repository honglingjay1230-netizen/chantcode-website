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

export function StoreButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div className="store-buttons">
      <StoreLink href={SITE.appStoreUrl} label="Download on the App Store" compact={compact} />
      <StoreLink href={SITE.googlePlayUrl} label="Get it on Google Play" compact={compact} />
    </div>
  );
}
