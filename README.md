# Depined Service Polling

A Node.js service that maintains a persistent connection with the Depined API through continuous polling and keep-alive mechanisms.

## Features

- Continuous API polling with configurable intervals
- Keep-alive ping mechanism
- Graceful shutdown handling
- Environment-based configuration
- Automatic reconnection attempts
- Comprehensive logging system

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Valid Depined API token

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aritlhq/depined.git
   cd depined
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file with the following variables:
   ```properties
   AUTH_TOKEN=your_token_here
   POLLING_INTERVAL=30000
   USE_PROXY=flase # change it if you wanna use proxy
   PROXY_HOST=
   PROXY_PORT=
   ```

## Usage

To start the service:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Service Behaviour

- Polls the Depined API every 30 seconds (configurable)
- Sends keep-alive pings every 3 seconds
- Logs minute markers for monitoring
- Automatically handles connection state
- Gracefully shuts down on SIGINT and SIGTERM signals

## Logging

The service provides detailed logging:
- API poll results
- Keep-alive ping status
- Connection state changes
- Error messages and stack traces

## Error Handling

The service implements robust error handling:
- Automatic reconnection attempts
- Connection state persistence
- Graceful degradation
- Comprehensive error logging

## Licence
[MIT License](./LICENSE)


## Support

For support, please raise an issue in the GitHub repository or contact the maintainers directly.
