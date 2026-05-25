# Introduction
The purpose of the Vue Dockertemplate is to provide a fullstack template that is readily built for development (as well as learning about docker containers).
This template consists of a Frontend, Backend and Database creating a mono-repository.

## Tech Stack
- Frontend: VueJS
- Backend: NodeJS
- DB: Postgres 18

## Accessing the frontend
After running `docker compose up -d --build`, the frontend is exposed on port `8080`.

- Use `http://localhost:8080/` from the host machine.
- Use `http://<host-ip>:8080/` from other devices on the same network.

Find the host IP with:

```bash
hostname -I | awk '{print $1}'
```

Then use that IP in the URL, for example:

```bash
http://192.168.1.42:8080/
```

Note: the Vite server log may show a container-internal address like `http://XX.XX.XX.XX:8080/`, but that address is only reachable from inside the Docker network. For external access, use the host machine IP.
