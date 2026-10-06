# Voltkit Ohm’s Law Calculator

A minimal interactive DC circuit in vanilla JavaScript. Set the battery voltage and resistor value; the ammeter and total power update as you type. Defaults: 12 V, 6 Ω, 2 A, 24 W.

No dependencies, build step, API, or Calculate button. The calculation and formatting module is about 20 lines.

## Run

Serve this directory using any static HTTP server:

```sh
python3 -m http.server 8080
```

Open http://localhost:8080. JavaScript ES modules need HTTP; opening `index.html` using `file://` will not work.

## Embed

```html
<link rel="stylesheet" href="/tools/ohms-law-calculator/calculator.css">
<ohms-law-calculator></ohms-law-calculator>
<script type="module" src="/tools/ohms-law-calculator/calculator.js"></script>
```

The numeric inputs provide suggested common values and also accept custom values. Native datalist presentation depends on the browser; custom entry always works. Multiple calculator instances can share a page.

Click an input, then scroll over it to change its value: up increases by 1, down decreases by 1. Hold Shift for 0.1 steps. The circuit updates immediately. Voltage stops at zero, and wheel adjustment never reduces a positive resistance to zero or below. Scrolling elsewhere or over an unfocused input scrolls the page normally; Ctrl/Cmd wheel gestures are left to the browser.

## Calculation only

```js
import { calculateOhmsLaw } from './core.js';

calculateOhmsLaw(12, 6);
// { voltage: 12, current: 2, resistance: 6, power: 24 }
```

Current: `I = V / R`. Resistor power: `P = V × I = V² / R`. This is an ideal DC circuit with one resistor, an ideal battery, and an ideal ammeter. Values must be finite, voltage must be nonnegative, and resistance must be greater than zero. Empty or invalid inputs clear the results and show an inline message. Results use SI prefixes and six significant digits, with extremely small values falling back to scientific notation. This is a numerical diagram; it does not model internal resistance, component ratings, or battery discharge.

## Verify

```sh
node --test core.test.mjs
```

## Publish to GitHub

Copy this directory to its own repository and publish it. There are no Voltkit backend dependencies. It can also be hosted directly on GitHub Pages without a build step.

Live page: https://voltkit.net/ohms-law-calculator

## License

MIT. See [LICENSE](./LICENSE). This license applies to the calculator directory only.
