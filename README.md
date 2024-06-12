# rest-test-backend-bg

## Description

This project is a Node.js application for handling data transformation with caching functionality.

## Installation

1. Install NVM (Node Version Manager):
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```

2. Install Node.js version 22.2:
    ```bash
    nvm install 22.2
    ```

3. Use Node.js version 22.2:
    ```bash
    nvm use 22.2
    ```

4. Install dependencies:
    ```bash
    npm install
    ```

## Usage

To run the application in development mode:
```bash
npm run dev
```
To run tests:
```bash
npx jest
```

## API Endpoint
Send a GET request to:

```localhost:3000/api/files```

## Caching
The server caches data on startup.

To customize cache duration, set the CACHE_DURATION environment variable in .env. If not set, the default duration is 100 seconds.

## Note
Redis was not used in this test, but it can be implemented based on client requirements. Instead of caching on server startup and using middleware, a cron job can be implemented.
