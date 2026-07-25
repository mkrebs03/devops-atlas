---
title: La pirámide de pruebas
description: Unidad, integración y extremo a extremo, y cómo elegir el nivel correcto.
type: concept
level: intermediate
module: testing
tools: [testing]
prerequisites: [foundations.linux-cli]
learningObjectives:
  - Distinguir pruebas de unidad, integración y extremo a extremo.
  - Elegir el nivel de prueba según el costo y la confianza que aporta.
  - Reconocer una prueba frágil y por qué ralentiza al equipo.
takeaways:
  - Muchas pruebas rápidas y pocas lentas mantienen el feedback ágil.
  - Cada nivel de prueba responde una pregunta distinta sobre el sistema.
  - Una prueba frágil cuesta más de lo que protege.
---

## Tres niveles, tres preguntas

```mermaid
flowchart TB
  E["Extremo a extremo · pocas"] --> I["Integración · algunas"] --> U["Unidad · muchas"]
```

- **Unidad**: prueba una función o módulo aislado. Rápida, precisa, barata. Responde: ¿esta pieza hace lo que digo?
- **Integración**: prueba que varias piezas colaboran (por ejemplo, código más base de datos). Responde: ¿encajan entre sí?
- **Extremo a extremo (E2E)**: prueba el sistema como lo usa una persona. Lenta y valiosa. Responde: ¿el recorrido completo funciona?

La forma de pirámide no es estética: quieres **muchas** pruebas de unidad (rápidas) y **pocas** E2E (lentas). Invertir la pirámide —casi todo E2E— produce suites lentas y frágiles.

## Qué hace buena a una prueba

- **Determinista**: mismo input, mismo resultado, sin depender de la hora o de la red.
- **Aislada**: no depende del orden ni de otra prueba.
- **Legible**: su nombre dice qué comportamiento protege.

```js
// una prueba de unidad: el nombre describe el comportamiento esperado
test('suma ignora valores nulos', () => {
  expect(sum([1, null, 2])).toBe(3);
});
```

## Pruebas frágiles: el costo oculto

Una prueba **frágil** falla por razones ajenas al comportamiento: un timeout, un selector que cambió, un dato aleatorio. Cada falla falsa erosiona la confianza hasta que el equipo ignora la suite, y entonces no protege nada. Prefiere pocas pruebas confiables antes que muchas ruidosas.

:::caution No pruebes la implementación, prueba el comportamiento
Una prueba atada a detalles internos se rompe con cada refactor, aunque el comportamiento no cambie. Afirma qué hace el sistema, no cómo lo hace.
:::

## Comprueba lo que entendiste

<details>
<summary>Tu suite E2E tarda 40 minutos y falla al azar. Qué reequilibrio propones?</summary>

Mover la mayoría de las comprobaciones a pruebas de unidad e integración (rápidas y deterministas) y dejar solo unos pocos E2E para los recorridos críticos. La pirámide se sostiene sobre muchas pruebas rápidas, no sobre muchas lentas.

</details>

<details>
<summary>Una prueba se rompe cada vez que renombras una variable interna. Qué está mal?</summary>

Está probando la implementación, no el comportamiento. Reescríbela para afirmar el resultado observable (entradas y salidas), de modo que un refactor que no cambia el comportamiento no la rompa.

</details>

## Sigue explorando

- [The Practical Test Pyramid (Martin Fowler)](https://martinfowler.com/articles/practical-test-pyramid.html) — el artículo de referencia.
- [Google Testing Blog](https://testing.googleblog.com/) — prácticas de prueba a escala.
