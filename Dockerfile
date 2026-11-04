FROM node:24-slim AS frontend-build
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
RUN npm ci
COPY frontend ./frontend
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:0.9.26 /uv /uvx /bin/
COPY pyproject.toml uv.lock ./
COPY backend/pyproject.toml ./backend/pyproject.toml
RUN uv sync --locked --no-dev --package yasashii-backend
COPY backend/app ./backend/app
COPY --from=frontend-build /app/backend/app/frontend ./backend/app/frontend
ENV PATH="/app/.venv/bin:$PATH"
WORKDIR /app/backend
EXPOSE 8080
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
