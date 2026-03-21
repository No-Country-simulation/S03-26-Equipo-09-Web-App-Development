# src/store

Este directorio contiene los stores globales de estado (por ejemplo, con Zustand) del frontend del CRM.

Uso recomendado en este proyecto:

- Estado de sesion y usuario autenticado.
- Preferencias globales de interfaz (idioma, filtros persistentes, tema si aplica).
- Estado transversal de modulos como inbox unificado o pipeline cuando no conviene mantenerlo en estado local.

Evita guardar aqui estado puramente visual o temporal de un componente especifico.
