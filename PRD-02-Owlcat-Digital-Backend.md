# PRD 2 — Owlcat Digital: Backend

## 1. Resumen

El backend será una API REST desarrollada con Laravel y MySQL. Gestionará usuarios, mascotas, estados, interacciones, experiencia, niveles, evolución, habilidades y diario emocional. Laravel será la fuente de verdad de todas las reglas del dominio; el frontend solo presentará los resultados.

El backend funcionará localmente durante el desarrollo y podrá exponerse con ngrok para que el frontend publicado en Vercel lo consuma temporalmente.

## 2. Alcance

### MVP obligatorio

- Registro, login, logout y usuario autenticado.
- Una mascota principal por usuario en la primera versión.
- Adopción y nombramiento.
- Lectura del estado completo.
- Interacciones: `pet`, `play`, `talk`, `care`.
- Actualización transaccional de variables.
- Cálculo de emoción.
- Experiencia, nivel y evolución.
- Desbloqueo automático de habilidades por nivel o etapa.
- Registro de eventos importantes en diario.
- CORS para frontend local y Vercel/ngrok.
- Validación y respuestas JSON consistentes.

### Opcional

- Varias mascotas por usuario.
- Historial completo de estados.
- Tareas diarias.
- Configuración de preferencias.

### Futuro

- WebSockets o tiempo real.
- IA conversacional avanzada.
- Reconocimiento de voz.
- Hardware y sensores.
- Multiplayer, economía o marketplace.

## 3. Arquitectura

```text
React/Vercel ──HTTPS──> ngrok ──> Laravel local ──> MySQL
                              ├── Auth
                              ├── Controllers API
                              ├── Form Requests
                              ├── Domain Services
                              ├── Eloquent Models
                              └── Resources / JSON
```

Capas recomendadas:

- Controllers: reciben la petición y delegan.
- Form Requests: validan entrada.
- Services: concentran reglas de dominio.
- Models: relaciones y persistencia.
- API Resources: forma estable de las respuestas.
- Policies: autorización por usuario y mascota.

Para el MVP, usar Laravel Sanctum con tokens personales. No incorporar microservicios, colas, Redis ni eventos complejos hasta que exista una necesidad real.

## 4. Estructura de carpetas

```text
app/
├── Http/
│   ├── Controllers/Api/
│   │   ├── AuthController.php
│   │   ├── OwlcatController.php
│   │   ├── InteractionController.php
│   │   ├── JournalController.php
│   │   └── SkillController.php
│   ├── Requests/
│   │   ├── RegisterRequest.php
│   │   ├── LoginRequest.php
│   │   ├── AdoptOwlcatRequest.php
│   │   └── InteractionRequest.php
│   └── Resources/
│       ├── UserResource.php
│       ├── OwlcatResource.php
│       ├── InteractionResultResource.php
│       └── JournalEntryResource.php
├── Models/
│   ├── User.php
│   ├── Owlcat.php
│   ├── OwlcatState.php
│   ├── Interaction.php
│   ├── Skill.php
│   ├── OwlcatSkill.php
│   ├── JournalEntry.php
│   ├── EvolutionStage.php
│   └── Level.php
├── Policies/OwlcatPolicy.php
└── Services/Owlcat/
    ├── InteractionService.php
    ├── EmotionService.php
    ├── ExperienceService.php
    ├── EvolutionService.php
    ├── SkillUnlockService.php
    └── JournalService.php
database/
├── migrations/
└── seeders/
routes/api.php
config/cors.php
```

## 5. Modelo de datos MySQL

### `users`

Usar la tabla estándar de Laravel: `id`, `name`, `email` único, `password`, timestamps.

### `owlcats`

```text
id BIGINT PK
user_id BIGINT FK users.id
name VARCHAR(50)
species VARCHAR(30) default 'owlcat'
level_id BIGINT FK levels.id
evolution_stage_id BIGINT FK evolution_stages.id
experience INT default 0
current_emotion VARCHAR(30) default 'happy'
adopted_at TIMESTAMP
timestamps
```

Índice recomendado: `user_id`. En MVP puede existir una regla de negocio que limite a una mascota por usuario.

### `owlcat_states`

Guarda el estado actual, no cada histórico.

```text
id BIGINT PK
owlcat_id BIGINT UNIQUE FK owlcats.id
happiness TINYINT UNSIGNED default 50
energy TINYINT UNSIGNED default 50
curiosity TINYINT UNSIGNED default 50
boredom TINYINT UNSIGNED default 50
bond TINYINT UNSIGNED default 0
last_interacted_at TIMESTAMP nullable
timestamps
```

En el código real el nombre de la FK debe ser `owlcat_id`; el espacio de la línea anterior es solo tipográfico y no debe copiarse.

### `interactions`

```text
id BIGINT PK
owlcat_id BIGINT FK
user_id BIGINT FK
type VARCHAR(30)
message TEXT nullable
experience_gained INT default 0
emotion_before VARCHAR(30)
emotion_after VARCHAR(30)
changes JSON
created_at TIMESTAMP
```

### `levels`

```text
id BIGINT PK
number SMALLINT UNIQUE
name VARCHAR(50)
required_experience INT
evolution_stage_id BIGINT FK
timestamps
```

### `evolution_stages`

```text
id BIGINT PK
code VARCHAR(30) UNIQUE
name VARCHAR(50)
description TEXT
min_level SMALLINT
max_level SMALLINT nullable
timestamps
```

### `skills`

```text
id BIGINT PK
code VARCHAR(40) UNIQUE
name VARCHAR(80)
description TEXT
required_level SMALLINT nullable
required_stage_id BIGINT FK evolution_stages.id nullable
timestamps
```

### `owlcat_skills`

Tabla pivote:

```text
id BIGINT PK
owlcat_id BIGINT FK
skill_id BIGINT FK
unlocked_at TIMESTAMP
UNIQUE(owlcat_id, skill_id)
```

### `journal_entries`

```text
id BIGINT PK
owlcat_id BIGINT FK
type VARCHAR(40)
title VARCHAR(120)
description TEXT
emotion VARCHAR(30) nullable
metadata JSON nullable
created_at TIMESTAMP
```

## 6. Relaciones Eloquent

- `User hasOne Owlcat` en MVP; luego puede cambiar a `hasMany`.
- `Owlcat belongsTo User`.
- `Owlcat hasOne OwlcatState`.
- `Owlcat hasMany Interactions`.
- `Owlcat belongsTo Level` y `EvolutionStage`.
- `Owlcat belongsToMany Skill` mediante `owlcat_skills`.
- `Owlcat hasMany JournalEntry`.
- `Level belongsTo EvolutionStage`.

Usar `foreignId()->constrained()->cascadeOnDelete()` donde corresponda y restricciones únicas para evitar duplicados.

## 7. Endpoints REST

### Públicos

```text
POST /api/auth/register
POST /api/auth/login
```

### Protegidos por Sanctum

```text
POST   /api/auth/logout
GET    /api/me
POST   /api/owlcats
GET    /api/owlcats/{owlcat}
POST   /api/owlcats/{owlcat}/interactions
GET    /api/owlcats/{owlcat}/journal
GET    /api/owlcats/{owlcat}/skills
GET    /api/evolution-stages
```

Todos los endpoints de mascota deben pasar por `auth:sanctum` y `OwlcatPolicy`.

## 8. Ejemplos de requests y responses

### Registro

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Ana",
  "email": "ana@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

```json
{
  "data": {
    "user": {"id": 1, "name": "Ana", "email": "ana@example.com"},
    "token": "1|example-token"
  }
}
```

### Adoptar

```http
POST /api/owlcats
Authorization: Bearer 1|example-token
Content-Type: application/json

{"name":"Michi"}
```

```json
{
  "data": {
    "id": 1,
    "name": "Michi",
    "emotion": "happy",
    "level": {"number": 1, "name": "Pequeño curioso", "experience": 0, "next_level_experience": 100},
    "stage": {"code": "hatchling", "name": "Polluelo"},
    "stats": {"happiness": 50, "energy": 50, "curiosity": 50, "boredom": 50, "bond": 0},
    "skills": []
  }
}
```

### Interacción

```http
POST /api/owlcats/1/interactions
Authorization: Bearer 1|example-token
Content-Type: application/json

{"type":"play"}
```

```json
{
  "data": {
    "interaction": {"id": 25, "type": "play", "experience_gained": 15},
    "owlcat": {
      "id": 1,
      "name": "Michi",
      "emotion": "happy",
      "stats": {"happiness": 65, "energy": 40, "curiosity": 58, "boredom": 35, "bond": 8},
      "level": {"number": 1, "experience": 45, "next_level_experience": 100},
      "stage": {"code": "hatchling", "name": "Polluelo"}
    },
    "message": "¡Michi se divirtió mucho jugando contigo!",
    "events": [],
    "unlocked_skills": []
  }
}
```

## 9. Lógica de emociones

La lógica debe ser determinista, simple y testeable. Ejemplo de prioridad:

1. `sleepy` si energía <= 20.
2. `sad` si felicidad <= 25.
3. `bored` si aburrimiento >= 75.
4. `affectionate` si vínculo >= 75 y la última acción fue `pet` o `care`.
5. `curious` si curiosidad >= 70.
6. `happy` en cualquier otro caso con felicidad >= 50.
7. `neutral` como fallback.

Los umbrales deben vivir en una configuración o clase de dominio, no dispersos en controladores.

## 10. Lógica de interacciones

Tabla inicial sugerida:

| Acción | Felicidad | Energía | Curiosidad | Aburrimiento | Vínculo | XP |
|---|---:|---:|---:|---:|---:|---:|
| pet | +8 | 0 | 0 | -5 | +6 | 5 |
| play | +15 | -12 | +8 | -20 | +5 | 15 |
| talk | +5 | -2 | +12 | -8 | +8 | 10 |
| care | +8 | +15 | 0 | -10 | +5 | 8 |

Los valores se limitan entre 0 y 100. `message` es opcional y debe tener longitud máxima razonable, por ejemplo 500 caracteres.

## 11. Experiencia, niveles y evolución

`ExperienceService` suma XP dentro de una transacción. El nivel se calcula buscando el mayor `levels.required_experience` menor o igual a la experiencia total.

Ejemplo inicial:

| Nivel | XP mínima | Etapa |
|---:|---:|---|
| 1 | 0 | Polluelo |
| 2 | 100 | Polluelo |
| 3 | 250 | Joven |
| 4 | 450 | Joven |
| 5 | 700 | Compañero |

Si el nuevo nivel cambia de etapa, `EvolutionService` actualiza `evolution_stage_id`, crea una entrada de diario y devuelve `evolved: true`.

## 12. Desbloqueo de habilidades

`SkillUnlockService` revisa después de cada interacción si el Owlcat cumple requisitos de nivel o etapa. Inserta en `owlcat_skills` usando una operación idempotente.

Ejemplos:

- nivel 2: `soft_purr`;
- nivel 3: `curious_question`;
- etapa joven: `playful_dash`;
- etapa compañero: `emotional_memory`.

No permitir al cliente desbloquear habilidades enviando un `skill_id`; el backend decide todo.

## 13. Diario emocional

Crear entrada cuando ocurra uno de estos eventos:

- adopción;
- primera interacción;
- cambio de emoción significativo;
- subida de nivel;
- evolución;
- desbloqueo de habilidad;
- ausencia de interacción prolongada, si se implementa más adelante.

El diario debe guardar texto legible y `metadata` para datos estructurados. La consulta debe devolver paginación ordenada de más reciente a más antigua.

## 14. Flujo transaccional de interacción

```text
Request autenticada
  → validar tipo y mensaje
  → autorizar que la mascota pertenece al usuario
  → abrir transacción
  → bloquear/leer estado actual
  → aplicar modificadores de acción
  → calcular emoción
  → registrar interacción
  → sumar XP y calcular nivel
  → actualizar evolución
  → desbloquear habilidades
  → crear entradas de diario relevantes
  → commit
  → devolver estado completo
```

Si alguna operación falla, hacer rollback y devolver un error consistente. Esto evita que se registre XP sin guardar la interacción o que se desbloquee una habilidad a medias.

## 15. Validaciones y errores

Validaciones mínimas:

- nombre de usuario requerido y longitud limitada;
- email válido y único;
- contraseña confirmada;
- nombre de Owlcat requerido, entre 1 y 50 caracteres;
- tipo de interacción incluido en enum permitido;
- mensaje opcional con máximo 500 caracteres;
- mascota perteneciente al usuario autenticado.

Formato de error:

```json
{
  "message": "Los datos enviados no son válidos.",
  "errors": {
    "type": ["La interacción seleccionada no es válida."]
  }
}
```

No devolver trazas ni detalles de SQL en producción.

## 16. CORS y ngrok

Configurar `config/cors.php` para permitir:

- `http://localhost:5173` durante desarrollo;
- el dominio de Vercel del proyecto;
- el dominio personalizado si se agrega.

Usar variables de entorno para la lista de orígenes y no permitir `*` junto con credenciales.

Flujo local:

```text
php artisan serve --host=0.0.0.0 --port=8000
ngrok http 8000
```

Copiar la URL HTTPS generada por ngrok a `VITE_API_URL` en Vercel. Si la URL cambia, actualizarla y redeployar. ngrok es una solución de desarrollo/prototipo; para producción se debe desplegar Laravel en un servidor.

## 17. Variables de entorno

```env
APP_NAME=OwlcatDigital
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=owlcat_digital
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173
FRONTEND_URL=http://localhost:5173
```

Para probar con Vercel, agregar el dominio correspondiente en la configuración de CORS y, si aplica, en dominios stateful de Sanctum. Con tokens Bearer, el frontend no depende de cookies stateful para el MVP.

## 18. Flujo React → Laravel → MySQL

```text
Usuario pulsa “Jugar”
  → React envía POST con Bearer token
  → ngrok reenvía a Laravel
  → middleware autentica
  → controller valida y llama InteractionService
  → service actualiza owlcat_states, interactions y owlcats
  → service inserta journal_entries y owlcat_skills si corresponde
  → Laravel devuelve JSON
  → React reemplaza el estado local y muestra animación
```

## 19. Seeder inicial

Crear seeders para:

- niveles 1 a 5;
- etapas `hatchling`, `young`, `companion`;
- habilidades iniciales;
- un usuario de prueba opcional solo en entorno local.

Esto permite desarrollar el frontend sin crear manualmente todos los registros.

## 20. Pruebas mínimas

- registro y login válidos e inválidos;
- usuario no puede leer otra mascota;
- adopción con nombre válido y duplicada;
- cada tipo de interacción cambia los valores esperados;
- valores nunca salen de 0 a 100;
- XP provoca subida de nivel correctamente;
- cambio de etapa crea diario;
- habilidad no se duplica;
- error de validación devuelve `422`;
- endpoint protegido sin token devuelve `401`.

## 21. Orden recomendado de desarrollo backend

1. Crear proyecto Laravel y conectar MySQL.
2. Instalar/configurar Sanctum.
3. Crear migraciones, modelos, relaciones y seeders.
4. Implementar registro, login, logout y `/api/me`.
5. Implementar adopción y consulta de Owlcat.
6. Implementar `InteractionService` con estados e interacción.
7. Agregar emociones y diario.
8. Agregar XP, niveles y evolución.
9. Agregar habilidades y desbloqueos.
10. Agregar Policies, Resources, errores y pruebas.
11. Configurar CORS y probar desde Vite local.
12. Exponer con ngrok y conectar Vercel.

## 22. Criterios de aceptación backend

- La API permite completar el flujo registro → adopción → interacción.
- Las reglas importantes se ejecutan en servicios y transacciones.
- El cliente nunca puede modificar directamente XP, nivel, emoción o habilidades.
- Las respuestas mantienen una estructura JSON estable.
- MySQL conserva el estado actual y el historial de interacciones/eventos.
- CORS permite el frontend autorizado.
- El backend funciona localmente y es consumible mediante la URL HTTPS de ngrok.
