// Ideal DC circuit: one voltage source, one resistor, and an ideal ammeter.
export function calculateOhmsLaw(voltage, resistance) {
  if (!Number.isFinite(voltage) || voltage < 0) throw new RangeError('Enter a voltage of 0 V or greater.');
  if (!Number.isFinite(resistance) || resistance <= 0) throw new RangeError('Enter a resistance greater than 0 Ω.');
  const current = voltage / resistance;
  const power = voltage * current;
  if (!Number.isFinite(current) || !Number.isFinite(power) || (voltage > 0 && (current === 0 || power === 0))) {
    throw new RangeError('These values are outside the calculator’s numeric range.');
  }
  return { voltage, current, resistance, power };
}

export function formatQuantity(value, unit) {
  if (!Number.isFinite(value) || value < 0) return `— ${unit}`;
  const scales = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n']];
  const [scale, prefix] = value === 0 ? [1, ''] : scales.find(([size]) => value >= size) || [1, ''];
  return `${Number((value / scale).toPrecision(6))} ${prefix}${unit}`;
}
