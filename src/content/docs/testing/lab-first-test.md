---
title: Práctica · tu primera prueba
description: Escribe una prueba que falle, hazla pasar, y córrela como lo haría CI.
type: practice
level: beginner
module: testing
tools: [node, testing]
prerequisites: [testing.pyramid]
learningObjectives:
  - Escribir una prueba de unidad que falle por la razón correcta.
  - Hacerla pasar con el cambio mínimo en el código.
  - Ejecutar la suite como lo haría CI.
takeaways:
  - Una prueba debe fallar antes de pasar, para probar que prueba algo.
  - El ciclo rojo-verde convierte una intención en evidencia.
  - Correr la suite localmente anticipa lo que hará CI.
---

## Objetivo

Vas a escribir una prueba que primero falla (rojo), luego el código que la hace pasar (verde), usando el runner de pruebas incluido en Node. Sin instalar dependencias.

## Requisitos

- Node 18 o superior (trae `node --test` incorporado).

## Paso 1 · una prueba que falla

```bash
mkdir -p /tmp/atlas-test-lab && cd /tmp/atlas-test-lab
cat > sum.mjs <<'EOF'
export function sum(numbers) {
  // todavía sin implementar
}
EOF
cat > sum.test.mjs <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sum } from './sum.mjs';

test('suma ignora valores nulos', () => {
  assert.equal(sum([1, null, 2]), 3);
});
EOF
node --test
```

Debe fallar: la afirmación no se cumple porque `sum` aún no hace nada. Una prueba que falla por la razón correcta demuestra que realmente prueba algo.

## Paso 2 · hazla pasar (verde)

```bash
cat > sum.mjs <<'EOF'
export function sum(numbers) {
  return numbers.filter((n) => typeof n === 'number').reduce((a, b) => a + b, 0);
}
EOF
node --test
```

Ahora pasa. Recorriste el ciclo **rojo → verde**: la prueba definió el comportamiento antes que el código.

## Paso 3 · corre la suite como CI

```bash
node --test   # el mismo comando que pondrías en un job de CI
```

CI ejecutaría exactamente esto en un entorno limpio. Si pasa localmente con dependencias fijadas, pasará en CI.

## Cuando algo no cuadra

| Síntoma | Causa probable | Qué mirar |
| --- | --- | --- |
| La prueba pasa sin implementar nada | No afirma lo que crees | el `assert` |
| `Cannot find module` | Ruta o extensión del import | el `from './sum.mjs'` |
| Pasa local, falla en CI | Dependencia o entorno | lockfile y versión de Node |

## Comprueba lo que entendiste

<details>
<summary>Escribiste la prueba y pasó a la primera, sin tocar el código. Qué deberías sospechar?</summary>

Que la prueba no está afirmando lo que crees: si pasa sin implementación, no protege ese comportamiento. Ajústala hasta que falle por la razón correcta, y recién entonces implementa.

</details>

## Limpieza

```bash
rm -rf /tmp/atlas-test-lab
```
