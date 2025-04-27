# MicroMon - Modern Monitoring Dashboard

MicroMon is a comprehensive monitoring and management dashboard that provides real-time system metrics, user management, alert management, and system configuration capabilities.

## Features

- **Real-time Dashboard**
  - System metrics visualization (CPU, Memory, Disk)
  - Active alerts display
  - System statistics overview
  - Real-time data updates

- **User Management**
  - Role-based access control (Admin, Manager, User)
  - User status management
  - CRUD operations for users
  - Email and username validation

- **Alert Management**
  - Custom alert creation and configuration
  - Severity levels (High, Medium, Low)
  - Alert enabling/disabling
  - Alert history and status tracking

- **System Settings**
  - General system configuration
  - Notification preferences
  - Database backup settings
  - Security settings including 2FA

## Tech Stack

- **Frontend**
  - React 18
  - Ant Design 5
  - React Router 6
  - Axios
  - Ant Design Charts

- **Backend**
  - Node.js
  - Express
  - MySQL
  - Prometheus
  - AlertManager

- **Monitoring**
  - Prometheus
  - Grafana
  - Node Exporter
  - MySQL Exporter
  - Blackbox Exporter

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- MySQL 8.0
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/micromon.git
cd micromon
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```env
# Database Configuration
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=micromon
MYSQL_USER=micromon_user
MYSQL_PASSWORD=your_password

# Backend Configuration
NODE_ENV=production
PORT=3000

# Frontend Configuration
REACT_APP_API_URL=http://localhost:3000
```

4. Build and start the containers:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:3000
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090

## Development Setup

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## Security Scanning

The project includes automated security scanning using:
- Snyk for dependency vulnerability scanning
- SonarQube for code quality analysis
- OWASP Dependency Check for security analysis

To run security scans locally:

```bash
# Install Snyk CLI
npm install -g snyk

# Run Snyk scan
cd frontend
snyk test
cd ../backend
snyk test

# Run OWASP Dependency Check
docker run --rm \
  -e user=$USER \
  -u $(id -u ${USER}):$(id -g ${USER}) \
  --volume $(pwd):/src:z \
  --volume $(pwd)/reports:/report:z \
  owasp/dependency-check:latest \
  --scan /src \
  --format "HTML" \
  --project "MicroMon" \
  --out /report
```

## API Documentation

### Authentication
- `POST /login` - User login
- `POST /logout` - User logout

### Users
- `GET /users` - Get all users
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Alerts
- `GET /alerts` - Get all alerts
- `POST /alerts` - Create new alert
- `PUT /alerts/:id` - Update alert
- `DELETE /alerts/:id` - Delete alert
- `PUT /alerts/:id/toggle` - Toggle alert status

### Metrics
- `GET /metrics` - Get system metrics
- `GET /system-stats` - Get system statistics

### Settings
- `GET /settings` - Get system settings
- `PUT /settings` - Update system settings

## Monitoring Setup

1. Access Grafana at http://localhost:3001
   - Default credentials: admin/admin
   - Change password on first login

2. Configure Prometheus data source in Grafana:
   - URL: http://prometheus:9090
   - Access: Server

3. Import default dashboards:
   - System Metrics
   - Alert Status
   - User Activity

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Ant Design](https://ant.design/) for the UI components
- [Prometheus](https://prometheus.io/) for monitoring
- [Grafana](https://grafana.com/) for visualization
- [Snyk](https://snyk.io/) for security scanning
