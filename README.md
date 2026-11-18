# Kingpin Academy — Student Edition

A single-page app for learning to bowl, from your first frame to league night. Open `index.html` in any browser. It runs entirely in the page, with no installs or accounts.

## What's inside

| Tab | What it does |
|---|---|
| **The Path** | A 12-week program. Each week pairs lane practice with a lesson and a tool in the app. |
| **Study Hall** | Eight short lessons, each with a quiz you can retry: fundamentals, the four-step approach, release, targeting, spares, oil patterns, equipment, and the mental game. |
| **Lane Simulator** | Choose an oil pattern, a ball, your laydown board, speed and rev rate, then watch the ball's path to the pins. |
| **Spare Lab** | Tap pins to set up a spare and get the 3-6-9 move for it, with warnings for splits and sleepers. |
| **Score School** | Enter a game ball by ball and see how strikes, spares and the 10th frame are scored. |
| **Practice** | A 60-minute solo practice plan, a self-check list, a pre-shot routine builder and a drill library. |
| **Reference** | Lane specs, the Rule of 31, common oil patterns and a glossary. |

Checkmarks, quiz answers and your routine reset when the page reloads, so write down or screenshot anything you want to keep.

## Publishing with GitHub Pages

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*, then choose `main` and `/ (root)`.
3. Save. After a minute or two the site is live at `https://cartoticus.github.io/KingpinAcademy/`.

## Running the tests

The tests check the scoring engine, the lane physics, and that every tab loads and works in a headless browser.

```bash
npm install
npm test
```

## Sources

- [Kegel Pattern Library](https://patternlibrary.kegel.net/): real oil pattern sheets to compare with the simulator and the Rule of 31.
