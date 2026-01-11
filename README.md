# Library-Management-System
A Library Management System built with Java Spring Boot and MySQL for the modules OOAD and DMS Y2S1

## Quickstart (Mentor/Reviewer)

### Which app to run (important)

- **Backend:** `libraryManagementSystem-Backend2/`
- **Frontend:** `frontend/`

Other folders such as `archive/library-frontend/`, `archive/library-frontend3/`, and `archive/library-management-system-Library-Frontend/` are older/experimental UIs and are not required for assessment.

### Prerequisites

- Java 17+
- Node.js + npm
- Docker Desktop (recommended for MySQL)

### 1) Start MySQL (recommended)

From the repo root:

```bash
docker compose up -d
```

This starts MySQL on `localhost:3306` and creates the database `library_management_system_backend2`.

### 2) Run Backend (Spring Boot)

Backend project location:

```text
libraryManagementSystem-Backend2/
```

Set environment variables (PowerShell example):

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "root"
```

Start the backend:

```powershell
./mvnw.cmd spring-boot:run
```

Backend will run on:

```text
http://localhost:8081
```

### 3) Run Frontend (React)

Frontend project location:

```text
frontend/
```

Install and start:

```bash
npm install
npm start
```

Frontend will run on:

```text
http://localhost:3000
```

The frontend uses a development proxy to the backend (`frontend/package.json` -> `proxy: http://localhost:8081`).

## Configuration

- Use `.env.example` (repo root) for example environment variable values.
- Use `frontend/.env.example` for the frontend environment variables.

## Demo data (optional)

This repo includes a shareable demo seed file:

```text
demo_seed.sql
```

### Import into MySQL (Docker)

If you started MySQL using `docker compose up -d` (see `docker-compose.yml`), you can import the seed like this:

```powershell
Get-Content .\demo_seed.sql | docker exec -i lms-mysql mysql -uroot -proot library_management_system_backend2
```

### Import into MySQL (local / Workbench)

Open `demo_seed.sql` in MySQL Workbench and run it against your schema `library_management_system_backend2`.

## Common Issues

### Backend can't connect to MySQL

- Ensure MySQL is running and accessible on `localhost:3306`.
- Ensure environment variables are set:
  - `DB_USERNAME`
  - `DB_PASSWORD`

### Port already in use

- Backend uses `8081` (see `libraryManagementSystem-Backend2/src/main/resources/application.properties`).
- Frontend uses `3000`.
