# DylanMP3 — Descargador de YouTube para LATAM

Descarga videos de YouTube (incluyendo Shorts) en **MP4** o extrae audio en **MP3 320kbps**.
Optimizado para posicionamiento SEO en Colombia y Latinoamérica.

**Tagline:** *Descarga videos y música de YouTube gratis y rápido*

---

## Características

- Descarga MP4 en 1080p / 480p y otras calidades
- Extracción de audio MP3 a 320 kbps
- Compatible con YouTube Shorts (`youtube.com/shorts/...`)
- Cola de trabajos asíncrona con Bull + Redis
- Progreso en tiempo real (polling cada 2s)
- Rate limiting: 5 descargas / IP / 15 minutos
- Limpieza automática con `node-cron` (TTL 30 min)
- SEO completo: sitemap.xml, robots.txt, Schema.org, FAQPage, Open Graph
- Páginas SEO dedicadas: `/youtube-a-mp3` y `/descargar-shorts-youtube`
- Preparado para Google AdSense (Publisher ID: ca-pub-9334050849399869)

---

## Requisitos previos

- **Node.js** 20+
- **npm** 9+
- **Docker** + **Docker Compose** (para modo contenedores)
- **yt-dlp** (desarrollo local): `pip install yt-dlp`
- **ffmpeg** (desarrollo local): https://ffmpeg.org/download.html
- **Redis** (desarrollo local): `docker run -d -p 6379:6379 redis:7-alpine`

---

## Instalación — Desarrollo local

```bash
# 1. Clonar
git clone <url-del-repo>
cd dylanmp3

# 2. Variables de entorno del backend
cp .env.example backend/.env

# 3. Instalar dependencias
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 4. Levantar Redis
docker run -d -p 6379:6379 redis:7-alpine

# 5. Backend (terminal 1)
cd backend && npm run dev
# → http://localhost:3001

# 6. Frontend (terminal 2)
cd frontend && npm run dev
# → http://localhost:5173
```

---

## Docker Compose — Producción local

```bash
docker-compose up --build

# En segundo plano
docker-compose up --build -d

# Logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Detener
docker-compose down
```

Servicios:
| Servicio  | Puerto | URL                    |
|-----------|--------|------------------------|
| Frontend  | 80     | http://localhost        |
| Backend   | 3001   | http://localhost:3001   |
| Redis     | 6379   | localhost:6379          |

---

## Despliegue gratuito en la nube

### Frontend → Vercel

1. Sube el repositorio a GitHub
2. Entra a [vercel.com](https://vercel.com) → "New Project"
3. Importa el repo → selecciona la carpeta **`/frontend`** como root directory
4. Framework: **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`
7. Variables de entorno:
   ```
   VITE_API_URL=https://dylanmp3-api.railway.app
   ```
8. Deploy → tu URL será algo como `dylanmp3.vercel.app`

### Backend → Railway

1. Entra a [railway.app](https://railway.app) → "New Project"
2. "Deploy from GitHub repo" → selecciona la carpeta **`/backend`**
3. Railway detecta el `Dockerfile` automáticamente
4. Agrega un servicio **Redis** desde el dashboard de Railway
5. Variables de entorno (en Railway Settings):
   ```
   PORT=3001
   REDIS_URL=<la URL de Redis que Railway te da automáticamente>
   FRONTEND_URL=https://dylanmp3.vercel.app
   MAX_REQUESTS_PER_IP=5
   RATE_LIMIT_WINDOW_MINUTES=15
   DOWNLOAD_TTL_MINUTES=30
   YTDLP_PATH=yt-dlp
   SITE_URL=https://dylanmp3.vercel.app
   ```
6. El Dockerfile instala yt-dlp y ffmpeg automáticamente

---

## Cómo activar Google AdSense

### Paso 1 — Script en `index.html`

En `frontend/index.html`, descomenta y ajusta:

```html
<script async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9334050849399869"
  crossorigin="anonymous">
</script>
```

### Paso 2 — Anuncio en el Interstitial

En `frontend/src/components/Interstitial.jsx`, descomenta el bloque `<ins>`:

```jsx
<ins className="adsbygoogle"
     style={{ display: "block", width: "300px", height: "250px" }}
     data-ad-client="ca-pub-9334050849399869"
     data-ad-slot="TU_AD_SLOT_ID" />
```

Y agrega en el `useEffect`:
```js
if (window.adsbygoogle) (window.adsbygoogle = window.adsbygoogle || []).push({});
```

### Paso 3 — Google Analytics

En `frontend/index.html`, descomenta el bloque de Google Analytics y reemplaza `G-XXXXXXXXXX` con tu Measurement ID.

---

## Estructura SEO implementada

| Elemento | Descripción |
|---|---|
| `<title>` por página | Sobreescrito con react-helmet-async |
| `<meta description>` | Específico para cada ruta |
| `<meta keywords>` | 10+ keywords objetivo para LATAM |
| `canonical` | Una URL canónica por página |
| Open Graph | Para compartir en Facebook, WhatsApp |
| Twitter Card | Para compartir en Twitter/X |
| Schema.org WebApp | En index.html (página principal) |
| Schema.org FAQPage | En el componente FAQ.jsx |
| sitemap.xml | 5 URLs con prioridades |
| robots.txt | Allow todas las rutas excepto /api/ |
| H1 único por página | Optimizado para keyword principal |
| H2 con keywords | En HowItWorks y páginas de aterrizaje |
| Texto rico en keywords | Párrafo en HowItWorks |
| Links internos | Home ↔ /youtube-a-mp3 ↔ /shorts |

---

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `3001` | Puerto del backend |
| `REDIS_URL` | `redis://localhost:6379` | Conexión a Redis |
| `FRONTEND_URL` | `http://localhost:5173` | Para CORS |
| `MAX_REQUESTS_PER_IP` | `5` | Rate limit |
| `RATE_LIMIT_WINDOW_MINUTES` | `15` | Ventana del rate limit |
| `DOWNLOAD_TTL_MINUTES` | `30` | TTL de archivos temporales |
| `YTDLP_PATH` | `yt-dlp` | Ruta al ejecutable de yt-dlp |
| `SITE_URL` | `https://dylanmp3.vercel.app` | URL canónica del sitio |
| `VITE_API_URL` | *(vacío = mismo origen)* | URL del backend (solo frontend) |

---

## Estructura del proyecto

```
dylanmp3/
├── frontend/
│   ├── public/
│   │   ├── robots.txt              ← SEO: instrucciones a crawlers
│   │   └── sitemap.xml             ← SEO: mapa del sitio
│   ├── src/
│   │   ├── components/
│   │   │   ├── UrlInput.jsx        ← Input con validación en tiempo real
│   │   │   ├── FormatSelector.jsx  ← Selector MP3/MP4/calidad
│   │   │   ├── ResultCard.jsx      ← Polling de progreso + botón descarga
│   │   │   ├── Interstitial.jsx    ← Overlay AdSense + countdown
│   │   │   ├── HowItWorks.jsx      ← SEO: pasos + texto con keywords
│   │   │   ├── FAQ.jsx             ← SEO: FAQPage Schema.org
│   │   │   └── Footer.jsx          ← Links internos + copyright
│   │   ├── pages/
│   │   │   ├── Home.jsx                    ← Página principal
│   │   │   ├── YoutubeAMp3.jsx             ← /youtube-a-mp3
│   │   │   ├── DescargaShortsYoutube.jsx   ← /descargar-shorts-youtube
│   │   │   ├── Privacidad.jsx              ← /privacidad
│   │   │   └── Terminos.jsx                ← /terminos
│   │   ├── App.jsx                 ← Router con todas las rutas
│   │   └── main.jsx                ← Entry point + HelmetProvider
│   ├── index.html                  ← Meta tags base + AdSense/GA comentados
│   └── vite.config.js              ← Proxy al backend en desarrollo
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── process.js          ← POST /api/process
│   │   │   └── status.js           ← GET /api/status/:id + /api/download/:id
│   │   ├── workers/
│   │   │   └── downloader.js       ← Worker Bull + yt-dlp spawn
│   │   ├── middleware/
│   │   │   └── rateLimit.js        ← Rate limiting por IP
│   │   └── index.js                ← Express + node-cron limpieza
│   ├── downloads/                  ← Archivos temporales (gitignored)
│   └── Dockerfile                  ← Node 20 + yt-dlp + ffmpeg
│
├── docker-compose.yml
├── .env.example
└── README.md
```
