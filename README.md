# 🚀 Login and Monitoring Project

This project is a **full-stack DevOps monitoring setup** with:
- **React** frontend login page
- **Node.js** backend API
- **MySQL** database for user management
- **Prometheus**, **Grafana**, **Alertmanager** monitoring stack
- **Slack notifications** if backend `/health` goes down
- **Docker Compose** deployment

---

## 📂 Project Structure

```
.
├── backend/       # Node.js backend
├── frontend/      # React frontend
├── mysql/         # MySQL database + init.sql
├── prometheus/    # Prometheus configuration
├── grafana/       # Grafana dashboards
├── alertmanager/  # Alertmanager config (Slack)
├── blackbox/      # Blackbox Exporter for backend health checks
├── docker-compose.yml
├── .env
└── README.md
```

---

## ✨ Features

- **Frontend (React)**  
  - Simple login page
  - Displays "Hello Admin" or "Hello User" after login
- **Backend (Node.js)**  
  - `/login` endpoint checks credentials from MySQL database
  - `/health` endpoint for uptime monitoring
- **MySQL**  
  - Stores users (admin and normal user)
- **Monitoring**  
  - Prometheus scrapes backend health, MySQL metrics
  - Grafana shows live CPU, memory, service status
  - Slack alert when backend `/health` fails
- **Fully Dockerized** with Compose!

---

## 🛠 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/peymansohi/login-monitoring.git
cd login-monitoring
```

---

### 2. Configure environment variables

Create a `.env` file:

```env
# MySQL
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=app_db
MYSQL_USER=app_user
MYSQL_PASSWORD=app_password

# Backend
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=app_db
DB_USERNAME=app_user
DB_PASSWORD=app_password

# Users (used by SQL script)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
USER_USERNAME=user
USER_PASSWORD=user123

# Slack webhook URL for alerts
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/slack/webhook
```

> ⚠️ Replace `SLACK_WEBHOOK_URL` with your actual Slack webhook.

---

### 3. Start the stack

```bash
docker-compose up --build
```

- Frontend available at: **http://localhost**
- Backend API at: **http://localhost:3000**
- MySQL at: **localhost:3306**

---

## 🔒 Default Credentials

| Role   | Username | Password |
|--------|----------|----------|
| Admin  | admin    | admin123 |
| Normal | user     | user123  |

---

## 📈 Monitoring URLs

- **Prometheus** ➔ [http://localhost:9090](http://localhost:9090)
- **Grafana** ➔ [http://localhost:3001](http://localhost:3001)
- **Alertmanager** ➔ [http://localhost:9093](http://localhost:9093)

> Grafana login:  
> **Username:** `admin`  
> **Password:** `admin`

---

## 📊 Grafana Dashboards

- **CPU Usage**
- **Memory Usage**
- **Container Health**
- **Backend /health endpoint monitoring**

---

## 🔔 Slack Alerts

Slack alert sent when:
- Backend `/health` endpoint is DOWN
- Prometheus detects service unavailability

---

## 🐳 Services Overview (Docker Compose)

| Service       | Image                       | Port    |
|---------------|------------------------------|---------|
| frontend      | nginx + React static build   | 80      |
| backend       | Node.js Express API          | 3000    |
| mysql         | MySQL 8.0                    | 3306    |
| prometheus    | Prometheus                   | 9090    |
| grafana       | Grafana                      | 3001    |
| alertmanager  | Alertmanager                 | 9093    |
| blackbox      | Blackbox Exporter            | 9115    |

---