# HTML-limited bots get completed Suspense content outlined into a hidden `<div>`

Minimal reproduction for Next.js App Router with `cacheComponents: true` and the default
`htmlLimitedBots` list.

A request from an HTML-limited bot (Twitterbot and bingbot from Next's default list) gets the blocking
render: metadata in `<head>`, no prerendered shell. When the page contains a Suspense boundary whose
content is larger than React's `progressiveChunkSize` (12,800 bytes by default), the response puts the
**fallback** where the content belongs and the content into `<div hidden id="S:0">`, moved into
place by React's inline `$RC` script. A client that does not run JavaScript sees the fallback and a
hidden element.

The content is complete when the response is flushed. `/small/` renders the same component with
fewer items: bots get it inline. The only difference between the two routes is the size of the
boundary.

## Steps

```bash
npm install
npm run build
npm run start      # http://localhost:3000
npm run check      # in a second terminal
```

`check.mjs` requests both routes as Twitterbot, bingbot and Chrome and reports where the Suspense
content ends up in the HTML.

## Result

`next@16.5.0-canary.27` (bundled React `19.3.0-canary-ab0d927f-20261020`), `react@19.3.1`. Same
result on `next@16.3.8` and `next@16.4.3`, and with `partialPrefetching` set to `true` or `false`.

```
/        Twitterbot (htmlLimitedBots default) | fallback in <main>: true  | items in <main>: false | items in hidden div: true
/        bingbot (htmlLimitedBots default)    | fallback in <main>: true  | items in <main>: false | items in hidden div: true
/        Chrome                               | fallback in <main>: true  | items in <main>: false | items in hidden div: true
/small/  Twitterbot (htmlLimitedBots default) | fallback in <main>: false | items in <main>: true  | items in hidden div: false
/small/  bingbot (htmlLimitedBots default)    | fallback in <main>: false | items in <main>: true  | items in hidden div: false
/small/  Chrome                               | fallback in <main>: true  | items in <main>: false | items in hidden div: true
```

Chrome gets the prerendered shell and the streamed content on both routes, as intended.

## Expected

For a request that matches `htmlLimitedBots`, a completed Suspense boundary is rendered inline,
whatever its size, as on `/small/`. The content should be in `<main>` without JavaScript.

## Cause

React 19.2 started honouring `progressiveChunkSize` for completed boundaries
([facebook/react#33027](https://github.com/facebook/react/pull/33027),
[facebook/react#33029](https://github.com/facebook/react/pull/33029)): Fizz outlines a completed
boundary when `flushedByteSize + boundary.byteSize > progressiveChunkSize`. Next does not set
`progressiveChunkSize` for the App Router page render, so the 12,800-byte default applies to
HTML-limited bots as well. Passing `progressiveChunkSize: Infinity` to the Fizz render keeps every
completed boundary inline; React's own non-streaming `renderToString` does the same.

Related: [vercel/next.js#91806](https://github.com/vercel/next.js/issues/91806) (the general
report), [vercel/next.js#98690](https://github.com/vercel/next.js/pull/98690) (sets
`progressiveChunkSize: Infinity` for the Pages Router, leaves the App Router out because it streams),
[vercel/next.js#96367](https://github.com/vercel/next.js/pull/96367) (HTML-limited bots get a
streamed, not buffered, response), [facebook/react#35460](https://github.com/facebook/react/issues/35460).
