# 🤖 AI Assistant Marketplace - Philadelphia

**Полнофункциональная платформа для AI-ассистентов в Филадельфии с поддержкой голосовых взаимодействий**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-green)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-cyan)](https://tailwindcss.com/)

## 📋 Оглавление

- [🚀 Быстрый запуск](#-быстрый-запуск)
- [🎯 Что реализовано](#-что-реализовано)
- [📁 Структура проекта](#-структура-проекта)
- [🔧 Технический стек](#-технический-стек)
- [🔑 Аутентификация](#-аутентификация)
- [🗄️ База данных](#️-база-данных)
- [🌐 API Endpoints](#-api-endpoints)
- [🎨 UI Компоненты](#-ui-компоненты)
- [🧪 Тестирование](#-тестирование)
- [🚀 Развертывание](#-развертывание)
- [📋 Что еще нужно сделать](#-что-ещё-нужно-сделать)
- [🤝 Поддержка](#-поддержка)

---

## 🚀 Быстрый запуск

### Через Docker (рекомендуется)
```bash
# Клонирование репозитория
git clone <repository-url>
cd ai-assistant-marketplace

# Запуск всех сервисов
docker-compose up --build

# Или в фоне
docker-compose up --build -d
```

### Локально (для разработки)
```bash
# Backend
cd backend
npm install
npm run prisma:generate
npm run dev

# Frontend (в новом терминале)
cd ../frontend
npm install
npm run dev
```

## 📍 URLs

- **🏠 Главная страница**: http://localhost:3000
- **🏪 Маркетплейс**: http://localhost:3000/marketplace
- **🔐 Аутентификация**: http://localhost:3000/auth
- **🔧 Backend API**: http://localhost:3001
- **💚 Health Check**: http://localhost:3001/health

---

## 🎯 Что реализовано ✅

### 🔐 Полная система аутентификации
- ✅ Регистрация пользователей с валидацией
- ✅ Вход в систему с JWT токенами
- ✅ Refresh tokens для безопасности
- ✅ Защищенные маршруты
- ✅ Профиль пользователя
- ✅ Выход из системы

### 🎨 Современный UI/UX
- ✅ Адаптивный дизайн (Next.js 15 + React 19)
- ✅ shadcn/ui компоненты
- ✅ Tailwind CSS стилизация
- ✅ Темная/светлая тема
- ✅ Анимации и переходы

### 🗄️ База данных
- ✅ PostgreSQL с Prisma ORM
- ✅ Миграции и схема БД
- ✅ Type-safe запросы
- ✅ Отношения между таблицами

### 🔧 Backend API
- ✅ RESTful API с Express.js
- ✅ TypeScript типизация
- ✅ Middleware аутентификации
- ✅ Валидация данных (Joi)
- ✅ CORS конфигурация

### 🎪 Фронтенд функции
- ✅ Клиент-серверная архитектура
- ✅ State management (Zustand)
- ✅ API интеграция
- ✅ Обработка ошибок
- ✅ Условный рендеринг UI

### 📱 Адаптивность
- ✅ Mobile-first дизайн
- ✅ Responsive компоненты
- ✅ Cross-browser совместимость

---

## 📁 Структура проекта

```
ai-assistant-marketplace/
├── backend/                          # 🟢 Node.js/Express API
│   ├── src/
│   │   ├── controllers/              # 🎯 Обработчики маршрутов
│   │   ├── middleware/               # 🛡️  Middleware (auth, cors, etc.)
│   │   ├── routes/                   # 🛣️  API маршруты
│   │   ├── services/                 # ⚙️  Бизнес-логика
│   │   ├── types/                    # 📝 TypeScript типы
│   │   └── utils/                    # 🛠️  Утилиты (config, database)
│   ├── prisma/                       # 🗄️  Схема БД и миграции
│   ├── tests/                        # 🧪 Тесты
│   └── Dockerfile                    # 🐳 Docker конфигурация
├── frontend/                         # 🔵 Next.js приложение
│   ├── src/
│   │   ├── app/                      # 📱 Next.js 13+ app router
│   │   │   ├── auth/                 # 🔐 Страница аутентификации
│   │   │   ├── marketplace/          # 🏪 Страница маркетплейса
│   │   │   └── page.tsx              # 🏠 Главная страница
│   │   ├── components/               # 🧩 React компоненты
│   │   │   ├── auth/                 # 🔐 Компоненты аутентификации
│   │   │   └── ui/                   # 🎨 UI компоненты (shadcn/ui)
│   │   ├── hooks/                    # 🎣 Custom hooks
│   │   ├── lib/                      # 📚 Утилиты и store
│   │   └── types/                    # 📝 TypeScript типы
│   └── Dockerfile                    # 🐳 Docker конфигурация
├── docker-compose.yml                # 🐳 Docker Compose
└── README.md                         # 📖 Документация
```

---

## 🔧 Технический стек

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript 5
- **Database**: PostgreSQL 15 + Prisma ORM
- **Auth**: JWT tokens + bcrypt
- **Validation**: Joi schemas
- **Security**: Helmet, CORS, Rate limiting

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI**: shadcn/ui components
- **State**: Zustand store
- **Icons**: Lucide React

### DevOps
- **Container**: Docker & Docker Compose
- **Database**: PostgreSQL (production) / SQLite (dev)
- **Linting**: ESLint
- **Formatting**: Prettier

---

## 🔑 Аутентификация

### Регистрация пользователя
```typescript
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "securepass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### Вход в систему
```typescript
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

### Получение профиля
```typescript
GET /api/v1/auth/profile
Authorization: Bearer <access_token>
```

---

## 🗄️ База данных

### Схема данных
```prisma
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  passwordHash    String
  firstName       String?
  lastName        String?
  phone           String?
  address         Json?
  preferences     Json?
  subscriptionTier String  @default("free")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  orders          Order[]
  transactions    Transaction[]
  reviews         Review[]
}

model Assistant {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  description     String
  category        String
  voiceConfig     Json
  aiModel         String   @default("gpt-4")
  pricing         Json
  isActive        Boolean  @default(true)
  demoAvailable   Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  orders          Order[]
  reviews         Review[]
}
```

### Работа с БД
```bash
# Генерация Prisma клиента
cd backend && npm run prisma:generate

# Применение миграций
npm run prisma:push

# Просмотр БД в браузере
npm run prisma:studio
```

---

## 🌐 API Endpoints

### Аутентификация
- `POST /api/v1/auth/register` - Регистрация пользователя
- `POST /api/v1/auth/login` - Вход в систему
- `POST /api/v1/auth/refresh` - Обновление токена
- `GET /api/v1/auth/profile` - Получение профиля
- `POST /api/v1/auth/logout` - Выход из системы

### Пользователи
- `GET /api/v1/users/stats` - Статистика пользователя
- `GET /api/v1/users/orders` - Заказы пользователя
- `GET /api/v1/users/reviews` - Отзывы пользователя

### Ассистенты
- `GET /api/v1/assistants` - Список ассистентов
- `GET /api/v1/assistants/:id` - Детали ассистента

### Заказы
- `GET /api/v1/orders` - Список заказов
- `POST /api/v1/orders` - Создание заказа

---

## 🎨 UI Компоненты

### Аутентификация
- `LoginForm` - Форма входа с валидацией
- `RegisterForm` - Форма регистрации с чекбоксом условий
- `AuthPage` - Страница аутентификации с переключением режимов

### Навигация
- Динамическая навигационная панель
- Аватар пользователя с инициалами
- Адаптивное меню для мобильных устройств

### UI Библиотека
- Button, Input, Card, Badge, Avatar
- Alert, Dialog, Dropdown Menu
- Form components с валидацией

---

## 🧪 Тестирование

### Backend тесты
```bash
cd backend
npm test                    # Запуск всех тестов
npm run test:coverage      # С покрытием кода
npm run test:ui            # С интерфейсом
```

### Frontend тесты
```bash
cd frontend
npm run lint               # Проверка кода
npm run build              # Проверка сборки
```

### API тестирование
```bash
# Регистрация
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Вход
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🚀 Развертывание

### Production сборка
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd ../frontend
npm run build
npm start
```

### Docker развертывание
```bash
# Сборка образов
docker-compose build

# Запуск в фоне
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

### Environment переменные
```bash
# .env файл
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
NODE_ENV="production"
```

---

## 📋 Что ещё нужно сделать

### 🚨 Критично (Priority High)
- [ ] **Обработка ошибок UI** - Показывать user-friendly сообщения об ошибках
- [ ] **Loading states** - Индикаторы загрузки для всех асинхронных операций
- [ ] **Form validation UI** - Визуальная обратная связь при ошибках валидации

### ⚡ Важно (Priority Medium)
- [ ] **Password reset** - Восстановление пароля через email
- [ ] **Email verification** - Подтверждение email при регистрации
- [ ] **User roles** - Система ролей (admin, user, premium)
- [ ] **File uploads** - Загрузка аватаров пользователей
- [ ] **Pagination** - Пагинация для списков (заказы, отзывы)

### 🎨 UI/UX улучшения
- [ ] **Dashboard** - Личный кабинет пользователя
- [ ] **Order history** - История заказов с деталями
- [ ] **Notifications** - Система уведомлений
- [ ] **Search & filters** - Поиск и фильтрация ассистентов
- [ ] **Favorites** - Избранные ассистенты

### 🔧 Backend доработки
- [ ] **Rate limiting** - Ограничение количества запросов
- [ ] **Caching** - Redis для кэширования данных
- [ ] **Logging** - Структурированное логирование
- [ ] **Monitoring** - Метрики и алерты
- [ ] **API documentation** - Swagger/OpenAPI docs

### 🧪 Качество кода
- [ ] **Unit tests** - Покрытие тестами 80%+
- [ ] **E2E tests** - Автоматизированные UI тесты
- [ ] **Performance** - Оптимизация загрузки страниц
- [ ] **Accessibility** - WCAG 2.1 AA compliance
- [ ] **SEO optimization** - Meta tags, sitemap

### 🚀 Продакшн
- [ ] **CI/CD pipeline** - Автоматическое развертывание
- [ ] **Database migrations** - Безопасные миграции в продакшн
- [ ] **Backup strategy** - Резервное копирование данных
- [ ] **Security audit** - Проверка безопасности
- [ ] **Monitoring setup** - Логирование и метрики

---

## 🤝 Поддержка

### 📞 Контакты
- **Email**: support@ai-assistants-philly.com
- **GitHub Issues**: Создавайте issues для багов и фич

### 🐛 Сообщение о багах
Пожалуйста, указывайте:
- Шаги для воспроизведения
- Ожидаемое поведение
- Фактическое поведение
- Скриншоты (если применимо)
- Версию браузера и ОС

### 💡 Предложения фич
Описывайте:
- Проблему, которую решает фича
- Как это улучшит UX
- Альтернативные решения

---

## 📜 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей.

---

**🎉 Проект готов к использованию! Backend и Frontend полностью функциональны с аутентификацией, базой данных и красивым UI.**
