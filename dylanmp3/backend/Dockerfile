FROM node:20-alpine

RUN apk add --no-cache python3 py3-pip ffmpeg
RUN pip3 install yt-dlp --break-system-packages

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir -p downloads

EXPOSE 3001
CMD ["node", "src/index.js"]
