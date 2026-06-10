# ksunw0209.github.io

Personal homepage of **Sunwoo Kim** — live at <https://ksunw0209.github.io>.

A single static page (no build step). GitHub Pages serves the files directly from
the `main` branch (the `.nojekyll` file tells Pages to skip Jekyll processing).

## Editing

- **Content / layout:** `index.html`
- **Styling:** `assets/css/styles.css`
- **Profile photo:** drop a square image at `assets/img/profile.jpg`, then in
  `index.html` replace the placeholder `<svg>` inside `.hero__photo` with
  `<img src="assets/img/profile.jpg" alt="Sunwoo Kim" />`.

## Things to fill in

Search `index.html` for `TODO` — links left as placeholders:

- Google Scholar profile URL (appears twice)
- LinkedIn profile URL
- X / Twitter URL (or remove the link)
- Exact titles and links for the two listed publications

## Deploying

Just commit and push to `main`; GitHub Pages redeploys automatically.

```sh
git add -A && git commit -m "Update homepage" && git push
```
