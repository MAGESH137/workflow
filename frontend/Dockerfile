# ---------- Build stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first (cache-friendly)
COPY package*.json ./

# IMPORTANT: install ALL deps (including devDependencies)
RUN npm install

# Copy rest of the source
COPY . .

# Build React/Vite app
RUN npm run build


# ---------- Runtime stage ----------
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
