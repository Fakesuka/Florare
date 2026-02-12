# Инструкция по развертыванию Florale PWA

## 📋 Предварительные требования

- Node.js 18.17 или выше
- npm 9.0 или выше
- Git

## 🚀 Локальная разработка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd florale-pwa
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

### 4. Сборка для production

```bash
npm run build
```

### 5. Запуск production сборки локально

```bash
npm start
```

## 🌐 Развертывание на Vercel (рекомендуется)

### Вариант 1: Через Vercel CLI

1. Установите Vercel CLI:
```bash
npm install -g vercel
```

2. Выполните deploy:
```bash
vercel
```

3. Следуйте инструкциям в терминале

### Вариант 2: Через Vercel Dashboard

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Импортируйте Git репозиторий
4. Vercel автоматически определит Next.js проект
5. Нажмите "Deploy"

### Настройка environment variables в Vercel

В настройках проекта добавьте переменные окружения:

```env
NEXT_PUBLIC_API_URL=https://api.florale.ru
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_MAPS_API_KEY=your_maps_key
```

## 🐳 Docker развертывание

### 1. Создайте Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. Создайте docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### 3. Соберите и запустите

```bash
docker-compose up -d
```

## 🔧 Nginx конфигурация

Если вы используете Nginx как reverse proxy:

```nginx
server {
    listen 80;
    server_name florale.ru www.florale.ru;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name florale.ru www.florale.ru;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # PWA Headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    # Service Worker
    location /sw.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
        expires off;
        access_log off;
    }

    # Manifest
    location /manifest.json {
        add_header Cache-Control "public, max-age=3600";
    }

    # Static files
    location /_next/static/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        proxy_pass http://localhost:3000;
    }

    # All other requests
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📱 Настройка PWA

### 1. Генерация иконок

Используйте [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator):

1. Загрузите логотип (512x512 px минимум)
2. Скачайте сгенерированные иконки
3. Поместите в `/public/icons/`

### 2. Проверка PWA

Используйте Chrome DevTools:
1. Откройте DevTools (F12)
2. Перейдите в "Application" → "Manifest"
3. Проверьте все поля
4. Перейдите в "Service Workers"
5. Убедитесь, что Service Worker активен

### 3. Тестирование установки

**Desktop (Chrome/Edge)**:
- Должна появиться иконка установки в адресной строке

**Mobile (Android)**:
- При просмотре появится banner "Добавить на главный экран"

**Mobile (iOS)**:
- Safari → Share → "Add to Home Screen"

## 🔐 SSL сертификат

### Let's Encrypt (бесплатный)

```bash
# Установка certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d florale.ru -d www.florale.ru

# Auto-renewal
sudo certbot renew --dry-run
```

## 🔍 Мониторинг и аналитика

### Google Analytics

1. Создайте property в [Google Analytics](https://analytics.google.com)
2. Получите Measurement ID
3. Добавьте в `app/layout.tsx`:

```typescript
import Script from 'next/script'

// В component
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### Sentry (Error tracking)

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

## 📊 Performance оптимизация

### Lighthouse CI

```bash
npm install -g @lhci/cli

# Создайте lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    }
  }
}

# Запуск
lhci autorun
```

## 🗄️ База данных

Когда будете готовы заменить mock данные:

### PostgreSQL + Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Int
  // ... другие поля
}
```

### Supabase (рекомендуется для начала)

1. Создайте проект на [supabase.com](https://supabase.com)
2. Установите клиент:
```bash
npm install @supabase/supabase-js
```

3. Создайте `/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

## 💳 Платежная система

### ЮKassa (рекомендуется для РФ)

```bash
npm install @a2seven/yoo-checkout
```

### Stripe (международная)

```bash
npm install stripe @stripe/stripe-js
```

## 📧 Email уведомления

### SendGrid

```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const msg = {
  to: 'customer@example.com',
  from: 'noreply@florale.ru',
  subject: 'Заказ оформлен',
  html: '<strong>Ваш заказ...</strong>',
}

await sgMail.send(msg)
```

## 🚨 Troubleshooting

### Service Worker не обновляется

```bash
# Очистите кэш
rm -rf .next
npm run build
```

### Изображения не загружаются

Проверьте `next.config.js`:
```javascript
images: {
  domains: ['your-cdn-domain.com'],
}
```

### CORS ошибки с API

В API добавьте headers:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте [Next.js документацию](https://nextjs.org/docs)
2. Проверьте issues в GitHub
3. Создайте новый issue с описанием проблемы

---

**Автор**: Florale Development Team  
**Последнее обновление**: Февраль 2026
