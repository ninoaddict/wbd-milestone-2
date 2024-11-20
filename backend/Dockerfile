FROM node:20-alpine

# Membuat direktori aplikasi dan mengatur kepemilikan
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Mengatur direktori kerja
WORKDIR /home/node/app

# Menjalankan sebagai user non-root
USER node

# Menyalin package.json dan menginstal dependensi
COPY --chown=node:node package*.json ./
RUN npm ci

# Menyalin seluruh file proyek
COPY --chown=node:node . .

# Build aplikasi (untuk proyek TypeScript)
RUN npm run build

# Deklarasi variabel lingkungan
ENV PORT=3000

# Expose port aplikasi
EXPOSE 3000

# Jalankan server
CMD ["node", "dist/index.js"]