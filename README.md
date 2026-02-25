# massimo-v2

## Local development

Run the app in development mode:

```sh
npm run dev
```

## What changed

- Removed admin/login area
- Removed contact form backend endpoint
- Contact section now uses direct links (Email, LinkedIn, etc.)
- Theme preference is saved in browser `localStorage`

## Raspberry Pi deployment

### 1. Build and run

```sh
docker compose -f docker-compose.pi.yml up -d --build
```

The app runs on port `3000`.

### 2. Update deployment

```sh
git pull
docker compose -f docker-compose.pi.yml up -d --build
```
