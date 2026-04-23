# Corte 3: Despliegue en la Nube

# 🐾 WardenPet - Sistema de Gestión de Mascotas

Sistema completo de gestión y cuidado de mascotas con Backend Node.js, Frontend Next.js y Base de Datos PostgreSQL.

## Estructura del Proyecto

```
wardenpet/
├── Backend/                 ← Servidor API (Node.js Express)
│   ├── .env                 (Puerto 3001)
│   ├── package.json
│   ├── index.js
│   ├── config/              (DB config)
│   ├── controllers/         (Lógica de negocio)
│   ├── routes/              (Endpoints de API)
│   └── middlewares/         (JWT, autenticación)
│
├── FrontendWardenPet/       ←  Interfaz Web (Next.js React)
│   ├── .env.local           (Puerto 3000)
│   ├── package.json
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx     (Página principal)
│   │   ├── components/      (Componentes React)
│   │   └── services/        (Llamadas a API)
│   └── public/
│
├── Base de datos/           ← PostgreSQL (Docker)
│   ├── docker-compose.yml   (Puerto 5433)
│   ├── .env
│   ├── WardenPet.sql        (Tablas)
│   └── init-admin.sql
│
└── README.md (Este archivo)
```

## 1. Arquitectura y Dominio Técnico

> *"Para este corte, migramos el sistema de un entorno local a una **Arquitectura Cloud Serverless**. Separamos la aplicación en tres capas independientes:*
> 
> 1. *El **Frontend (Capa de Presentación)** está desarrollado en Next.js y alojado en la Edge Network de **Vercel**.*
> 2. *El **Backend (Capa Lógica)** está construido con Node.js y Express. Lo desplegamos también en **Vercel** usando Serverless Functions, lo que significa que el servidor no está encendido 24/7 gastando recursos, sino que se ejecuta por demanda cuando recibe una petición.*
> 3. *La **Base de Datos (Capa de Persistencia)** es un motor PostgreSQL alojado de forma remota en **Render**."*

### Explicación del CORS y Seguridad
> *"Al separar el Frontend y el Backend en distintos dominios, tuvimos que implementar una estricta política de **CORS**. Configuramos las cabeceras directamente en la infraestructura de Vercel (en el `vercel.json`) para garantizar que la API solo acepte peticiones desde el dominio exacto del Frontend. Además, la comunicación entre el Backend en Vercel y la base de datos en Render está encriptada mediante SSL (`rejectUnauthorized: false`), protegiendo los datos en tránsito."*

---

## 2. Demostracion del funcionamiento (Validación de los 23 Endpoints)

### Módulo 1: Autenticación (Auth)
1. **Prueba 1 (POST `/api/auth/register`):** Ve al Registro y crea un usuario. Muestra en la pestaña "Network" (F12) cómo viaja la petición.
2. **Prueba 2 (POST `/api/auth/login`):** Inicia sesión. Muestra en "Application > Local Storage" cómo el Backend devuelve un token JWT firmado.
3. **Prueba 3 (GET `/api/auth/me`):** Refresca la página. El Frontend manda el token JWT y el Backend te mantiene logueado.

### Módulo 2: Mascotas (Pets CRUD)
4. **Prueba 4 (POST `/api/pets`):** Crea una nueva mascota (Nombre, Tipo, Edad).
5. **Prueba 5 (GET `/api/pets`):** Abre la lista de mascotas. Explica que el backend usa el `user_id` del token para solo devolver tus mascotas (privacidad).
6. **Prueba 6 (GET `/api/pets/:id`):** Entra a ver los detalles específicos de esa mascota.
7. **Prueba 7 (PUT `/api/pets/:id`):** Edita el peso o la raza y guarda los cambios.
8. **Prueba 8 (DELETE `/api/pets/:id`):** Elimina la mascota de prueba.

### Módulo 3: Historial Médico (Health Records CRUD)
9. **Prueba 9 (POST `/api/health-records`):** Registra una vacuna o síntoma asociado a una mascota existente.
10. **Prueba 10 (GET `/api/health-records`):** Lista el historial. Explica que esto hace un `JOIN` SQL en Render con la tabla `pets`.
11. **Prueba 11 (GET `/api/health-records/:id`):** Obtén los detalles de un registro específico.
12. **Prueba 12 (PUT `/api/health-records/:id`):** Modifica la temperatura o fecha del registro médico.
13. **Prueba 13 (DELETE `/api/health-records/:id`):** Elimina el registro de salud.

### Módulo 4: Recordatorios (Reminders CRUD)
14. **Prueba 14 (POST `/api/reminders`):** Crea un recordatorio (ej. "Cita con el veterinario").
15. **Prueba 15 (GET `/api/reminders`):** Visualiza los recordatorios en el sistema.
16. **Prueba 16 (PUT `/api/reminders/:id`):** Modifica o marca el recordatorio.
17. **Prueba 17 (DELETE `/api/reminders/:id`):** Borra el recordatorio.

### Módulo 5: Rutinas (Routines CRUD)
18. **Prueba 18 (POST `/api/routines`):** Añade una rutina (ej. "Paseo diario a las 7am").
19. **Prueba 19 (GET `/api/routines`):** Verifica que aparece listada para el usuario.
20. **Prueba 20 (PUT `/api/routines/:id`):** Actualiza la hora de la rutina.
21. **Prueba 21 (DELETE `/api/routines/:id`):** Elimina la rutina.

### Módulo 6: Panel de Administración (Users API)
22. **Prueba 22 (GET `/api/users`):** Si ingresas con la cuenta del administrador (`admin@wardenpet.com`), muestra cómo el Backend te permite listar a todos los usuarios.
23. **Prueba 23 (DELETE `/api/users/:id`):** Demuestra que el admin puede eliminar cuentas de usuarios, validando los permisos del middleware `adminOnly`.

*"Con esto comprobamos que toda nuestra arquitectura API RESTful está 100% operativa. Los 6 controladores separados funcionan correctamente ejecutando operaciones CRUD, enviando consultas asíncronas a la base de datos remota en Render, usando el mismo pool de conexiones seguro y validando siempre el JWT en cada paso."*

---

## 3. Conflictos y Soluciones

**Pregunta 1: "¿Tuvieron algún problema subiendo el backend?"**
> *"Sí, en local exportábamos la base de datos como un objeto completo. Al subir a producción, la ruta de los controladores se rompía dando un error TypeError al ejecutar `pool.query`. Lo corregimos utilizando desestructuración (`const { pool } = require(...)`), aislando correctamente la instancia de conexión, y ajustando las cabeceras CORS directamente en Vercel."*

**Pregunta 2: "¿Qué pasa si Vercel se reinicia? ¿Se pierden los datos?"**
> *"No. Vercel es un entorno efímero (Serverless), se apaga tras cada ejecución. Sin embargo, no perdemos datos porque nuestro Backend es 'Stateless'. Toda la persistencia de datos vive externamente en el clúster de PostgreSQL en Render."*

**Pregunta 3: "¿Cómo ocultaron las contraseñas de la base de datos?"**
> *"Nunca subimos credenciales al código en GitHub. En producción configuramos **Environment Variables** directamente en el dashboard encriptado de Vercel (`DATABASE_URL` y `JWT_SECRET`). El código las lee dinámicamente usando `process.env`."*

---