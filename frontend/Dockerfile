# -----------------------------------
# 1. Build Stage
# -----------------------------------
FROM node:18 AS builder

WORKDIR /app

# Copy package.json and lock files
COPY package.json ./
# COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy rest of the frontend source
COPY . .

# Build React app
RUN npm run build


# -----------------------------------
# 2. Production Stage (Nginx)
# -----------------------------------
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
