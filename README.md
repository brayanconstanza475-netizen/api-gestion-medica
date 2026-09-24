# API RESTful - Sistema de Gestión Médica (Node.js + Express)

Backend en **Express** para el Parcial #2 (Nuevas Tendencias de Programación). El documento del
docente pedía Laravel, pero el backend se hace en **Express** (según lo indicado en clase); el
frontend en Vue 3 lo hace tu compañero de equipo consumiendo esta misma API.

## 🧱 Tecnologías

- Node.js + Express
- Sequelize (ORM) + PostgreSQL
- JWT (jsonwebtoken) para autenticación
- bcryptjs para encriptar contraseñas
- express-validator para validaciones
- swagger-jsdoc + swagger-ui-express para documentación interactiva
- Jest + Supertest para pruebas automatizadas (equivalente a PHPUnit)

## 📁 Estructura del proyecto

```
api-gestion-medica/
├── src/
│   ├── config/          # conexión a BD y configuración de swagger
│   ├── controllers/     # lógica de negocio (auth, paciente, doctor, cita)
│   ├── middlewares/     # autenticación JWT, validación, manejo de errores
│   ├── models/          # modelos Sequelize + relaciones
│   ├── routes/          # definición de endpoints + documentación swagger
│   ├── validators/      # reglas de validación de cada recurso
│   ├── app.js           # configuración de Express (usado también en los tests)
│   └── server.js        # punto de entrada: conecta BD y levanta el servidor
├── tests/               # pruebas con Jest + Supertest
├── .env.example         # plantilla de variables de entorno
└── package.json
```

## 🚀 Instalación (en tu Linux)

1. Cloná/copiá el proyecto y entrá a la carpeta:
   ```bash
   cd api-gestion-medica
   ```

2. Instalá las dependencias:
   ```bash
   npm install
   ```

3. Copiá el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Configurá la conexión a la base de datos. Hay dos opciones, usá la que te aplique:

   **Opción A — Postgres en Neon (nube, recomendado si no querés instalar nada local):**

   Editá `.env` y pegá tu cadena de conexión de Neon en `DATABASE_URL` (te la da el dashboard de
   Neon al crear el proyecto):
   ```
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=postgresql://usuario:password@ep-algo-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET=una_clave_larga_y_secreta
   JWT_EXPIRES_IN=1d
   ```
   No necesitas crear la base de datos aparte: Neon ya te da una (`neondb` por defecto) y las
   tablas las crea Sequelize automáticamente al levantar el servidor.

   **Opción B — Postgres local:**

   Editá `.env`:
   ```
   PORT=3000
   NODE_ENV=development
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_NAME=gestion_medica
   DB_USER=postgres
   DB_PASSWORD=tu_password
   JWT_SECRET=una_clave_larga_y_secreta
   JWT_EXPIRES_IN=1d
   ```
   Asegurate que PostgreSQL esté corriendo y creá la base de datos vacía:
   ```bash
   sudo systemctl start postgresql
   sudo -u postgres psql -c "CREATE DATABASE gestion_medica;"
   ```

5. Levantá el servidor:
   ```bash
   npm run dev      # con nodemon (recomendado en desarrollo)
   # o
   npm start        # sin nodemon
   ```

   Al iniciar verás en consola:
   ```
   ✅ Conexion a la base de datos establecida correctamente.
   ✅ Modelos sincronizados con la base de datos.
   🚀 Servidor corriendo en http://localhost:3000
   📚 Documentacion Swagger en http://localhost:3000/api-docs
   ```

## 📚 Documentación interactiva (Swagger)

Con el servidor corriendo, abrí en el navegador:
```
http://localhost:3000/api-docs
```

Para probar los endpoints protegidos:
1. Ejecutá `POST /api/register` (o `/api/login`) directo ahí en Swagger, con el botón **Try it out**.
2. Copiá el `token` que te devuelve en la respuesta (sin comillas).
3. Click en el botón verde **Authorize** (con el candado 🔒) arriba a la derecha.
4. Pegá el token (Swagger agrega la palabra "Bearer" solo) y click en **Authorize** → **Close**.
5. Ya podés probar cualquier otro endpoint (Pacientes, Doctores, Citas, Reportes) con **Try it out**.

> También queda disponible la colección de Postman en `postman/API-Gestion-Medica.postman_collection.json`
> por si más adelante querés probar desde ahí (por ejemplo para que tu compañero pruebe la API sin
> tener que levantar el servidor y abrir Swagger él mismo).

## 👥 Trabajo en equipo (backend / frontend)

Tu compañero que hace el frontend en PrimeVue **no necesita acceso a la base de datos** (ni a Neon
ni a Postgres local) — solo necesita:
1. Que vos tengas el servidor corriendo (`npm run dev`) mientras él desarrolla.
2. La URL base de la API: `http://localhost:3000` (si están en la misma red o él corre su propia
   copia del backend) — o una URL pública si más adelante lo despliegan en algún servicio.
3. La colección de Postman (`postman/API-Gestion-Medica.postman_collection.json`) para saber
   exactamente qué mandar a cada endpoint y qué le va a responder.

Si van a trabajar cada uno desde su propia compu, lo más simple es que **cada quien tenga su propia
copia del backend corriendo localmente** (cada uno con su `.env` apuntando a su propia base de
Neon o local) — así no dependen de que la otra persona tenga la laptop prendida.

## 🔑 Endpoints principales

### Autenticación (públicas)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/register` | Registro de usuario |
| POST | `/api/login` | Inicio de sesión |
| POST | `/api/logout` | Cierre de sesión (requiere token) |

### Pacientes (requieren token)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/pacientes` | Listar pacientes |
| GET | `/api/pacientes/:id` | Obtener un paciente (con sus citas) |
| POST | `/api/pacientes` | Crear paciente |
| PUT | `/api/pacientes/:id` | Actualizar paciente |
| DELETE | `/api/pacientes/:id` | Eliminar paciente |

### Doctores (requieren token)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/doctores` | Listar doctores |
| GET | `/api/doctores/:id` | Obtener un doctor (con sus citas) |
| POST | `/api/doctores` | Crear doctor |
| PUT | `/api/doctores/:id` | Actualizar doctor |
| DELETE | `/api/doctores/:id` | Eliminar doctor |

### Citas (requieren token)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/citas` | Listar citas (con paciente y doctor) |
| GET | `/api/citas/:id` | Obtener una cita |
| POST | `/api/citas` | Crear cita (valida que la fecha no sea pasada) |
| PUT | `/api/citas/:id` | Actualizar cita |
| DELETE | `/api/citas/:id` | Eliminar cita |

### Reportes (requieren token)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/reportes/citas-por-estado` | Cantidad de citas agrupadas por estado |
| GET | `/api/reportes/citas-por-doctor` | Cantidad de citas por cada doctor |

## 🔐 Cómo usar el token JWT

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <tu_token>
```

## 🧪 Pruebas automatizadas

Las pruebas corren contra una base de datos **SQLite en memoria** (no necesitas MySQL corriendo
para las pruebas). Cubren:
- Autenticación: registro, login, logout, e invalidación de token.
- CRUD completo de pacientes y doctores.
- CRUD de citas, incluyendo la validación de que **no se puede crear una cita con fecha pasada**.
- Control de acceso: rutas protegidas rechazan peticiones sin token.
- Reportes de citas.

Para correrlas:
```bash
npm test
```

> Nota: como este sandbox no tiene acceso a internet, no pude ejecutar `npm install` ni `npm test`
> aquí mismo. Revisé la sintaxis de todos los archivos con `node --check` y no hay errores, pero
> te recomiendo correr `npm test` en tu máquina antes de grabar el video para confirmar que todo
> pasa en verde.

## ⚠️ Nota sobre PostgreSQL y el campo `estado`

El modelo `Cita` usa un tipo `ENUM` para el campo `estado` (pendiente/confirmada/cancelada/completada).
En PostgreSQL, un ENUM se crea como un **tipo de dato propio** en la base de datos (no solo una
columna). Esto tiene una consecuencia práctica: si alguna vez borrás las tablas a mano y volvés a
correr `sequelize.sync({ force: true })`, puede fallar con un error tipo `type "enum_citas_estado"
already exists`, porque Postgres borra la tabla pero no borra el tipo ENUM solo.

Si te pasa eso durante el desarrollo, la solución más simple es borrar y recrear la base de datos
completa:
```bash
sudo -u postgres psql -c "DROP DATABASE gestion_medica;"
sudo -u postgres psql -c "CREATE DATABASE gestion_medica;"
```

## 🗄️ Modelo de datos

- **Paciente** → tiene muchas **Citas** (uno a muchos)
- **Doctor** → tiene muchas **Citas** (uno a muchos)
- **Cita** → pertenece a un **Paciente** y a un **Doctor**

## 📝 Notas para el video / entrega

- Nombre del proyecto según el documento: `parcial2Vue3_#equipo` (usá ese nombre para tu repo/carpeta si el docente lo pide así).
- El compañero de frontend en Vue 3 debe consumir esta API vía Axios, usando el token que devuelven `/api/register` o `/api/login`, guardado por ejemplo en Pinia.
- Recordá subir el enlace del video en la plataforma EVA como indica el documento.
