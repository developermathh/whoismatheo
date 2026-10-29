# whoismatheo

Web estática (HTML/CSS/JS, sin build ni dependencias) + funciones serverless de Vercel en `api/`.
Los ajustes visibles están al principio de `script.js` (`CONFIG`). Los cinco idiomas (EN, ES, RU, DE, FR) se conservan; las traducciones existentes no se han tocado.

**Ya no hay Spotify Web API, ni OAuth de Spotify, ni Premium.** La canción actual sale de tu actividad de Spotify en Discord.

## Cómo funciona la detección de Discord (existente, conservada)

1. El navegador abre el WebSocket público de **Lanyard** (`wss://api.lanyard.rest/socket`) y se suscribe a tu ID (`CONFIG.discordUserId`). Lanyard refleja tu presencia de Discord: estado, estado personalizado, actividades y, cuando escuchas Spotify, el objeto `spotify` (`song`, `artist`, `album`, `album_art_url`, `track_id`, `timestamps`). Funciona también cuando usas Discord en el móvil Android.
2. `script.js` pinta ese objeto en la tarjeta (título, artista, álbum, portada, enlace y progreso). El enlace se construye con `track_id` (`https://open.spotify.com/track/<id>`), **sin llamar a Spotify**. El progreso solo aparece si Discord envía inicio y fin.
3. Requisito de Lanyard: estar en su servidor `discord.gg/lanyard` (ya lo estás, es lo que hacía funcionar la tarjeta).

## Arquitectura

| Parte | Archivos |
|---|---|
| Web | `index.html`, `style.css`, `script.js` |
| Reproductor local | `audio/the-kill-2.mp3` (independiente de todo lo demás) |
| Perfil público de Discord | `api/profile.js` → `GET /api/profile` |
| Historial "Recently Played" | `api/recent.js` → `GET /api/recent` |
| Registro opcional sin visitas | `api/track.js` → `GET /api/track` (protegido, 404 si no lo activas) |
| Utilidades | `api/_lib/` (`lanyard.js`, `history.js`, `storage.js`, `sync.js`, `badges.js`, `http.js`; el `_` evita que sean rutas públicas) |
| Seguridad / Vercel | `vercel.json`, `.gitignore`, `.vercelignore`, `.env.example` |
| Pruebas (no se despliegan) | `tests/api.test.js`, `tests/client.test.js` |

## Qué información de Discord se puede obtener (y cuál no)

| Dato | Estado | Fuente |
|---|---|---|
| Avatar, usuario, nombre visible | ✅ | Lanyard (y API oficial si hay bot token) |
| Estado online / ausente / no molestar / offline | ✅ tiempo real | Lanyard |
| Estado personalizado (texto + emoji Unicode) | ✅ | Lanyard |
| Actividad actual (juego, app) | ✅ | Lanyard |
| Canción de Spotify (título, artista, álbum, portada, enlace, progreso) | ✅ | Lanyard |
| Decoración del avatar | ✅ si tienes una | Lanyard / API oficial |
| Insignias públicas que Discord incluye en `public_flags` (HypeSquad, Active Developer, Early Supporter, Bug Hunter, etc.) | ✅ solo las que tengas | Lanyard / API oficial |
| **Banner real** (animado si es GIF) y color de acento | ✅ **requiere un bot token** (ver paso 2) | API oficial `GET /users/{id}` |
| **Biografía ("Sobre mí")** | ❌ no disponible | Ninguna API oficial ni pública la expone. Solo se obtiene con endpoints internos o token de usuario, que no se usan. No se muestra nada inventado. |
| Insignias de Nitro, Boost, Quests, Orbs, nombre de usuario antiguo | ❌ no disponibles | No están en `public_flags`; no se muestran ni se adivinan. |

Si el banner no está disponible (sin bot token, sin banner en tu perfil o error de Discord), la tarjeta muestra un fondo discreto con tu color de acento si se conoce. **Nunca** se usa una imagen de ejemplo.

## Qué tienes que configurar tú (pasos manuales)

### 1. Base de datos del historial (obligatorio para "Recently Played")
Vercel no permite guardar datos en archivos locales (se pierden), así que el historial vive en **Upstash Redis**.
- Coste: tiene plan gratuito. No he podido comprobar los límites y precios actuales desde aquí: revísalos en https://upstash.com/pricing antes de crear la base. El uso de esta web es muy pequeño (unos pocos comandos Redis por consulta, y el CDN de Vercel cachea `/api/recent` 8 s). Alternativa: Vercel Marketplace también ofrece otras bases Redis/KV; el código usa la API REST de Upstash.
- Pasos: Vercel → tu proyecto → **Storage** → **Upstash Redis** (Marketplace) → crear base (plan Free) → conectar al proyecto. Vercel añade `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` (o `KV_REST_API_URL` / `KV_REST_API_TOKEN`, que también se aceptan). Haz Redeploy.
- Sin esta base, `/api/recent` responde `storage_not_configured` y el carrusel muestra el mensaje de error.

### 2. Banner real (necesita un bot token tuyo)
Discord solo entrega el banner a su API oficial con la credencial de un **bot** (no tu cuenta). No se usa tu token de usuario ni tu contraseña.
1. https://discord.com/developers/applications → **New Application** → pestaña **Bot** → **Reset Token** → copia el token.
2. No hace falta darle permisos ni invitarlo a ningún servidor.
3. En Vercel añade `DISCORD_BOT_TOKEN` (Production) y haz Redeploy. El token solo existe en el servidor.
4. Sin él, todo funciona salvo el banner y el color de acento. Coste: gratis.

### 3. Registrar canciones aunque nadie visite la web (opcional)
El servidor registra una canción cuando alguien llama a `/api/recent` (la web lo hace cada 15 s con la pestaña visible). **Si no abre la web nadie mientras escuchas música, esas canciones no se registran.** Para cubrir ese hueco:
- Añade la variable `TRACK_SECRET` (16+ caracteres aleatorios) y programa en un servicio externo gratuito de cron (p. ej. cron-job.org) una llamada cada 1–2 minutos a `https://whoismatheo.vercel.app/api/track` con la cabecera `Authorization: Bearer <TRACK_SECRET>`.
- No uso Vercel Cron: en el plan gratuito solo permite ejecuciones diarias, insuficiente para esto.
- Es opcional y gratis, pero consume algunas invocaciones de Vercel y comandos Redis; revisa los límites de tu plan.

## Variables de Vercel

**Nuevas** (ver `.env.example`): `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (las crea Upstash), `DISCORD_BOT_TOKEN`, y opcionales `TRACK_SECRET`, `DISCORD_USER_ID`.

**Antiguas de Spotify que puedes retirar manualmente** (Vercel → Settings → Environment Variables). Ningún código las usa ya. Yo no tengo acceso a tu producción: no he comprobado ni borrado nada allí.
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REDIRECT_URI`
- `SPOTIFY_REFRESH_TOKEN`
- `SPOTIFY_SETUP_ENABLED`

Opcional: puedes borrar también la app del Spotify Developer Dashboard y revocar su acceso en tu cuenta de Spotify (Cuenta → Aplicaciones).

## Cómo se guarda el historial

- Una clave de Redis (`whoismatheo:recent-plays`) con un JSON de **como máximo 10** entradas, de la más reciente a la más antigua. Persiste entre recargas, cierres del navegador, reinicios y despliegues.
- Cada entrada: portada, título, artistas, álbum, enlace a Spotify y fecha/hora de detección. Solo el servidor escribe, y solo con datos que él mismo lee de Lanyard: un visitante no puede añadir ni modificar entradas (el endpoint público es solo GET).
- Reglas: la misma canción mientras sigue sonando (incluida una pausa y reanudación) no se repite; si vuelve tras otras canciones, se registra como evento nuevo; si se reinicia tras acabar la anterior reproducción, también. Si no se detecta música, las entradas se conservan. Un cerrojo breve evita duplicados por peticiones simultáneas.
- El historial **empieza desde que lo despliegues**. No existe una fuente legítima para recuperar reproducciones anteriores y no se inventa nada.
- Granularidad: se detecta lo que Lanyard/Discord reporta en el momento de la consulta; una canción que dure menos que el intervalo entre consultas y no coincida con ninguna puede no registrarse (por eso el paso 3 es útil).

## Banner, animación y actualización

- El banner se pide a `/api/profile` (cacheado 5 min en el CDN) y la web lo recarga cada 5 min. Si cambias el banner en Discord, aparece solo, sin tocar código.
- Se muestra en la cabecera de la tarjeta con `object-fit: cover` (sin deformar), alto adaptable (`clamp(96px, 24vw, 170px)`). Si es GIF animado se conserva la animación; con "reducir movimiento" activado en el dispositivo se usa el fotograma estático.
- Avatar, nombre y datos van debajo del banner, nunca encima del texto, para mantener la legibilidad.

## Pruebas

```
node tests/api.test.js      # 26 pruebas: Lanyard, API de Discord y Redis SIMULADOS (registro, deduplicación, límite de 10, orden,
                            # persistencia tras "reiniciar", errores de red, datos incompletos, seguridad, ausencia de código de Spotify API)
node tests/client.test.js   # 19 pruebas: script.js con DOM y WebSocket simulados (canción desde Discord, banner, insignias, carrusel,
                            # 5 idiomas, estados vacío/error, reproductor)
```
Son pruebas **automatizadas y offline con mocks**. No demuestran que tu cuenta real funcione ni cómo se ve en un navegador real (maquetación y responsive no se han podido probar visualmente en este entorno). Eso solo se comprueba con tu cuenta, ver a continuación.

## Probarlo desde tu teléfono Android (después de desplegar una vista previa)

1. Sube los cambios a una **rama** de GitHub (no a `main`): Vercel crea una URL de *Preview*. En Preview/Production tienen que estar las variables nuevas, y haz Redeploy tras añadirlas.
2. Abre `<url-preview>/api/profile` en Chrome del móvil: debe mostrar tu nombre y `"bannerSource":"ok"` y un `banner` con URL (si es `no_token`, falta `DISCORD_BOT_TOKEN`).
3. Abre `<url-preview>/api/recent`: debe responder `{"items":[...],"live":true}` (si responde `storage_not_configured`, falta la base de datos).
4. Abre la web de preview. Debes ver: banner arriba, avatar, nombre, insignias (solo las que tengas), estado.
5. En Spotify (Android) pon una canción con Discord abierto: en unos segundos aparece en la tarjeta y, ~15 s después, en el carrusel. Cambia de canción 2–3 veces: aparecen ordenadas, la más reciente primero. Deja la misma canción sonando: no se duplica.
6. Desliza el carrusel con el dedo, usa las flechas, cambia de idioma (EN/ES/RU/DE/FR) y comprueba que no hay desplazamiento horizontal de la página ni títulos desbordados.
7. Recarga y cierra/abre el navegador: el historial sigue ahí.

## Limitaciones

- La presencia depende de Lanyard (servicio público de terceros) y de que Discord la reporte. Si Discord no informa de la actividad (p. ej. Spotify no vinculado a Discord o actividad desactivada), no hay canción.
- En pausa, Discord suele quitar la actividad de Spotify tras un tiempo: se muestra como "nada sonando".
- Sesiones privadas de Spotify no se ocultan en Discord si la actividad está visible; si la ocultas en Discord, no se detecta.

## Despliegue en Vercel
Raíz del repo: `index.html`, `style.css`, `script.js`, `api/`, `audio/`, `vercel.json`. Framework "Other", sin build command. `api/` usa el runtime Node por defecto (sin `package.json` ni dependencias). Cada push a la rama de producción redespliega: **no hagas merge hasta haber probado la vista previa**.
