# Kingpin Academy — Student Edition

A single-page app for learning to bowl, from your first frame to league night. Open `index.html` in any browser. It runs entirely in the page, with no installs or accounts.

## What's inside

| Tab | What it does |
|---|---|
| **The Path** | A self-paced roadmap in four levels. Each step says what to learn, links to the tool that helps, and tells you when you are ready to move on. |
| **Basics** | A cheat sheet: pin numbers and names, strikes and spares, score sheet symbols, lane etiquette, safety, and the parts of the lane. Prints as a one-page handout. |
| **Study Hall** | Eight short lessons, each with a quiz you can retry: fundamentals, the four-step approach, release, targeting, spares, oil patterns, equipment, and the mental game. |
| **Score School** | Enter a game ball by ball and see how strikes, spares and the 10th frame are scored. |
| **Practice** | A 60-minute solo practice plan, a self-check list, a pre-shot routine builder and a drill library. |
| **Reference** | Lane specs, the Rule of 31, common oil patterns and a glossary. |

Checkmarks, quiz answers and your routine reset when the page reloads, so write down or screenshot anything you want to keep.

## Publishing with GitHub Pages

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*, then choose `main` and `/ (root)`.
3. Save. After a minute or two the site is live at `https://cartoticus.github.io/KingpinAcademy/`.

## Running the tests

The tests check the scoring engine and that every tab loads and works in a headless browser.

```bash
npm install
npm test
```

## Sources

- [Kegel Pattern Library](https://patternlibrary.kegel.net/): real oil pattern sheets to use with the Rule of 31.
