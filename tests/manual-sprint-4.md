# Guion de test manual — Sprint 4

Ejecutar en un móvil real (iOS y Android), con `localStorage` limpio antes de empezar
(Ajustes del navegador → borrar datos del sitio, o `#/debug` + consola: `localStorage.clear()`).

1. **Primera visita**: abrir `https://b1ingles.diviferreiro.com/` → debe aparecer la
   pantalla de onboarding ("¿Qué examen preparas?"). Elegir "PET".
2. **Home → Reading**: tras elegir, debe verse la home. Pulsar la tarjeta "Reading" →
   debe verse el listado con los textos `PET` y `AMBOS` (no debe aparecer ningún texto
   marcado solo como `EOI`).
3. **Multiple choice**: abrir el texto "A Weekend in Prague" (`multiple_choice`),
   responder las preguntas y pulsar "Enviar" → debe verse la pantalla de resultado con
   la puntuación y la revisión pregunta a pregunta (respuesta dada, respuesta correcta
   si falló, explicación si la hay).
4. **Otro texto → matching**: pulsar "Otro texto", abrir "Life in a Small Village"
   (`matching`), asignar un encabezado a cada párrafo con los desplegables y enviar →
   revisar el resultado.
5. **True/false y gapped**: repetir el mismo flujo con "Working From Home" (`true_false`)
   y "My First Day at Work" (`gapped`, huecos como desplegables dentro del propio texto).
6. **Segunda visita**: recargar la app desde cero (cerrar y reabrir, o navegar a `#/`) →
   debe ir directa a la home, sin volver a mostrar el onboarding.

Cualquier fallo encontrado en estos pasos se anota como tarea de fix antes de cerrar el sprint.
