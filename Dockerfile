FROM --platform=$BUILDPLATFORM node:22-bookworm-slim AS build

ENV COREPACK_HOME=/corepack
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# corepack install reads the pnpm version from package.json#packageManager,
# keeping this Dockerfile out of the version-pinning business.
RUN corepack enable && corepack install

RUN pnpm install --frozen-lockfile

COPY . .

ARG PUBLIC_SITE_URL=http://localhost:4321
ENV PUBLIC_SITE_URL=${PUBLIC_SITE_URL}

RUN pnpm run build

FROM nginx:1.30-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/healthz || exit 1
