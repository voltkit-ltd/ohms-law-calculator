import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOhmsLaw, formatQuantity } from './core.js';

test('calculates current and power for default, fractional, and zero-voltage circuits', () => {
  assert.deepEqual(calculateOhmsLaw(12, 6), { voltage: 12, current: 2, resistance: 6, power: 24 });
  assert.deepEqual(calculateOhmsLaw(24, 6), { voltage: 24, current: 4, resistance: 6, power: 96 });
  assert.equal(calculateOhmsLaw(5, 1000).current, 0.005);
  assert.equal(calculateOhmsLaw(5, 1000).power, 0.025);
  assert.equal(calculateOhmsLaw(1.5, 0.5).power, 4.5);
  assert.equal(calculateOhmsLaw(0, 6).current, 0);
  assert.equal(calculateOhmsLaw(0, 6).power, 0);
});

test('rejects invalid input, short circuits, overflow, and underflow', () => {
  for (const [voltage, resistance] of [[12, 0], [12, -1], [-12, 6], [NaN, 6], [12, NaN], [Infinity, 6], [12, Infinity], [1e308, 1e-308], [1e-300, 1e300]]) {
    assert.throws(() => calculateOhmsLaw(voltage, resistance), RangeError);
  }
});

test('formats SI prefixes and missing values without rounding artifacts', () => {
  for (const [value, unit, expected] of [[2, 'A', '2 A'], [24, 'W', '24 W'], [0, 'A', '0 A'], [0.005, 'A', '5 mA'], [0.025, 'W', '25 mW'], [1e-6, 'A', '1 µA'], [1e-9, 'A', '1 nA'], [1000, 'Ω', '1 kΩ'], [1e6, 'W', '1 MW'], [1e9, 'W', '1 GW'], [0.1 + 0.2, 'A', '300 mA'], [NaN, 'A', '— A'], [Infinity, 'W', '— W']]) {
    assert.equal(formatQuantity(value, unit), expected);
  }
});
