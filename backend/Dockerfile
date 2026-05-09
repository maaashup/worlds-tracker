FROM node:25-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache git
RUN npm install -g pnpm

RUN pnpm install -g corepack@latest
RUN corepack enable

WORKDIR /BE

COPY package.json pnpm-lock.yaml* tsconfig.json ./

RUN pnpm install

COPY . .

CMD ["pnpm", "run", "api:dev"]