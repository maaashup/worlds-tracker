# Introduction
The purpose of the Vue Dockertemplate is to provide a fullstack template that is readily built for development (as well as learning about docker containers).
This template consists of a Frontend, Backend and Database creating a mono-repository.

## Tech Stack
- Frontend: VueJS
- Backend: NodeJS
- DB: Postgres 16

## Template structure
This uses a mono-repo style to separate out the different services
- `backend/` Express API
- `frontend/` Vue3 Frontend

## Setting up
1. Create a .env file in the root directory using the .env.example file
```bash
cp .env.example .env

```
2. Install all packages
```bash
npm install
```

## Working within the dev container (VSCode)
In the above terminal, type and select `>Dev Containers: Reopen in Container`

Generate and Migrate any schemas into your DB
```bash
npm run db:generate --workspace=./backend
npm run db:migrate --workspace=./backend
```

Then run the following commands to run the services separately to take advantage of hot-reloading:
```bash
npm run api:dev --workspace=./backend
npm run dev:frontend --workspace=./frontend
```