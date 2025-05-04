FROM node:slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production --ignore-scripts
COPY . .
RUN npm run build

FROM node:slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
USER node
CMD ["node", "dist/server.js"]