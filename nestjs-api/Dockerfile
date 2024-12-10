ARG IMAGE=node:lts-alpine

FROM ${IMAGE} as builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm 
RUN pnpm install
RUN pnpm install prisma
RUN pnpm prisma generate

FROM builder as prod-build
RUN pnpm run build
RUN pnpm prune --prod

FROM ${IMAGE} as prod
RUN apk update && apk upgrade && \
  apk add --no-cache openssl procps

COPY --from=prod-build /app/dist /app/dist
COPY --from=prod-build /app/prisma /app/dist/prisma
COPY --from=prod-build /app/node_modules /app/node_modules

WORKDIR /app/dist

RUN npx prisma generate

CMD ["node", "./main.js"]