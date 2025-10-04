# 🤖 AI Assistant Marketplace - Philadelphia, PA

[![CI/CD Pipeline](https://github.com/romasimf1/ai-assistant-marketplace/actions/workflows/ci.yml/badge.svg)](https://github.com/romasimf1/ai-assistant-marketplace/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Полнофункциональная платформа маркетплейса ИИ-ассистентов для жителей Филадельфии

## 🌟 О проекте

AI Assistant Marketplace - это современная full-stack платформа, соединяющая жителей Филадельфии с специализированными ИИ-ассистентами для повседневных задач. Платформа включает аутентификацию, управление заказами, систему отзывов и интеграцию с внешними AI сервисами.

## 🚀 Возможности

### 👤 Пользовательские возможности
- **Регистрация и аутентификация** с JWT токенами
- **Личный кабинет** с историей заказов
- **Система отзывов** и рейтингов
- **Безопасные платежи** через Stripe
- **Поддержка локализации** для Филадельфии

### 🤖 AI Ассистенты
- **Каталог ассистентов** с фильтрацией и поиском
- **Демо-режим** для тестирования
- **Специализация** по категориям (еда, транспорт, здоровье)
- **Голосовые интерфейсы** с ElevenLabs
- **Интеграция** с OpenAI и другими AI сервисами

### 💼 Управление заказами
- **Создание заказов** с гибкой конфигурацией
- **Отслеживание статуса** в реальном времени
- **История транзакций** и платежей
- **Автоматические уведомления**

## 🛠️ Технический стек

### Backend
- **Runtime:** Node.js 18 LTS
- **Framework:** Express.js 5
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT с refresh tokens
- **Security:** Helmet, CORS, Rate Limiting
- **Validation:** Joi schemas
- **Testing:** Vitest + Coverage

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Fetch API с custom hooks

### DevOps & Tools
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Code Quality:** ESLint + Prettier
- **Version Control:** Git
- **API Documentation:** OpenAPI 3.0

## 📁 Структура проекта

```
ai-assistant-marketplace/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Helper functions
│   ├── prisma/              # Database schema
│   ├── tests/               # Backend tests
│   └── docs/                # API documentation
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   └── lib/             # Utilities & stores
│   └── public/              # Static assets
├── .github/                 # GitHub configuration
│   ├── workflows/           # CI/CD pipelines
│   └── dependabot.yml       # Dependency updates
└── docker-compose.yml       # Local development setup
```

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- PostgreSQL 15+
- Git
- Docker (опционально)

### Локальная установка

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/romasimf1/ai-assistant-marketplace.git
   cd ai-assistant-marketplace
   ```

2. **Запуск с Docker (рекомендуется)**
   ```bash
   docker-compose up --build
   ```

3. **Ручная установка**

   **Backend:**
   ```bash
   cd backend
   npm install
   cp env-example.txt .env
   # Отредактируйте .env файл
   npm run prisma:generate
   npm run prisma:push
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Доступ к приложению
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health
- **API Docs:** http://localhost:3001/api/docs

## 🔧 Конфигурация

### Environment Variables

Создайте `.env` файлы в папках `backend/` и `frontend/`:

```bash
# Backend .env
DATABASE_URL="postgresql://user:pass@localhost:5432/ai_marketplace"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
ELEVENLABS_API_KEY="your-elevenlabs-key"
OPENAI_API_KEY="your-openai-key"
STRIPE_SECRET_KEY="your-stripe-key"

# Frontend .env.local
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
```

## 🧪 Тестирование

### Backend тесты
```bash
cd backend
npm run test              # Запуск всех тестов
npm run test:coverage     # С покрытием кода
npm run test:ui          # В интерактивном режиме
```

### Frontend тесты
```bash
cd frontend
npm run test
```

## 🚢 Развертывание

### Production deployment

1. **Настройте переменные окружения** в GitHub Secrets
2. **Включите GitHub Actions** для автоматического развертывания
3. **Настройте домен** и SSL сертификаты

### Docker deployment

```bash
# Production сборка
docker-compose -f docker-compose.prod.yml up --build
```

## 🔒 Безопасность

### Реализованные меры безопасности
- **Password Hashing:** bcrypt с 12 раундами
- **JWT Tokens:** Короткие сроки жизни (15 мин access, 7 дней refresh)
- **Rate Limiting:** 100 запросов за 15 минут
- **Input Validation:** Joi schemas и Zod валидация
- **CORS:** Строгая конфигурация разрешенных origins
- **Security Headers:** Helmet middleware
- **SQL Injection Protection:** Prisma ORM

### Рекомендации
- Регулярно обновляйте зависимости
- Используйте strong пароли
- Включайте 2FA для GitHub аккаунта
- Мониторьте логи на подозрительную активность

## 🤝 Содействие

Мы приветствуем вклад в развитие проекта!

### Как внести вклад
1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'feat: add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Создайте Pull Request

### Соглашения
- **Commits:** Conventional Commits
- **Code Style:** ESLint + Prettier
- **Tests:** Минимум 80% покрытия
- **Documentation:** Обновляйте README при изменениях

## 📊 Мониторинг и аналитика

### Метрики производительности
- **API Response Time:** < 200ms для простых запросов
- **Database Queries:** Оптимизированные запросы
- **Bundle Size:** Мониторинг размера бандла
- **Core Web Vitals:** Google метрики производительности

### Логирование
- **Error Logging:** Централизованная обработка ошибок
- **Request Logging:** Morgan middleware
- **Database Logging:** Prisma query logging
- **Security Events:** Аудит логов

## 🗺️ Roadmap

### Краткосрочные цели (3-6 месяцев)
- [ ] Полная интеграция с ElevenLabs для голоса
- [ ] Stripe платежи для заказов
- [ ] Real-time уведомления через WebSockets
- [ ] Мобильное приложение React Native

### Долгосрочные цели (6-12 месяцев)
- [ ] Multi-region развертывание
- [ ] GraphQL API наряду с REST
- [ ] AI-powered рекомендаций ассистентов
- [ ] Интеграция с Philadelphia government APIs

## 📞 Поддержка

- **Issues:** [GitHub Issues](https://github.com/romasimf1/ai-assistant-marketplace/issues)
- **Discussions:** [GitHub Discussions](https://github.com/romasimf1/ai-assistant-marketplace/discussions)
- **Email:** support@ai-assistant-marketplace.com

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 🙏 Благодарности

- **Philadelphia Community** - за вдохновение и поддержку
- **Open Source Community** - за прекрасные инструменты
- **Contributors** - за вклад в развитие проекта

---

**Built with ❤️ for Philadelphia, PA** 🔔

*Связь Филадельфии с будущим через ИИ-ассистентов*