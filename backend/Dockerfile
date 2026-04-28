FROM node:20-alpine

# Instalar Python, pip, ffmpeg (requeridos por yt-dlp)
RUN apk add --no-cache python3 py3-pip ffmpeg

# Instalar yt-dlp globalmente
RUN pip3 install yt-dlp --break-system-packages

WORKDIR /app

# Copiar dependencias primero para aprovechar cache de Docker
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Crear carpeta de descargas temporales
RUN mkdir -p downloads

EXPOSE 3001

CMD ["node", "src/index.js"]
