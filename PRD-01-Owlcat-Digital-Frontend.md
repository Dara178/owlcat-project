# PRD 1 — Owlcat Digital: Frontend

## 1. Resumen

Owlcat Digital será una mascota virtual evolutiva inspirada visualmente en la imagen de referencia `images (4).jpg`: un gato pequeño, expresivo, cálido y con apariencia de compañero digital. El frontend será una SPA construida con Vite, ReactJS, JavaScript y React Compiler, desplegable en Vercel y consumiendo una API REST de Laravel.

El objetivo del MVP es que una persona pueda registrarse, adoptar un Owlcat, nombrarlo, ver sus variables emocionales, interactuar con él, ganar experiencia, desbloquear habilidades y consultar un diario emocional.

## 2. Objetivo y alcance

### Objetivo

Crear una experiencia simple, agradable y mantenible que haga sentir al usuario que está cuidando una mascota que reacciona, aprende y evoluciona.

### MVP obligatorio

- Registro, inicio y cierre de sesión.
- Adopción y nombramiento de un Owlcat.
- Panel principal con personaje, estado emocional y variables.
- Acciones: acariciar, jugar, hablar y cuidar.
- Respuesta visual y textual después de cada acción.
- Actualización de felicidad, energía, curiosidad, aburrimiento, vínculo y experiencia.
- Nivel, etapa evolutiva y habilidades desbloqueadas.
- Diario emocional automático.
- Manejo de estados de carga, errores, sesión expirada y API no disponible.
- Despliegue del frontend en Vercel.

### Opcional

- Personalización de color o accesorio.
- Sonidos activables.
- Misiones diarias.
- PWA instalable.
- Estadísticas históricas simples.

### Futuro

- Reconocimiento de voz avanzado.
- IA conversacional compleja.
- Multiplayer o visitas entre mascotas.
- Hardware físico, sensores y dispositivos IoT.
- Tienda, economía interna o pagos.

## 3. Arquitectura frontend

```text
Browser
  └── React SPA / Vite / React Compiler
        ├── React Router
        ├── Context + hooks de dominio
        ├── cliente HTTP REST
        └── API Laravel expuesta temporalmente con ngrok
```

El frontend no debe contener reglas definitivas de experiencia, evolución o emociones. Puede mostrar predicciones visuales, pero el backend es la fuente de verdad.

## 4. Stack y convenciones

- Vite.
- ReactJS con JavaScript.
- React Compiler habilitado según la configuración soportada por la versión elegida.
- React Router para navegación.
- `fetch` o Axios; elegir uno y mantenerlo en todo el proyecto. Para el MVP se recomienda `fetch` para reducir dependencias.
- CSS Modules o CSS normal organizado por componentes. No se requiere una librería UI.
- ESLint y formateador configurados desde el inicio.
- Variables de entorno con prefijo `VITE_`.

## 5. Estructura de carpetas propuesta

```text
src/
├── app/
│   ├── App.jsx
│   ├── router.jsx
│   └── providers.jsx
├── assets/
│   ├── owlcat-reference.jpg
│   └── owlcat-states/
├── components/
│   ├── layout/AppShell.jsx
│   ├── auth/ProtectedRoute.jsx
│   ├── owlcat/OwlcatAvatar.jsx
│   ├── owlcat/OwlcatStatus.jsx
│   ├── owlcat/InteractionBar.jsx
│   ├── owlcat/StatBar.jsx
│   ├── owlcat/EmotionBadge.jsx
│   ├── evolution/LevelProgress.jsx
│   ├── skills/SkillCard.jsx
│   ├── journal/JournalEntry.jsx
│   └── feedback/Toast.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── OwlcatContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useOwlcat.js
│   └── useApi.js
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── AdoptPage.jsx
│   ├── DashboardPage.jsx
│   ├── JournalPage.jsx
│   ├── SkillsPage.jsx
│   └── NotFoundPage.jsx
├── services/
│   ├── apiClient.js
│   ├── authService.js
│   └── owlcatService.js
├── utils/
│   ├── emotion.js
│   ├── formatters.js
│   └── storage.js
├── styles/
│   ├── tokens.css
│   └── global.css
└── main.jsx
```

## 6. Páginas y navegación

Rutas públicas:

- `/` — presentación breve y llamada a adoptar.
- `/login` — inicio de sesión.
- `/register` — registro.

Rutas protegidas:

- `/adopt` — crear mascota y asignar nombre.
- `/dashboard` — pantalla principal de interacción.
- `/journal` — diario emocional.
- `/skills` — habilidades desbloqueadas y bloqueadas.

Si el usuario autenticado no tiene mascota, `/dashboard` redirige a `/adopt`. Si tiene mascota, `/adopt` redirige al dashboard.

## 7. Estado global

`AuthContext` debe conservar:

- `user`.
- `token`.
- `isAuthenticated`.
- `login()`, `register()`, `logout()`.
- estado de inicialización.

`OwlcatContext` debe conservar:

- `owlcat` completo recibido del backend.
- `skills`.
- `recentJournalEntries`.
- `isLoading`.
- `lastInteractionResult`.
- `refreshOwlcat()`.
- `interact(type, message)`.

No guardar permanentemente el estado emocional en `localStorage`; solo conservar el token si se adopta la estrategia elegida. Para un MVP se acepta `localStorage`, documentando que una versión productiva debería considerar cookies HttpOnly.

## 8. Autenticación

Flujo:

1. Registro o login mediante API.
2. Laravel devuelve usuario y token.
3. El cliente guarda el token y lo añade como `Authorization: Bearer <token>`.
4. `ProtectedRoute` valida que exista sesión.
5. Ante `401`, se limpia la sesión y se redirige a `/login`.
6. Logout elimina el token local y vuelve a `/`.

La interfaz debe informar errores de credenciales sin revelar si un correo está registrado.

## 9. Cliente API

`apiClient.js` debe centralizar:

- URL base.
- headers JSON.
- token.
- timeout razonable.
- parseo de errores.
- respuesta de red caída.

Ejemplo de uso:

```js
const result = await apiClient.post('/api/owlcats/1/interactions', {
  type: 'play'
});
```

El cliente debe distinguir:

- validación `422`;
- no autenticado `401`;
- prohibido `403`;
- no encontrado `404`;
- conflicto `409`;
- error de servidor `500`;
- API inaccesible o timeout.

## 10. Dashboard y experiencia de usuario

La pantalla principal debe priorizar al Owlcat. Layout recomendado:

1. Header con nombre de usuario, nivel de Owlcat y logout.
2. Área central con avatar grande y estado emocional.
3. Burbuja de diálogo con una respuesta breve.
4. Cuatro botones de acción: Acariciar, Jugar, Hablar y Cuidar.
5. Tarjetas o barras de variables.
6. Progreso de experiencia y etapa evolutiva.
7. Accesos al diario y habilidades.

Diseño:

- estética amable, fondos claros y colores cálidos;
- alto contraste para textos y controles;
- botones grandes y comprensibles;
- interfaz usable en móvil primero;
- evitar sobrecargar al usuario con números técnicos;
- mostrar etiquetas humanas además de valores numéricos.

## 11. Animaciones de Owlcat

El MVP puede implementarse con CSS y pequeñas imágenes o sprites, sin motor 3D.

Estados visuales mínimos:

- `idle`: respiración suave o movimiento de cola;
- `happy`: salto corto, ojos brillantes;
- `sad`: orejas bajas y movimiento lento;
- `curious`: inclinación de cabeza;
- `affectionate`: acercamiento, corazón o ronroneo visual;
- `sleepy`: ojos semicerrados y animación lenta;
- `playing`: rebote o giro;
- `evolving`: brillo temporal y mensaje de celebración.

La animación se selecciona a partir de `current_emotion` y de la acción recién ejecutada. Debe respetarse `prefers-reduced-motion`.

## 12. Sistema emocional en la interfaz

El backend devuelve una emoción principal y una explicación corta. El frontend traduce el identificador a etiqueta, color, icono y animación.

Ejemplo de mapa:

```js
const emotionPresentation = {
  happy: { label: 'Feliz', color: 'green', animation: 'happy' },
  sad: { label: 'Triste', color: 'blue', animation: 'sad' },
  bored: { label: 'Aburrido', color: 'gray', animation: 'idle' },
  curious: { label: 'Curioso', color: 'yellow', animation: 'curious' },
  affectionate: { label: 'Afectuoso', color: 'pink', animation: 'affectionate' },
  sleepy: { label: 'Con sueño', color: 'purple', animation: 'sleepy' }
};
```

Las barras deben mostrar valores de 0 a 100. El sistema no debe permitir que una variable negativa o positiva se salga de ese rango.

## 13. Interacciones

Cada acción debe deshabilitar los botones durante la petición, mostrar una respuesta y actualizar todo el estado recibido.

- Acariciar: aumenta vínculo y felicidad; puede activar afecto.
- Jugar: aumenta felicidad, curiosidad y experiencia; reduce energía.
- Hablar: aumenta vínculo y curiosidad; puede registrar una frase del usuario.
- Cuidar: recupera energía y reduce aburrimiento; representa descanso, alimento o atención.

No se recomienda actualizar valores localmente antes de confirmar la respuesta del backend. Si se desea una interfaz más fluida, usar una animación optimista solo para feedback visual y revertirla si la petición falla.

## 14. Evolución, habilidades y diario

El componente `LevelProgress` muestra experiencia actual, experiencia necesaria, nivel y etapa. Si la respuesta contiene `level_up` o `evolved`, abrir un modal de celebración.

La vista de habilidades separa:

- desbloqueadas: nombre, descripción y fecha;
- bloqueadas: nombre, requisito y progreso.

El diario muestra entradas ordenadas por fecha, con emoción, título, descripción y evento. Debe tener paginación o botón “cargar más” si crece.

## 15. Variables de entorno

```env
VITE_API_URL=http://localhost:8000
```

En Vercel:

```env
VITE_API_URL=https://tu-subdominio.ngrok-free.app
```

No incluir secretos privados en el frontend. Una URL de API no es un secreto. Si cambia la URL de ngrok, actualizar la variable en Vercel y redeployar.

## 16. Despliegue en Vercel

1. Crear repositorio y subir el frontend.
2. Importar el repositorio en Vercel.
3. Configurar el framework como Vite.
4. Configurar la variable `VITE_API_URL`.
5. Ejecutar build de producción.
6. Configurar rewrite para SPA si el proveedor lo requiere, de forma que rutas como `/dashboard` sirvan `index.html`.
7. Probar login, adopción e interacción desde el dominio público.

El backend local debe estar activo y expuesto por ngrok para que el frontend desplegado pueda consumirlo.

## 17. Criterios de aceptación frontend

- Un usuario puede registrarse, iniciar sesión y cerrar sesión.
- Un usuario sin mascota puede adoptar una y acceder al dashboard.
- Cada acción muestra loading, respuesta y valores actualizados.
- La emoción y la animación coinciden con la respuesta de la API.
- El diario refleja los eventos creados por el backend.
- La ruta protegida no es accesible sin token.
- Los errores son comprensibles y no rompen la aplicación.
- El proyecto compila y se despliega en Vercel.

## 18. Orden recomendado frontend

1. Crear Vite y configurar React Compiler, lint y estilos.
2. Crear layout, router y páginas públicas.
3. Implementar cliente API y autenticación.
4. Implementar adopción y dashboard con datos simulados.
5. Conectar dashboard con endpoints reales.
6. Agregar interacciones y estados emocionales.
7. Agregar experiencia, evolución, habilidades y diario.
8. Implementar responsive, animaciones y accesibilidad.
9. Probar contra Laravel local y luego mediante ngrok.
10. Desplegar en Vercel y validar el flujo completo.
