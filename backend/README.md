# Mockoon Manager Backend

A TypeScript-based backend service for managing Mockoon mock servers.

## Prerequisites

- Node.js (v14 or higher)
- mockoon-cli (install globally with `npm install -g @mockoon/cli`)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=3500
API_KEY=supersecretapikey
UPLOAD_DIR=uploads
CONFIGS_DIR=configs
LOGS_DIR=logs
HOSTNAME=0.0.0.0
LATENCY=0
CORS_ORIGIN=*
```

## Development

To run the server in development mode with hot reload:

```bash
npm run dev
```

## Production

1. Build the project:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

## API Endpoints

All endpoints except `/api/health` require an API key in the Authorization header:
```
Authorization: Bearer supersecretapikey
```

### Health Check
- `GET /api/health` - Check server status

### Mock Server Management
- `POST /api/mock/start` - Start a mock server
- `POST /api/mock/stop` - Stop a mock server
- `GET /api/mock/status` - Get status of all mock servers

### Configuration Management
- `POST /api/mock/upload` - Upload a configuration file
- `GET /api/mock/configs` - List all configuration files
- `DELETE /api/mock/configs/:filename` - Delete a configuration file
- `GET /api/mock/configs/:filename/download` - Download a configuration file

## Directory Structure

```
/src
  /handlers
    /health
      healthCheckHandler.ts
    /mock
      startMockHandler.ts
      stopMockHandler.ts
      statusMockHandler.ts
      uploadMockHandler.ts
      listConfigsHandler.ts
      deleteConfigHandler.ts
      downloadConfigHandler.ts
  /middlewares
    apiKeyAuth.ts
  /repositories
    /mock
      mockInstanceRepository.ts
      fileRepository.ts
  /utils
    cliChecker.ts
    portUtils.ts
    fileUtils.ts
  server.ts
```

## Error Handling

The server will exit with an error if:
- mockoon-cli is not available
- Required directories cannot be created
- Server fails to start

## Security

- All endpoints (except /api/health) are protected with API key authentication
- File uploads are limited to JSON files and 5MB size
- Port numbers are restricted to range 9001-9999 