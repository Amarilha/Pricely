import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularPreco, MARGEM_MAXIMA } from '../services/preco.js';

const perto = (a, b) => assert.ok(Math.abs(a - b) < 0.01, `${a} != ${b}`);

test('margem 0 cobra pelo menos o custo', () => {
  const r = calcularPreco({ custo: 1000, margem: 0 });
  assert.equal(r.precoSemImposto, 1000);
  assert.equal(r.lucro, 0);
  assert.equal(r.total, 1000);
});

test('margem de 30% sobre o preço de venda', () => {
  const r = calcularPreco({ custo: 1000, margem: 30 });
  perto(r.precoSemImposto, 1428.57);
  perto(r.lucro / r.precoSemImposto, 0.30);
});

test('imposto incide sobre o preço, sem contar o custo duas vezes', () => {
  const r = calcularPreco({ custo: 1000, margem: 30, impostoPct: 8 });
  perto(r.impostos, 114.29);
  perto(r.total, 1542.86);
});

test('imposto fixo (MEI) e desconto/acréscimo', () => {
  const r = calcularPreco({ custo: 1000, margem: 0, impostoFixo: 80, desconto: 50, acrescimos: 20 });
  assert.equal(r.total, 1050);
});

test('margem >= 100% não divide por zero nem fica negativa', () => {
  for (const margem of [100, 150]) {
    const r = calcularPreco({ custo: 1000, margem });
    assert.ok(Number.isFinite(r.total) && r.total > 0);
    perto(r.precoSemImposto, 1000 / (1 - MARGEM_MAXIMA / 100));
  }
});
