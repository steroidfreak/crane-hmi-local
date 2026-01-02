FROM node:20-alpine AS builder
WORKDIR /usr/src/app

ARG VITE_API_URL=/api
ARG VITE_WS_URL=
ARG VITE_USERNAME=admin
ARG VITE_PASSWORD=changeme
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_USERNAME=$VITE_USERNAME
ENV VITE_PASSWORD=$VITE_PASSWORD

COPY package.json tsconfig.base.json ./
COPY libs/common/package.json ./libs/common/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN npm install

COPY libs ./libs
COPY apps/web ./apps/web

RUN npm run build --workspace libs/common --workspace apps/web

FROM node:20-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/web/dist ./apps/web/dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /usr/src/app/apps/web/vite.config.ts ./apps/web/vite.config.ts

ENV NODE_ENV=production
CMD ["npm", "run", "preview", "--workspace", "apps/web", "--", "--host", "0.0.0.0", "--port", "4173"]
