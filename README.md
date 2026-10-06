# K. R. Vasuki — faculty profile page

Vanilla HTML, CSS, and JavaScript. No build step, no dependencies, no Node, no
API keys. Open `index.html` in a browser and it runs.

```
index.html     markup
styles.css     all styling (light + dark)
data.js        baked list of publications — the starting point, not the source of truth
filters.js     rules for merging live data
script.js      rendering, interaction, live sync
assets/        portrait, Ramanujan watermark, collaborator photos
```

## How new papers appear

Nothing to run, nothing to redeploy. When a new paper is published:

1. On load the page calls the [OpenAlex API](https://openalex.org) for this
   author's Mathematics-field works.
2. Anything not already listed is merged in and, if it is from this year or
   last, tagged with a `new` badge.
3. The result is saved to `localStorage`, so on every later visit the paper is
   already on screen at first paint.
4. **Refresh**, in the Publications tab, forces an immediate re-check.

Between checks the page uses what it already knows and re-checks in the
background after six hours, so it is never blocked on the network.

Every derived view — stat tiles, per-year chart, themes, co-author list,
frequent venues — is recomputed from the merged data. A new paper updates the
whole page: a new collaborator joins the Collaborators tab, the year chart grows
a bar, theme counts go up.

`data.js` is only the seed for a browser that has never visited before. It never
needs editing when a paper comes out.

> Google Scholar has no public API and blocks browser requests, so it cannot be
> the live source. The paper **list** is live; citation **counts** and the
> h-index/i10 metrics come from `data.js` and are the one thing to update by
> hand, from the Scholar profile, when you want them current.

## Publishing

Static files — drag the folder onto [Netlify Drop](https://app.netlify.com/drop)
or connect a Git repo. No build command; publish directory is the folder root.

Every visitor's browser syncs on its own, so a new paper shows up for everyone
without a redeploy. Redeploy only when you change the markup, styling, or the
citation numbers in `data.js`.

## Editing content

- **Email** — `vasuki_kr@hotmail.com`, set in three places in `index.html`
  (the `mailto:` link, the visible text, and the copy button's `data-copy`).
- **Portrait** — replace `assets/vasuki.jpg` (the current one is Scholar's, only
  224×256).
- **Collaborator photos** — drop a JPEG into `assets/collab/` named as listed in
  `assets/collab/FILENAMES.txt` (e.g. `g-sharath.jpg`). Missing files fall back
  to a generated monogram.
- **Citation counts** — the `c:` value on each entry in `data.js`, plus the
  `metrics` block at the top.
- **Headings, bio, department name** — plain markup in `index.html`.
- **Education** — the `EDUCATION` array in `data.js` (Research tab).
- **Research guide** — the `GUIDE` object in `data.js` (Research tab). Its
  photo path points at `assets/collab/c-adiga.jpg`, the same file used for
  him as a co-author, so one photo covers both spots.
- **Past/present students** — the `PHD_STUDENTS` (name + award year) and
  `RESEARCH_SCHOLARS` (name only) arrays in `data.js` (Students tab).
- **Gallery** — the `GALLERY` array in `data.js`, each entry a `{ file,
  caption }` pair. Drop a JPEG into `assets/gallery/` named as listed in
  `assets/gallery/FILENAMES.txt` and it replaces the placeholder tile.
- **Venue name variants** — Google Scholar sometimes indexes the same journal
  under two spellings (an "&" vs "and", a standard abbreviation, a trailing
  parenthetical, or — for one Springer-translated journal — its original-
  language name alongside the English translation). These would otherwise
  split one journal into two entries in "Frequent Venues." The `VENUE_ALIASES`
  map in `data.js` merges each known variant onto one canonical name. Only
  add an entry there once you've checked the volume/year line up — a similar
  name is not enough, since e.g. "Mathematical Forum" (vol. 12–13, 1998–2000)
  and "International Mathematical Forum" (vol. 5, 2010) are genuinely
  different journals despite the near-identical name.

## A note on the filters

`filters.js` exists because OpenAlex's author disambiguation is imperfect: this
author id also carries a marketing paper and a general-topology paper by other
people with the same name, plus repository deposits and Russian translations
that duplicate entries already listed. The rules keep those off the page and log
a count to the console rather than dropping them silently.

One judgment call worth knowing: *"On Gosper's Pi(q) and Lambert series
identities"* (2022) exists only as a university-repository record with no DOI,
is classified under Engineering, and is absent from Scholar — so it is filtered
out. If it is a real paper, add it to `data.js` by hand.

## Running from `file://`

Everything works when opened directly, with one caveat: some browsers block
`fetch()` from `file://` pages, which would leave the sync line reading
*"OpenAlex could not be reached"* with the baked list on screen. Serving the
folder over HTTP — any static host — fixes it. On Netlify this never comes up.
