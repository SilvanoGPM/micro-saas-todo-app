export interface IsPathActiveParams {
  activePath: string;
  path: string;
  mode?: 'exact' | 'startsWith';
}

export function isPathActive({
  activePath,
  path,
  mode = 'exact',
}: IsPathActiveParams) {
  if (path !== '/' && mode === 'startsWith') {
    return activePath.startsWith(path);
  }

  return activePath === path;
}
