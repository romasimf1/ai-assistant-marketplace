# Настройка секретов GitHub для CI/CD

## Необходимые секреты для репозитория

Перейдите в **Settings** → **Secrets and variables** → **Actions** и добавьте следующие секреты:

### База данных
```
DATABASE_URL=postgresql://username:password@host:5432/ai_assistant_marketplace
```

### JWT секреты
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
```

### Внешние API ключи
```
ELEVENLABS_API_KEY=your-elevenlabs-api-key
OPENAI_API_KEY=your-openai-api-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### Переменные окружения
```
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
```

## Как добавить секреты:

1. В репозитории нажмите **Settings**
2. В левом меню выберите **Secrets and variables** → **Actions**
3. Нажмите **New repository secret**
4. Введите **Name** и **Secret** значение
5. Нажмите **Add secret**

## Пример использования в GitHub Actions:

```yaml
- name: Deploy to production
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
    ELEVENLABS_API_KEY: ${{ secrets.ELEVENLABS_API_KEY }}
  run: |
    # Ваши команды развертывания
```

## Безопасность

- Никогда не коммитьте секреты в код
- Используйте разные секреты для разных сред (dev/staging/prod)
- Регулярно обновляйте секреты
- Ограничивайте доступ к секретам только необходимым workflow'ам
