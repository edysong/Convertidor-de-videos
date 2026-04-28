# VidSnap — Descargador de videos de YouTube

Descarga videos de YouTube (incluyendo Shorts) en **MP4** o audio en **MP3** con una interfaz web moderna y oscura. Sin registro, sin límites de tamaño.

---

## Características

- Descarga MP4 en 1080p, 480p y otras calidades
- Extracción de audio MP3 a 320 kbps
- Compatible con YouTube Shorts
- Cola de trabajos asíncrona con Bull + Redis
- Progreso en tiempo real via polling
- Limpieza automática de archivos (TTL 30 min)
- Rate limiting por IP para evitar abusos
- Listo para Google AdSense

---

## Requisitos previos

- **Node.js** 20 o superior
- **npm** 9+
- **Docker** y **Docker Compose** (para el modo contenedores)
- **yt-dlp** (para desarrollo local sin Docker): `pip install yt-dlp`
- **ffmpeg** (para desarrollo local): descarga en https://ffmpeg.org/download.html
- **Redis** (para desarrollo local): `redis-server` o usa Docker solo para Redis

---

## Instalación y ejecución en desarrollo

### 1. Clonar y configurar variables de entorno

```bash
git clone <url-del-repo>
cd vidsnap
cp .env.example backend/.env
```

Edita `backend/.env` con tus valores (especialmente `REDIS_URL` y `YTDLP_PATH`).

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
cd ..
```

### 3. Instalar dependencias del frontend

```bash
cd frontend
npm install
cd ..
```

### 4. Levantar Redis (si no tienes uno corriendo)

```bash
docker run -d -p 6379:6379 redis:7-alpine
```

### 5. Correr backend y frontend en paralelo

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Corre en http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Corre en http://localhost:5173
```

Abre `http://localhost:5173` en tu navegador.

---

## Ejecución con Docker Compose (producción)

```bash
# Construir y levantar todos los servicios
docker-compose up --build

# En segundo plano
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

Los servicios quedarán en:
- Frontend: `http://localhost:80`
- Backend: `http://localhost:3001`
- Redis: `localhost:6379`

---

## Cómo agregar Google AdSense

### Paso 1 — Script global en `index.html`

En `frontend/index.html`, descomenta y reemplaza tu Publisher ID:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
```

### Paso 2 — Anuncio en el Interstitial

En `frontend/src/components/Interstitial.jsx`, descomenta el bloque `<ins>` y reemplaza:
- `ca-pub-XXXXXXXXXX` → tu Publisher ID
- `YYYYYYYYYY` → tu Ad Slot ID (formato 300×250)

```jsx
<ins className="adsbygoogle"
     style={{ display: "block" }}
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="YYYYYYYYYY"
     data-ad-format="auto"
     data-full-width-responsive="true" />
```

También inicializa AdSense llamando a `(adsbygoogle = window.adsbygoogle || []).push({})` en el `useEffect` del componente.

---

## Estructura del proyecto

```
vidsnap/
├── frontend/                  # Aplicación React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── UrlInput.jsx      # Input con validación en tiempo real
│   │   │   ├── FormatSelector.jsx # Selector de formato/calidad
│   │   │   ├── ResultCard.jsx    # Polling de progreso + botón descarga
│   │   │   └── Interstitial.jsx  # Overlay con anuncio + countdown
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Página principal
│   │   │   ├── Privacidad.jsx    # Política de privacidad (requerida por AdSense)
│   │   │   └── Terminos.jsx      # Términos de uso
│   │   ├── App.jsx               # Router principal
│   │   └── main.jsx              # Entry point
│   ├── nginx.conf             # Config nginx para producción
│   ├── vite.config.js         # Config Vite con proxy al backend
│   └── Dockerfile
│
├── backend/                   # API Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   │   ├── process.js        # POST /api/process — encolar descarga
│   │   │   └── status.js         # GET /api/status/:id y /api/download/:id
│   │   ├── workers/
│   │   │   └── downloader.js     # Worker Bull + lógica yt-dlp
│   │   ├── middleware/
│   │   │   └── rateLimit.js      # Rate limiting por IP
│   │   └── index.js              # Servidor Express principal
│   ├── downloads/             # Archivos temporales (gitignored)
│   └── Dockerfile
│
├── docker-compose.yml         # Orquestación de servicios
├── .env.example               # Variables de entorno de ejemplo
└── README.md
```

---

## Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `PORT` | `3001` | Puerto del servidor backend |
| `REDIS_URL` | `redis://localhost:6379` | URL de conexión a Redis |
| `FRONTEND_URL` | `http://localhost:5173` | URL del frontend (para CORS) |
| `MAX_REQUESTS_PER_IP` | `5` | Límite de requests por IP |
| `RATE_LIMIT_WINDOW_MINUTES` | `15` | Ventana de tiempo del rate limit |
| `DOWNLOAD_TTL_MINUTES` | `30` | Minutos hasta eliminar archivos temporales |
| `YTDLP_PATH` | `yt-dlp` | Ruta al ejecutable de yt-dlp |

---

## Notas de seguridad

- Las URLs se sanitizan y validan antes de pasarse a yt-dlp
- Se usa `child_process.spawn` con array de argumentos (no `exec` con strings)
- Los archivos se eliminan automáticamente tras la descarga o al expirar el TTL
- Rate limiting previene abusos por IP
- Los jobIds se validan con regex UUID antes de consultar Redis
# Convertidor-de-videos
