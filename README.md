# Проект бургерной
сайт можно посмотреть по ссылке: https://kasstel.github.io/burger-shop/

**React-приложение для заказа бургеров с интерактивным конструктором**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)

---

## 📖 О проекте

Burgers - это современное веб-приложение для заказа космических бургеров с уникальным интерактивным конструктором. Пользователи могут создавать собственные бургеры, отслеживать заказы в реальном времени и управлять своим профилем.

### 🎯 Ключевые особенности

- **🍔 Интерактивный конструктор** бургеров с drag-and-drop функциональностью
- **🔐 Полная система аутентификации** с защищенными маршрутами
- **📱 Адаптивный интерфейс** с современным дизайном
- **📊 История заказов** с отслеживанием статусов

### 🛠 Технологический стек

**Frontend:**
- React 18 с функциональными компонентами и хуками
- TypeScript для строгой типизации
- Redux Toolkit для управления состоянием
- CSS Modules для изолированных стилей

**Инструменты разработки:**
- Webpack для сборки проекта
- ESLint для проверки кода
- Prettier для форматирования
- Storybook для документации компонентов

---

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Данные без сервера

Бэкенд проекту не нужен, файл `.env` тоже:

- ингредиенты лежат в `src/data/ingredients.ts` — чтобы добавить новый, допишите строку в массив булок, начинок или соусов;
- готовые бургеры для страницы меню описаны в `src/data/burgers.ts`: название, описание, фото из `src/images` и список `_id` ингредиентов; цена считается из состава;
- заказ оформляется из корзины: несколько бургеров, самовывоз или доставка, комментарий;
- время готовности и этапы заказа считаются в `src/utils/order-progress.ts`. Демо ускорено в 15 раз (`TIME_SCALE`), чтобы прогресс было видно: «15 минут» проходят за минуту. Поставьте `1` для реального времени;
- фото ингредиентов берутся с [TheMealDB](https://www.themealdb.com) по английскому названию продукта;
- пользователи и заказы хранятся в `localStorage` браузера (`src/utils/mock-db.ts`), поэтому у каждого посетителя они свои, а пароли лежат в открытом виде — это демо.

### Запуск в режиме разработки

```bash
npm run start
```

### Сборка production-версии

```bash
npm run build
```

### Запуск Storybook

```bash
npm run storybook
```

### Системные требования
- Node.js 16+
- Современный браузер с поддержкой ES6+

---

## 📁 Структура проекта

```
src/
├── components/          # Компоненты приложения
│   ├── app-header/     # Шапка приложения
│   ├── burger-constructor/ # Конструктор бургеров
│   ├── burger-ingredients/ # Ингредиенты
│   ├── modal/          # Модальные окна
│   ├── order-card/     # Карточка заказа
│   ├── order-info/     # Информация о заказе
│   ├── protected-route/ # Защищенные маршруты
│   └── ui/            # Базовые UI компоненты
├── pages/              # Страницы приложения
│   ├── constructor-page/ # Главная страница
│   ├── feed/           # Лента заказов
│   ├── login/          # Страница входа
│   ├── profile/        # Профиль пользователя
│   ├── register/       # Страница регистрации
│   └── ...            # Другие страницы
├── services/           # Сервисы и хранилище
│   ├── slices/         # Слайсы Redux
│   └── store.ts        # Настройка хранилища
├── utils/              # Вспомогательные утилиты
│   ├── burger-api.ts   # API функции
│   ├── cookie.ts       # Работа с cookies
│   └── types.ts        # TypeScript типы
└── styles/             # Стили и ресурсы
    ├── fonts/          # Шрифты
    ├── images/         # Изображения
    └── index.css       # Глобальные стили
```

---

## 🎨 Особенности реализации

### Управление состоянием с Redux Toolkit

```typescript
// Пример слайса для ингредиентов
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<IIngredient[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});
```

### Защищенные маршруты

```tsx
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
```


## 🎯 Результаты реализации

**Достигнутые цели:**
- ✅ Полнофункциональный конструктор бургеров
- ✅ Обновление ленты заказов
- ✅ Защищенные маршруты и авторизация
- ✅ Адаптивный интерфейс для всех устройств
- ✅ TypeScript для типобезопасности

**Технические преимущества:**
- Чистая архитектура компонентов
- Оптимизированное управление состоянием
- Модульные стили с CSS Modules
- Высокая производительность

---

## 🔮 Планы по развитию

- [ ] **PWA-функциональность** - оффлайн работа и установка на устройство
- [ ] **Интеграция с платежными системами** - расширение способов оплаты
- [ ] **Панель администратора** - управление заказами и ингредиентами
- [ ] **Мобильное приложение** - на React Native
- [ ] **Система рекомендаций** - персональные предложения

---

## 👩‍💻 Разработчик

**Лунев Никита** - Frontend Developer

---

## 📄 Лицензия

Проект разработан для демонстрации современных подходов к разработке React-приложений с использованием TypeScript, Redux Toolkit и современных инструментов разработки.

[Макет](<https://www.figma.com/file/vIywAvqfkOIRWGOkfOnReY/React-Fullstack_-Проектные-задачи-(3-месяца)_external_link?type=design&node-id=0-1&mode=design>)

---



