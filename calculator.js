import { calculateOhmsLaw, formatQuantity } from './core.js';

let instance = 0;
class OhmsLawCalculator extends HTMLElement {
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;
    const id = `ol-${++instance}`;
    this.classList.add('ol');
    this.innerHTML = `
      <p class="ol-hint">Choose a value or type your own.</p>
      <div class="ol-circuit" aria-label="Closed DC circuit with a battery, resistor, and ammeter">
        <div class="ol-wire" aria-hidden="true"></div>
        <label class="ol-control ol-voltage" for="${id}-voltage">
          <span>Voltage</span>
          <span class="ol-input-wrap"><input id="${id}-voltage" name="voltage" type="number" inputmode="decimal" min="0" step="any" value="12" list="${id}-voltages" aria-describedby="${id}-error" required><span>V</span></span>
        </label>
        <datalist id="${id}-voltages">${[1.5, 3.3, 5, 9, 12, 24, 48].map((value) => `<option value="${value}"></option>`).join('')}</datalist>
        <div class="ol-battery" aria-hidden="true"><span>+</span><span>−</span></div>
        <span class="ol-direction" aria-hidden="true">↓</span>
        <div class="ol-ammeter">
          <span class="ol-meter-label">Current</span>
          <output class="ol-current" aria-label="Ammeter current">2 A</output>
          <span class="ol-meter-symbol" aria-hidden="true">A</span>
        </div>
        <div class="ol-resistor" aria-hidden="true">R</div>
        <label class="ol-control ol-resistance" for="${id}-resistance">
          <span>Resistance</span>
          <span class="ol-input-wrap"><input id="${id}-resistance" name="resistance" type="number" inputmode="decimal" min="0" step="any" value="6" list="${id}-resistances" aria-describedby="${id}-error" required><span>Ω</span></span>
        </label>
        <datalist id="${id}-resistances">${[1, 4.7, 6, 10, 100, 220, 330, 1000].map((value) => `<option value="${value}"></option>`).join('')}</datalist>
      </div>
      <p id="${id}-error" class="ol-error" role="status" hidden></p>
      <div class="ol-results" role="status" aria-live="polite" aria-atomic="true">
        <div class="ol-power"><span>Total power</span><output data-value="power">24 W</output><small>P = V × I</small></div>
        <dl class="ol-summary">
          ${[['voltage', 'Voltage', '12 V'], ['current', 'Current', '2 A'], ['resistance', 'Resistance', '6 Ω'], ['power', 'Power', '24 W']].map(([key, label, value]) => `<div><dt>${label}</dt><dd data-summary="${key}">${value}</dd></div>`).join('')}
        </dl>
      </div>
      <p class="ol-note">I = V / R · Ideal DC circuit with one resistor.</p>
    `;
    const voltage = this.querySelector('[name="voltage"]');
    const resistance = this.querySelector('[name="resistance"]');
    const error = this.querySelector('.ol-error');
    const update = () => {
      let result = {};
      try {
        result = calculateOhmsLaw(voltage.valueAsNumber, resistance.valueAsNumber);
        error.hidden = true;
        error.textContent = '';
      } catch (problem) {
        error.hidden = false;
        error.textContent = problem.message;
      }
      voltage.setAttribute('aria-invalid', String(!Number.isFinite(voltage.valueAsNumber) || voltage.valueAsNumber < 0));
      resistance.setAttribute('aria-invalid', String(!Number.isFinite(resistance.valueAsNumber) || resistance.valueAsNumber <= 0));
      const meter = this.querySelector('.ol-current');
      meter.textContent = formatQuantity(result.current, 'A');
      meter.style.fontSize = `${Math.min(22, 130 / meter.textContent.length)}px`;
      this.querySelector('[data-value="power"]').textContent = formatQuantity(result.power, 'W');
      for (const [key, unit] of Object.entries({ voltage: 'V', current: 'A', resistance: 'Ω', power: 'W' })) {
        this.querySelector(`[data-summary="${key}"]`).textContent = formatQuantity(result[key], unit);
      }
    };
    this.addEventListener('input', update);
    for (const input of [voltage, resistance]) {
      input.addEventListener('wheel', (event) => {
        if (document.activeElement !== input || event.ctrlKey || event.metaKey || !event.deltaY) return;
        event.preventDefault();
        const value = Number.isFinite(input.valueAsNumber) ? input.valueAsNumber : 0;
        const step = event.shiftKey ? 0.1 : 1;
        const next = Number((value - Math.sign(event.deltaY) * step).toFixed(12));
        if (input === resistance && next <= 0) return;
        input.value = String(Math.max(0, next));
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }, { passive: false });
    }
    update();
  }
}
if (!customElements.get('ohms-law-calculator')) customElements.define('ohms-law-calculator', OhmsLawCalculator);
