FROM node:24-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json prisma.config.ts ./
COPY src/core/config/database/prisma ./src/core/config/database/prisma
RUN npm ci

COPY . .
RUN npx prisma generate \
  && npm run build \
  && npm prune --omit=dev --ignore-scripts

FROM node:24-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production

COPY --from=build --chown=node:node /app/package*.json /app/prisma.config.ts ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/src/core/config/database/prisma ./src/core/config/database/prisma
COPY --chown=node:node entrypoint.sh ./
RUN sed -i 's/\r$//' entrypoint.sh && chmod +x entrypoint.sh

USER node
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
