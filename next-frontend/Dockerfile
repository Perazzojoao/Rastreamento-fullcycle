ARG IMAGE=node:lts-alpine

FROM ${IMAGE} as builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm 
RUN pnpm install

FROM builder as prod-build
RUN pnpm run build
RUN pnpm prune --production

FROM ${IMAGE} as prod
RUN apk update && apk upgrade

COPY --from=prod-build /app/.next /app/.next
COPY --from=prod-build /app/public /app/public
COPY --from=prod-build /app/node_modules /app/node_modules
COPY --from=prod-build /app/package.json /app/package.json

WORKDIR /app

CMD ["npm", "start"]