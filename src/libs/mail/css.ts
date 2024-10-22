import { readFile } from 'node:fs/promises';

import juice from 'juice';
import { rehype } from 'rehype';
import rehypeRewrite from 'rehype-rewrite';
import stringify from 'rehype-stringify';

/** Cache of compiled tailwind files */
const twcCache = new Map<string, Promise<string>>();

/**
 * Originally based on The MailChimp Reset from Fabio Carneiro, MailChimp User Experience Design
 * More info and templates on Github: https://github.com/mailchimp/Email-Blueprints
 * http://www.mailchimp.com &amp; http://www.fabio-carneiro.com
 * These styles are non-inline; they impact UI added by email clients
 * By line:
 * (1) Force Outlook to provide a "view in browser" message
 * (2) Force Hotmail to display emails at full width
 * (3) Force Hotmail to display normal line spacing
 * (4) Prevent WebKit and Windows mobile changing default text sizes
 * (5) Remove spacing between tables in Outlook 2007 and up
 * (6) Remove table borders on MSO 07+ http://www.campaignmonitor.com/blog/post/3392/1px-borders-padding-on-table-cells-in-outlook-07/
 * (7) Specify bicubic resampling for MSO on img objects
 * (8) Media Query block - Pretty phone numbers in email: http://www.campaignmonitor.com/blog/post/3571/using-phone-numbers-in-html-email
 * (9) Media Query block - same as above, but for tablet sized devices
 */
const universalStyles = /*css*/ `
  #outlook a{ padding:0; }
  .ReadMsgBody{ width:100%; } .ExternalClass{ width:100%; }
  .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
  body, table, td, p, a, li, blockquote{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td{ mso-table-lspace:0pt; mso-table-rspace:0pt; }
  table td {border-collapse: collapse;}
  img{-ms-interpolation-mode: bicubic;}
  @media only screen and (max-device-width: 480px) {
    a[href^="tel"],
    a[href^="sms"] {
      text-decoration: default !important;
      pointer-events: auto !important;
      cursor: default !important;
    }
  }
  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    a[href^="tel"],
    a[href^="sms"] {
      text-decoration: default !important;
      pointer-events: auto !important;
      cursor: default !important;
    }
  }
`;

/**
 * Inline reset styles
 * These set common defaults for a consistent UI. Their comments will be automatically stripped by juice
 */
const resetStyles = /*css*/ `
  /* default margin/padding, box sizing*/
  * { margin: 0; padding: 0; box-sizing: border-box; }
  /* height 100% all the way down */
  table, tr, td {height: 100%;}
  /* img behavior - bicubic ms resizing, no border, fix space gap on gmail/hotmail */
  img { outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; display: block; }
  a img { border: none; }
  /* mso 07, 10 table spacing fix http://www.campaignmonitor.com/blog/post/3694/removing-spacing-from-around-tables-in-outlook-2007-and-2010 */
  table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
  /* tel/sms links are unstyled by default */
  a[href^="tel"], a[href^="sms"] { text-decoration: none; pointer-events: none; cursor: default; }
`;

const variableDefRegex = /(--[a-zA-Z0-9-_]+)\s*:\s(.+?);/g;
const variableUsageRegex = /var\((\s*--[a-zA-Z0-9-_]+\s*)(?:\)|,\s*(.*)\))/;

/** Juices the styles, and then resolves CSS variables and additional HTML adjustements via rehype */
const inlineStyles = (html: string, css: string) => {
  const juiced = juice(html, { extraCss: css });

  const hyped = rehype()
    .use(rehypeRewrite, {
      rewrite: (node) => {
        if (node.type !== 'element') {
          return node;
        }

        // inline styles into the <head>
        if (node.tagName === 'head') {
          node.children = [
            ...node.children,
            {
              type: 'element',
              tagName: 'style',
              children: [{ type: 'text', value: universalStyles }],
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ] as any;
        }

        const resolveVariables = (s: string): string => {
          // pass 1: pull definitions
          const defs = new Map<string, string>();
          let withoutDefs = s.replace(
            variableDefRegex,
            (_, def: string, value: string) => {
              defs.set(def.trim(), value.trim());
              return '';
            },
          );

          // pass 2: replace variables
          let maxCycles = 1000;
          while (withoutDefs.match(variableUsageRegex)) {
            maxCycles--;
            if (maxCycles <= 0) {
              throw new Error('Max Cycles for replacement exceeded');
            }
            withoutDefs = withoutDefs.replace(
              variableUsageRegex,
              (_, def: string, fallback: string) => {
                const d = def.trim();
                if (defs.has(d)) {
                  return defs.get(d) ?? '';
                }
                return (fallback ?? '').trim();
              },
            );
          }

          // return clean result
          return withoutDefs;
        };
        node.properties = {
          ...node.properties,
          style: resolveVariables(`${node.properties?.style ?? ''}`),
        };
      },
    })
    .use(stringify)
    .processSync(juiced)
    .toString();
  return hyped;
};

interface MailwindOptions {
  /** A path to your tailwind.css file, optimized for email */
  tailwindCss: string;
  /** The base px value for 1rem, defaults to 16px */
  basePx?: number;
  /** Set to `false` to disable extended resets */
  reset?: boolean;
}

const mailwindCss = async (email: string, options: MailwindOptions) => {
  const basePx = options?.basePx ?? 16;

  // cache promise for performance in serverless environments
  if (
    !twcCache.has(options.tailwindCss) ||
    process.env.NODE_ENV === 'development'
  ) {
    // console.log("loading styles");
    const p = new Promise<string>((resolve, reject) => {
      readFile(options.tailwindCss)
        .then((buf) => {
          const s = buf.toString();
          // rem to px
          const pxed = s.replace(
            /([\d.-]+rem)/gi,
            (_, value) => `${parseFloat(value.replace(/rem$/, '')) * basePx}px`,
          );
          resolve(pxed);
        })
        .catch((reason) => reject(reason));
    });
    twcCache.set(options.tailwindCss, p);
  }

  const s = await twcCache.get(options.tailwindCss);

  if (typeof s === 'undefined') {
    throw new Error(`Could not load tailwind css from ${options.tailwindCss}`);
  }

  return inlineStyles(
    email,
    options.reset === false ? s : [resetStyles, s].join('\n'),
  );
};

export default mailwindCss;
