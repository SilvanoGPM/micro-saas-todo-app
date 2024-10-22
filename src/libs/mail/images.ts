import { readFile } from 'fs/promises';

import { JSDOM } from 'jsdom';

import { removeStartSlash, removeTrailingSlash } from '$utils/trailing-slash';

export async function parseImages(
  html: string,
  options?: { assetsFolder?: string },
) {
  const dom = new JSDOM(html);

  const images = Array.from(dom.window.document.querySelectorAll('img')).filter(
    (img) => !img.src.startsWith('http'),
  );

  const attachments = await Promise.all(
    images.map(async (img) => {
      const src = options?.assetsFolder
        ? `${removeTrailingSlash(options.assetsFolder)}/${removeStartSlash(
            img.src,
          )}`
        : img.src;

      const data = await readFile(src);
      const base64 = data.toString('base64');
      const type = src.split('.').pop();

      img.src = `cid:${src}`;

      return {
        filename: `${src.split('/').pop() || src}.${type}`,
        cid: src,
        content: base64,
        encoding: 'base64' as const,
      };
    }),
  );

  return [dom.serialize(), attachments] as const;
}
