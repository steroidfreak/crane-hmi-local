FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package.json tsconfig.base.json ./
COPY libs/common/package.json ./libs/common/package.json
COPY apps/api/package.json ./apps/api/package.json

RUN npm install

COPY libs ./libs
COPY apps/api ./apps/api

RUN npm run build --workspace libs/common --workspace apps/api

FROM node:20-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/api/dist ./apps/api/dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/apps/api/package.json ./apps/api/package.json

ENV NODE_ENV=production
CMD ["node", "apps/api/dist/main.js"]
