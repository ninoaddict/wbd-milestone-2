# Dockerfile untuk Frontend
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy seluruh proyek ke dalam container
COPY . .

# Build aplikasi React
RUN npm run build

# Stage untuk serving aplikasi menggunakan Nginx
FROM nginx:alpine

# Copy build hasil React ke direktori yang digunakan Nginx
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 5173

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
