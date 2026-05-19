FROM node:22-alpine
# Pin pnpm to a specific version so builds are reproducible across time.
# `pnpm@latest` is a moving target — when the version drifts across a
# behavior change (e.g. pnpm 10's removal of the package.json `pnpm` field)
# previously-passing builds start failing without any source changes.
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]
