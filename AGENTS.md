# Atlas Radiología

## Objetivo

Atlas interactivo de diagnóstico por imágenes para enseñanza médica.

## Stack

- Next.js 16
- TypeScript
- Vercel

## Arquitectura

- Los estudios se registran en `lib/atlas/studies.ts`.
- Los perfiles anatómicos van en `lib/anatomy/profiles/`.
- Las estructuras anatómicas van en `lib/anatomy/structures/`.
- Las imágenes de cada estudio van en `public/studies/<studyId>/`.
- Las anotaciones van en `annotations.json` dentro de la carpeta del estudio.

## Reglas del proyecto

- No usar `keySlices`.
- Mantener una arquitectura simple.
- Reutilizar el viewer existente para nuevos estudios.
- Evitar crear componentes innecesarios.
- No duplicar perfiles anatómicos.
- Usar `id` en inglés y `labelEs` en español.
- Mantener compatibilidad con Vercel.

## Estudios actuales

- TC tórax normal
- TC abdomen/pelvis
- RM cerebro normal

## Estudios futuros

- RX tórax
- RX osteoarticular
- RM rodilla
- Ecografía abdominal

## Modo de trabajo

Cuando propongas cambios de código, indicar siempre:

1. Archivo exacto.
2. Qué buscar.
3. Qué reemplazar.
4. Código completo final.

No mostrar sólo fragmentos si el archivo es pequeño o crítico.

## Preferencias de desarrollo

- Priorizar claridad sobre abstracción.
- Mantener TypeScript estricto.
- Resolver errores de build antes de agregar nuevas funciones.
- Si hay cambios en arquitectura, explicarlos antes.
- No modificar archivos no relacionados.