# Бесплатные альтернативы CI/CD для GitHub Actions

Поскольку ваш GitHub аккаунт имеет ограничения на Actions, вот альтернативные бесплатные решения для CI/CD:

## 🚀 1. Vercel (Рекомендуется для Frontend)

### Преимущества:
- ✅ Бесплатный для frontend проектов
- ✅ Автоматическое развертывание из GitHub
- ✅ Preview deployments для PR
- ✅ Встроенный CDN и SSL
- ✅ Интеграция с Next.js

### Настройка:

1. **Регистрация:** https://vercel.com
2. **Подключение GitHub:** Dashboard → Import Project → From GitHub
3. **Выбор репозитория:** `ai-assistant-marketplace`
4. **Настройки:**
   - **Framework:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`

### Environment Variables для Vercel:
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
```

## 🔧 2. Railway (Full-Stack)

### Преимущества:
- ✅ Бесплатный tier (512MB RAM, 1GB storage)
- ✅ PostgreSQL база данных включена
- ✅ Автоматическое развертывание
- ✅ Docker поддержка

### Настройка:

1. **Регистрация:** https://railway.app
2. **Создание проекта:** New Project → Deploy from GitHub
3. **Подключение репозитория**
4. **Database:** Add PostgreSQL
5. **Environment Variables:**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   NODE_ENV=production
   ```

## 📦 3. Render (Backend + Database)

### Преимущества:
- ✅ Бесплатный tier (750 часов/месяц)
- ✅ PostgreSQL база данных
- ✅ Docker поддержка
- ✅ Cron jobs

### Настройка:

1. **Регистрация:** https://render.com
2. **Создание сервисов:**
   - **Web Service** для backend (Docker)
   - **PostgreSQL** для базы данных
3. **Подключение GitHub**
4. **Environment Variables:**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   ```

## 🐙 4. GitHub Pages + Actions (Ограниченный)

Если Actions заработают, можно настроить только frontend:

```yaml
# .github/workflows/frontend-only.yml
name: Deploy Frontend
on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json

    - name: Install dependencies
      run: cd frontend && npm ci

    - name: Build
      run: cd frontend && npm run build

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./frontend/out
```

## 🔄 5. Netlify (Frontend)

### Преимущества:
- ✅ Бесплатный для static сайтов
- ✅ Формы и функции
- ✅ Preview deployments

### Настройка:
1. **Регистрация:** https://netlify.com
2. **Import from Git:** Connect to GitHub
3. **Build settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `out`

## 📊 Сравнение бесплатных планов:

| Сервис | Frontend | Backend | Database | Build Minutes |
|--------|----------|---------|----------|---------------|
| **Vercel** | ✅ Полный | ❌ | ❌ | 6,000/месяц |
| **Railway** | ✅ | ✅ Ограничено | ✅ PostgreSQL | 512 часов |
| **Render** | ✅ | ✅ | ✅ PostgreSQL | 750 часов |
| **Netlify** | ✅ Static | ❌ | ❌ | 300/месяц |
| **GitHub Pages** | ✅ Static | ❌ | ❌ | 2,000/месяц* |

\* - если Actions заработают

## 🎯 Рекомендуемая архитектура:

### Опция 1: Vercel + Railway
- **Frontend:** Vercel (бесплатно)
- **Backend:** Railway (бесплатный tier)
- **Database:** Railway PostgreSQL (включено)

### Опция 2: Vercel + Render
- **Frontend:** Vercel (бесплатно)
- **Backend:** Render (750 часов)
- **Database:** Render PostgreSQL (бесплатно)

### Опция 3: Полный Railway
- **Frontend:** Railway (static site)
- **Backend:** Railway (Node.js)
- **Database:** Railway PostgreSQL

## 🚀 Быстрый старт:

1. **Создайте аккаунты** на выбранных платформах
2. **Подключите GitHub** репозиторий
3. **Настройте environment variables**
4. **Разверните** приложение

## 💡 Советы:

- **Начинайте с Vercel** для frontend - это проще всего
- **Используйте Railway** для полного стека
- **Тестируйте локально** перед развертыванием
- **Мониторьте usage** чтобы не превысить лимиты
- **Настройте домен** для production

## 🔧 Локальная разработка:

Пока CI/CD не настроен, используйте локальную разработку:

```bash
# С Docker
docker-compose up --build

# Или вручную
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2
```

**Хотите настроить один из этих сервисов?**
