FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# for a production image, use 'npm ci --only=production'.
RUN npm install
COPY . .

EXPOSE 1968

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:1968/health || exit 1

# overridden by compose
CMD ["npm", "start"]