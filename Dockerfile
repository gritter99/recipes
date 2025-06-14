FROM node:slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3007
USER root
RUN chown -R node:node /app
USER node
CMD ["node", "-r", "./dist/tracing.js", "dist/server.js"]