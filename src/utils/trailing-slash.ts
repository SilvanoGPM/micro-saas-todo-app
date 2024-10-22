export function removeTrailingSlash(path: string) {
  return path.endsWith('/') ? path.slice(-1) : path;
}

export function removeStartSlash(path: string) {
  return path.startsWith('/') ? path.slice(1) : path;
}

export function trailingSlash(path: string) {
  return path.endsWith('/') ? path : `${path}/`;
}
