# Delete your JS

A short talk, and a website to go with it, about things we used to write JavaScript for that HTML and CSS can now do on their own.

This is not really a project. It is a presentation, built with the help of Claude, using plain HTML.

Think menus, tooltips, accordions, dark mode and page transitions. Each one is a small example. Each one shows the old way (with JavaScript) next to the new way (with CSS), so you can see the difference for yourself.

## What's in here

- **18 short lessons.** One for each feature, plus a basics lesson at the start and a cheat sheet at the end.
- **Side-by-side demos.** Every lesson shows the old way and the new way working live.
- **Real code.** You can see the actual HTML, CSS and JavaScript on each page.
- **A speed test.** Lesson 00 has a race between four versions of a small shop page, so you can see what extra JavaScript costs a real visitor.

## Where JavaScript is used

The point of the talk is to show less JavaScript, so here is every place it appears.

| Where | What the JavaScript does |
|---|---|
| `lessons/00-basics.html` | Several small demos, including a ball animation and the Web Vitals playground. |
| `lessons/01` to `16` | Each lesson has one "old way" script that rebuilds the feature by hand (menus, dialogs, accordions, tooltips, dark mode, carousels and so on). The "new way" next to it uses CSS or HTML only. |
| `lessons/17-page-transitions.html` | Shows a JavaScript version of page transitions, but it is only displayed, not run. The CSS version is the one that works. |
| `lessons/18-cheatsheet.html` | One example of a `<script>` tag, shown as text. |
| `lessons/lab/` | The speed test. Four versions of one shop page: CSS only, normal script, `defer` and `async`. `lab-heavy.js` is a deliberately large file. `lab-measure.js` records timings. `lab-sw.js` slows down the download of `lab-heavy.js`, to imitate a slow phone connection. |
| `assets/site.css` | No JavaScript. It only styles the site. |

## How to look at it

No installs needed. It's plain HTML and CSS.

1. Download or clone this folder.
2. Open `index.html` in Chrome or Edge.

Some pages (the speed test and the page transitions) need the site to run through a local server. If they look stuck, use the VS Code **Live Server** extension, or run `npx serve .` in the folder and open the address it shows.

## Who it's for

- **Developers** who want a quick, honest look at what CSS can replace.
- **Anyone deciding** whether a feature really needs a script before we build it.

## Notes

- Works best in Chrome or Edge.
- Browser support details were checked in September 2026. Things move, so check [web.dev/baseline](https://web.dev/baseline) before relying on a specific feature.
## Questions

Ask Dheeraj, who built it.
