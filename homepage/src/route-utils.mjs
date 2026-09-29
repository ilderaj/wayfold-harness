export const HOMEPAGE_PREFIX = '/wayfold-harness';
const LEGACY_PREFIX = '/superpowering-with-files';

export function normalizeHomepageRequestUrl(urlLike) {
  const url = new URL(urlLike);

  if (url.pathname === LEGACY_PREFIX || url.pathname.startsWith(`${LEGACY_PREFIX}/`)) {
    url.pathname = HOMEPAGE_PREFIX + (url.pathname.slice(LEGACY_PREFIX.length) || '/');
    return { action: 'redirect', status: 308, url: url.toString() };
  }

  if (url.pathname === HOMEPAGE_PREFIX) {
    url.pathname = `${HOMEPAGE_PREFIX}/`;
    return { action: 'redirect', status: 308, url: url.toString() };
  }

  if (url.pathname === `${HOMEPAGE_PREFIX}/`) {
    url.pathname = '/';
    return { action: 'asset', url: url.toString() };
  }

  if (url.pathname.startsWith(`${HOMEPAGE_PREFIX}/`)) {
    url.pathname = url.pathname.slice(HOMEPAGE_PREFIX.length) || '/';
    return { action: 'asset', url: url.toString() };
  }

  return { action: 'not_found', url: url.toString() };
}
