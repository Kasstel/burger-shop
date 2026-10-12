# Burger Builder — сайт-конструктор бургеров без бэкенда

Этот файл — полное задание на сборку проекта с нуля в пустой папке. Сайт повторяет логику
старого проекта `stellar-burgers` (конструктор бургера, лента заказов, авторизация, профиль),
но работает без сервера: данные ингредиентов лежат в коде, а пользователи и заказы — в
`localStorage`. Фото ингредиентов новые — реальные продукты с TheMealDB.

Интерфейс на русском языке. Писать код в том же стиле, что описан ниже; не добавлять функции,
которых здесь нет.

## Почему без API

Старый бэкенд `https://norma.education-services.ru/api` больше не отвечает. Открытого API,
который отдавал бы ингредиенты бургера с типом, ценой и БЖУ, нет. Поэтому:

- **Данные и «сервер»** — локальный мок в `src/utils/burger-api.ts` с теми же функциями и теми
  же форматами ответов, что были у настоящего API. Слайсы и компоненты про мок не знают, так
  что позже его можно заменить на настоящий `fetch`, не трогая остальной код.
- **Фото** — картинки ингредиентов TheMealDB, отдаются без ключа и с `Access-Control-Allow-Origin: *`:
  - `https://www.themealdb.com/images/ingredients/{Name}.png` — 850×850 → `image_large`
  - `https://www.themealdb.com/images/ingredients/{Name}-Medium.png` — 350×350 → `image`
  - `https://www.themealdb.com/images/ingredients/{Name}-Small.png` — 200×200 → `image_mobile`

  Пробелы в `{Name}` кодировать как `%20`. Перед публичным релизом проверить условия
  использования на themealdb.com. Чтобы перейти на свои фото, достаточно положить файлы в
  `public/images/` и поменять три поля `image*` в данных.

## Стек

- Vite + React 18 + TypeScript (strict). React именно 18: UI-кит не поддерживает 19.
- Redux Toolkit 2 + react-redux 9, `createAsyncThunk`, селекторы внутри `createSlice`.
- react-router-dom 6, `HashRouter` (сайт деплоится на GitHub Pages).
- `@zlden/react-developer-burger-ui-components` — UI-кит (тёмная тема, классы `text text_type_*`,
  отступы `mt-10`, `pl-5` и т.п.). Используемые компоненты: `Tab`, `Button`, `Input`,
  `PasswordInput`, `ConstructorElement`, `MoveButton`, `AddButton`, `RefreshButton`, `Counter`,
  `FormattedDate`, `CurrencyIcon`, `BurgerIcon`, `ListIcon`, `ProfileIcon`, `CloseIcon`.
- `react-intersection-observer` — подсветка активной вкладки при скролле.
- `nanoid` — добавить в `dependencies` явно.
- CSS Modules для стилей. Jest (ts-jest) для слайсов, Cypress для e2e.

Первым шагом после установки отрендерить `Button` и `Tab` из UI-кита и убедиться, что стили
применились. Кит собран как CommonJS; если под Vite он не заработает — собрать проект на
webpack 5 (`ts-loader`, `style-loader` + `css-loader` с `modules: true` для `*.module.css`,
`asset/resource` для картинок, `html-webpack-plugin`), остальная инструкция не меняется.

Команды: `npm run dev`, `npm run build`, `npm run test`, `npm run lint`, `npm run deploy`
(`gh-pages -d dist`). В `vite.config.ts` задать `base` под имя репозитория.

## Типы данных (`src/utils/types.ts`)

Это ровно те типы, что приходили со старого API. Не переименовывать поля.

```ts
export type TTabMode = 'bun' | 'sauce' | 'main';
export type TIngredientType = TTabMode | 'top' | 'bottom';

export type TIngredient = {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;        // карточка и строка конструктора
  image_large: string;  // модалка деталей
  image_mobile: string; // кружки в карточке заказа
};

// экземпляр в конструкторе: id уникален для каждого добавления, _id — id ингредиента
export type TConstructorIngredient = TIngredient & { id: string };

export type TOrder = {
  _id: string;
  status: string;        // 'created' | 'pending' | 'done'
  name: string;
  createdAt: string;     // ISO
  updatedAt: string;     // ISO
  number: number;
  ingredients: string[]; // _id ингредиентов; булка идёт первой и последней
};

export type TOrdersData = { orders: TOrder[]; total: number; totalToday: number };
export type TUser = { email: string; name: string };
```

## Контракт API (`src/utils/burger-api.ts`)

Все функции возвращают `Promise` и отвечают с задержкой 300–600 мс, чтобы прелоадеры были
видны. Ошибка — `Promise.reject({ success: false, message })`. Сигнатуры и формы ответов
сохранить такими (в скобках — эндпоинт старого сервера, которому соответствует функция):

| Функция | Аргумент | Результат |
|---|---|---|
| `getIngredientsApi()` (`GET /ingredients`) | — | `TIngredient[]` |
| `getFeedsApi()` (`GET /orders/all`) | — | `{ success, orders: TOrder[], total, totalToday }` |
| `getOrdersApi()` (`GET /orders`, нужен вход) | — | `TOrder[]` текущего пользователя |
| `orderBurgerApi(ids)` (`POST /orders`, нужен вход) | `string[]` | `{ success, name, order: TOrder }` |
| `getOrderByNumberApi(n)` (`GET /orders/:number`) | `number` | `{ success, orders: TOrder[] }` |
| `registerUserApi(data)` (`POST /auth/register`) | `{ email, name, password }` | `{ success, accessToken, refreshToken, user }` |
| `loginUserApi(data)` (`POST /auth/login`) | `{ email, password }` | `{ success, accessToken, refreshToken, user }` |
| `getUserApi()` (`GET /auth/user`) | — | `{ success, user }` |
| `updateUserApi(data)` (`PATCH /auth/user`) | `Partial<{ email, name, password }>` | `{ success, user }` |
| `logoutApi()` (`POST /auth/logout`) | — | `{ success }` |
| `forgotPasswordApi(data)` (`POST /password-reset`) | `{ email }` | `{ success }` |
| `resetPasswordApi(data)` (`POST /password-reset/reset`) | `{ password, token }` | `{ success }` |

### Как устроен мок

Хранилище — `localStorage`, все ключи с префиксом `bb:`. Чтение и запись вынести в
`src/utils/mock-db.ts`, чтобы `burger-api.ts` остался тонким.

- `bb:users` — `{ id, email, name, password }[]`. Пароль хранится открыто: это демо без
  сервера, написать об этом в README и на странице регистрации не просить «настоящий» пароль.
- `bb:orders` — `(TOrder & { userId: string })[]`. Поле `userId` наружу не отдавать.
- `bb:order-number` — счётчик номеров, начинается с 1000.
- Сессия как в старом проекте: `accessToken` в cookie (`src/utils/cookie.ts` с `getCookie`,
  `setCookie`, `deleteCookie`), `refreshToken` в `localStorage`. Токен — `mock.<userId>`.
  Функции «нужен вход» читают cookie и отклоняют запрос с `message: 'Вы не авторизованы'`,
  если пользователя нет.
- Регистрация: отклонять занятый email. Вход: отклонять неверную пару email/пароль.
- Статус заказа вычислять при чтении по `createdAt`: младше 20 секунд — `pending`, иначе
  `done`. Так заказ сам «доготавливается» при обновлении ленты.
- Название заказа собирать из булки: `«{имя булки} бургер»`.
- `getFeedsApi`: `total` — количество заказов со статусом `done`, `totalToday` — из них
  созданные сегодня. Отдавать последние 50 заказов.
- При первом запуске, если `bb:orders` пуст, сгенерировать 15 заказов от «гостей» со
  случайным составом и временем за последние два дня, чтобы лента не была пустой.
- Сброс пароля: `forgotPasswordApi` проверяет, что email существует, кладёт шестизначный код в
  `bb:reset-code` и возвращает успех; страница сброса показывает подсказку «Демо-режим: код
  {код}». `resetPasswordApi` сверяет код и меняет пароль.

## Данные ингредиентов (`src/data/ingredients.ts`)

`_id` — строки вида `bun-01`. Цены и БЖУ — демонстрационные. `Имя картинки` подставлять в
шаблоны URL из раздела «Почему без API»; все имена проверены, картинки существуют.

| _id | name | type | Имя картинки | Б | Ж | У | ккал | Цена |
|---|---|---|---|---|---|---|---|---|
| bun-01 | Классическая булка | bun | Bun | 8 | 4 | 44 | 250 | 120 |
| bun-02 | Булка с кунжутом | bun | Buns | 9 | 5 | 46 | 270 | 140 |
| bun-03 | Чиабатта | bun | Ciabatta | 9 | 3 | 50 | 260 | 160 |
| bun-04 | Английский маффин | bun | English Muffins | 8 | 2 | 44 | 230 | 150 |
| bun-05 | Пита | bun | Pita Bread | 9 | 1 | 55 | 275 | 130 |
| main-01 | Говяжья котлета | main | Minced Beef | 26 | 20 | 0 | 290 | 390 |
| main-02 | Куриное филе | main | Chicken Breast | 31 | 4 | 0 | 165 | 320 |
| main-03 | Бекон | main | Bacon | 12 | 40 | 1 | 420 | 210 |
| main-04 | Лосось | main | Salmon | 20 | 13 | 0 | 208 | 450 |
| main-05 | Яйцо | main | Egg | 13 | 11 | 1 | 155 | 90 |
| main-06 | Сыр чеддер | main | Cheddar Cheese | 25 | 33 | 1 | 400 | 150 |
| main-07 | Моцарелла | main | Mozzarella | 22 | 22 | 2 | 280 | 160 |
| main-08 | Салат | main | Lettuce | 1 | 0 | 3 | 15 | 60 |
| main-09 | Томат | main | Tomato | 1 | 0 | 4 | 18 | 70 |
| main-10 | Красный лук | main | Red Onions | 1 | 0 | 9 | 40 | 50 |
| main-11 | Огурец | main | Cucumber | 1 | 0 | 4 | 15 | 50 |
| main-12 | Авокадо | main | Avocado | 2 | 15 | 9 | 160 | 180 |
| main-13 | Грибы | main | Mushrooms | 3 | 0 | 3 | 22 | 110 |
| main-14 | Халапеньо | main | Jalapeno | 1 | 0 | 6 | 29 | 80 |
| sauce-01 | Кетчуп | sauce | Tomato Ketchup | 1 | 0 | 26 | 110 | 40 |
| sauce-02 | Горчица | sauce | Mustard | 4 | 4 | 5 | 66 | 40 |
| sauce-03 | Майонез | sauce | Mayonnaise | 1 | 75 | 1 | 680 | 50 |
| sauce-04 | Соус барбекю | sauce | Barbeque Sauce | 1 | 1 | 41 | 172 | 60 |
| sauce-05 | Острый соус | sauce | Hotsauce | 1 | 0 | 2 | 12 | 60 |
| sauce-06 | Шрирача | sauce | Sriracha | 2 | 1 | 19 | 93 | 70 |
| sauce-07 | Чесночный соус | sauce | Garlic Sauce | 1 | 30 | 6 | 300 | 60 |
| sauce-08 | Сметана | sauce | Sour Cream | 2 | 20 | 3 | 200 | 50 |

### Добавление ингредиентов и своих фото

Новые ингредиенты добавляются только правкой `src/data/ingredients.ts` — формы на сайте нет.
Файл должен быть удобен для ручного редактирования, поэтому в нём два помощника:

```ts
// фото с TheMealDB по имени продукта
const mealDb = (name: string) => { /* возвращает { image, image_large, image_mobile } */ };
// свой файл из public/images/, один и тот же для всех трёх размеров
const local = (file: string) => { /* то же, путь через import.meta.env.BASE_URL */ };

export const ingredients: TIngredient[] = [
  { _id: 'bun-01', name: 'Классическая булка', type: 'bun', proteins: 8, fat: 4,
    carbohydrates: 44, calories: 250, price: 120, ...mealDb('Bun') },
  { _id: 'main-15', name: 'Моя котлета', type: 'main', proteins: 20, fat: 15,
    carbohydrates: 0, calories: 240, price: 300, ...local('my-patty.png') }
];
```

- Путь к своим фото собирать через `import.meta.env.BASE_URL`, а не от корня `/images/...`:
  на GitHub Pages сайт лежит в подпапке, и путь от корня даст битые картинки.
- `_id` уникален и не меняется после публикации: по нему сохранённые заказы находят
  ингредиент. Удалённый из файла ингредиент просто пропадает из старых заказов.
- Свои фото — квадратные PNG или WebP с прозрачным фоном, примерно 400×400.
- Вверху файла оставить короткий комментарий с этими правилами, а в README — раздел
  «Как добавить ингредиент».

## Структура проекта

Каждый компонент разделён на контейнер (хуки, стор, обработчики) и UI-компонент (только
пропсы и разметка). UI-компоненты не обращаются к стору.

```
src/
  index.tsx                 Provider + HashRouter + App
  index.css
  data/ingredients.ts
  utils/                    types.ts, burger-api.ts, mock-db.ts, cookie.ts
  services/store.ts         rootReducer, типизированные useDispatch / useSelector
  slices/                   authSlice, ingredientsSlice, burgerConstructorSlice,
                            feedSlice, userOrdersSlice, orderSlice (+ *.test.ts)
  components/
    app/  app-header/  protected-route/  modal/
    burger-ingredients/  ingredients-category/  burger-ingredient/  ingredient-details/
    burger-constructor/  burger-constructor-element/
    orders-list/  order-card/  order-info/  order-status/  feed-info/  profile-menu/
    ui/                     UI-пары к компонентам выше + modal-overlay, order-details,
                            preloader, pages/ (разметка страниц)
  pages/                    constructor-page, feed, login, register, forgot-password,
                            reset-password, profile, profile-orders, not-found-404
```

Алиасы путей (в `tsconfig.json` и в конфиге сборщика): `@pages`, `@components`, `@ui`,
`@ui-pages`, `@utils-types`, `@api`, `@slices` → `src/slices`.

В `index.html` рядом с `<div id="root">` должен быть `<div id="modals">` — в него через
портал рендерятся модалки.

## Состояние (Redux)

```ts
{
  user:              { user: TUser | null, isAuthChecked, isLoading, error },
  ingredients:       { items: TIngredient[], isLoading, error },
  burgerConstructor: { bun: TIngredient | null, ingredients: TConstructorIngredient[] },
  feed:              { orders: TOrder[], total, totalToday, isLoading, error },
  userOrders:        { orders: TOrder[], isLoading, error },
  order:             { orderRequest: boolean, orderModalData: TOrder | null,
                       viewedOrder: TOrder | null, error }
}
```

- **ingredients** — thunk `fetchIngredients`; селекторы `ingredientsSelector`, `selectBuns`,
  `selectMains`, `selectSauces`. Селекторы с `filter` мемоизировать через `createSelector`.
- **burgerConstructor** — экшены:
  - `addIngredient(ingredient)` — в `prepare` добавить `id: nanoid()`. Булка заменяет
    текущую булку, `sauce` и `main` добавляются в конец списка.
  - `removeIngredient(id)` — удаляет один экземпляр по `id` (не по `_id`).
  - `moveIngredient({ fromIndex, toIndex })`, `clearConstructor()`.
- **user** — thunks `registerUser`, `loginUser`, `getUser`, `updateUser`, `logoutUser`,
  `checkUserAuth`.
  - `registerUser` и `loginUser` сохраняют `accessToken` в cookie и `refreshToken` в
    `localStorage` и кладут пользователя в стор — после регистрации человек сразу вошёл.
  - `checkUserAuth`: если есть cookie `accessToken` — запросить пользователя; в любом случае
    выставить `isAuthChecked = true`.
  - `logoutUser`: `logoutApi()`, удалить cookie и `refreshToken`, обнулить `user`.
    Ключи `bb:*` не трогать — `localStorage.clear()` стёр бы всех пользователей и заказы.
- **feed** — thunk `fetchFeed` (`getFeedsApi`).
- **userOrders** — thunk `fetchUserOrders` (`getOrdersApi`).
- **order** — thunk `createOrder(ids)`: пока идёт — `orderRequest = true`; при успехе
  записать заказ в `orderModalData` и вызвать `clearConstructor()`. Thunk
  `fetchOrderByNumber(number)` пишет в `viewedOrder`. Экшен `closeOrderModal` обнуляет
  `orderModalData`.

Лента и история заказов живут в разных слайсах: они показывают разные списки и не должны
затирать друг друга.

## Маршруты

| Путь | Что показывает | Доступ |
|---|---|---|
| `/` | Конструктор | всем |
| `/feed` | Лента заказов | всем |
| `/feed/:number` | Детали заказа | всем |
| `/ingredients/:id` | Детали ингредиента | всем |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Формы | только гостям |
| `/profile` | Редактирование профиля | только вошедшим |
| `/profile/orders` | История заказов | только вошедшим |
| `/profile/orders/:number` | Детали заказа | только вошедшим |
| `*` | 404 | всем |

**Модальные маршруты.** Ссылки на детали ингредиента и заказа передают
`state={{ background: location }}`. `App` читает `location.state?.background`:

- если `background` есть — основной `<Routes location={background}>` продолжает показывать
  страницу, с которой пришли, а второй `<Routes>` рендерит детали в `Modal`; закрытие —
  `navigate(-1)`;
- если `background` нет (прямой заход по ссылке или перезагрузка) — детали показываются
  отдельной страницей по центру, без модалки.

Ключ в `state` один и тот же в ссылках и в `App` — `background`.

**`ProtectedRoute`** (`onlyUnAuth?: boolean`): пока `isAuthChecked === false` — `Preloader`;
гостя с защищённой страницы отправить на `/login` с `state={{ from: location }}`; вошедшего со
страницы «только гостям» — на `location.state?.from ?? '/'`, чтобы после входа он вернулся
туда, откуда его перенаправили.

`App` при монтировании диспатчит `fetchIngredients()` и `checkUserAuth()`.

## Поведение экранов

### Конструктор (`/`)

Две колонки под заголовком «Соберите бургер». Пока ингредиенты грузятся — `Preloader`.

**Слева — ингредиенты.** Вкладки «Булки», «Начинки», «Соусы» и прокручиваемый список из трёх
секций в том же порядке. Клик по вкладке плавно прокручивает к секции
(`scrollIntoView({ behavior: 'smooth' })`). При прокрутке активная вкладка определяется через
`useInView` на каждой секции: первая видимая из порядка булки → начинки → соусы.

Карточка ингредиента: фото (`image`), цена с `CurrencyIcon`, название, кнопка «Добавить» и
счётчик `Counter`, если ингредиент уже в конструкторе. Счётчик — число экземпляров в
конструкторе; для выбранной булки всегда 2. Клик по карточке открывает детали ингредиента,
клик по «Добавить» диспатчит `addIngredient`.

**Справа — конструктор.** Сверху и снизу — булка (`ConstructorElement` с `type='top'` /
`'bottom'`, `isLocked`, текст «{имя} (верх)» / «{имя} (низ)»), между ними прокручиваемый
список начинок. Пустые места — плашки «Выберите булки» и «Выберите начинку». У каждой начинки
`MoveButton` (вверх и вниз; на краях списка соответствующая стрелка отключена) и крестик
удаления. `key` элемента — `id`.

Цена: `bun.price * 2 + сумма цен начинок`, через `useMemo`.

Кнопка «Оформить заказ»:
1. гость — перейти на `/login` с `state={{ from: location }}` (`location` из `useLocation`);
2. нет булки или заказ уже отправляется — ничего не делать;
3. иначе `createOrder([bun._id, ...ingredients.map(i => i._id), bun._id])`.

Пока `orderRequest` — модалка «Оформляем заказ...» с `Preloader`. Когда появился
`orderModalData` — модалка с номером заказа, подписью «идентификатор заказа», галочкой и
текстом «Ваш заказ начали готовить» / «Дождитесь готовности — мы позовём». Закрытие
диспатчит `closeOrderModal`. Ошибку оформления показать текстом над кнопкой.

### Детали ингредиента

Фото `image_large`, название и четыре значения: «Калории, ккал», «Белки, г», «Жиры, г»,
«Углеводы, г». Ингредиент ищется в сторе по `:id`; пока список не загружен — `Preloader`,
если загружен, а такого `_id` нет — текст «Ингредиент не найден».

### Лента заказов (`/feed`)

Заголовок «Лента заказов» и кнопка «Обновить» (`RefreshButton`) — обе диспатчат `fetchFeed`.
Слева список карточек, отсортированных от новых к старым. Справа сводка: колонки «Готовы»
(номера заказов со статусом `done`, бирюзовым `#00cccc`) и «В работе» (`pending`), в каждой до
20 номеров; ниже «Выполнено за все время» (`total`) и «Выполнено за сегодня» (`totalToday`).
Пустая лента — текст «Заказов пока нет», а не вечный прелоадер.

**Карточка заказа:** номер `#001234` (`padStart(6, '0')`), дата через `FormattedDate`,
название, цена (сумма цен всех ингредиентов заказа, булка посчитана дважды, так как дважды
встречается в `ingredients`). Фото — кружки `image_mobile` внахлёст, не больше 6; если
ингредиентов больше, шестой кружок полупрозрачный с надписью `+N`. В истории заказов под
названием показывается статус. Ингредиенты, которых нет в справочнике, пропускать.

**Детали заказа:** номер, название, статус, «Состав:» — список уникальных ингредиентов с
фото, названием и `{количество} x {цена}`, внизу дата и общая сумма. Данные —
`fetchOrderByNumber(Number(number))`. Не найден — «Заказ не найден».

**Статус:** `created` → «Создан» (`#F2F2F3`), `pending` → «Готовится» (`#E52B1A`),
`done` → «Выполнен» (`#00CCCC`). Текст и цвет берутся по значению `status`.

### Авторизация

- **Вход:** email и пароль. Успех — переход на `location.state?.from ?? '/'`. Ссылки
  «Зарегистрироваться» и «Восстановить пароль».
- **Регистрация:** имя, email, пароль. Успех — пользователь вошёл, переход на `/`.
- **Восстановление:** email → `forgotPasswordApi` → флаг `resetPassword` в `localStorage` →
  `/reset-password`. Страница сброса без этого флага возвращает на `/forgot-password`. На ней
  новый пароль и код; успех — убрать флаг и перейти на `/login`.

Ошибки показывать текстом под формой (`errorText`), без `alert`.

### Профиль

Слева меню: «Профиль», «История заказов», «Выход» и подсказка о текущем разделе. Активный
пункт подсвечен (`NavLink`, у «Профиль» — `end`).

`/profile` — форма с именем, email и паролем, заполненная данными пользователя. Кнопки
«Отменить» и «Сохранить» появляются только когда форма изменена. «Сохранить» отправляет в
`updateUser` только изменённые поля и очищает поле пароля; «Отменить» возвращает исходные
значения.

`/profile/orders` — `fetchUserOrders` и тот же список карточек, что в ленте, со статусами.
Нет заказов — «Вы ещё ничего не заказывали».

«Выход» дожидается `logoutUser` и переходит на `/login`.

### Шапка и модалка

**Шапка:** слева «Конструктор» (`/`) и «Лента заказов» (`/feed`), по центру логотип, справа
ссылка на профиль с именем пользователя или «Личный кабинет» для гостя (ведёт на `/profile`
или `/login`). Активная ссылка подсвечена по текущему пути.

**Модалка:** портал в `#modals`, заголовок, кнопка-крестик, оверлей. Закрывается по
крестику, клику на оверлей и `Escape`.

## Оформление

Тёмная тема UI-кита: фон `#131316`, текст `#f2f2f3`, акцент — цвета кита. Приложение занимает
всю высоту окна, прокручиваются только внутренние списки (ингредиенты, начинки, заказы).
Фото TheMealDB — продукты на прозрачном фоне: показывать с `object-fit: contain`, в кружках
заказа — на тёмной подложке. Логотип и название — свои, без космической тематики старого
проекта (`src/images/logo.svg`).

## Тесты

Атрибуты `data-testid` на элементах: `ingredient-card` (плюс `data-type={type}`),
`ingredient-name`, `ingredient-image`, `constructor-item`, `order-button`, `modal`,
`modal-title`, `modal-close-button`, `modal-overlay`.

- **Jest:** начальное состояние `rootReducer`; `burgerConstructorSlice` — добавление булки и
  начинки, удаление одного из двух одинаковых ингредиентов, перемещение, очистка; остальные
  слайсы — `pending` / `fulfilled` / `rejected` для каждого thunk.
- **Cypress:** добавление булки и начинки в конструктор; открытие и три способа закрытия
  модалки ингредиента; полный сценарий заказа — регистрация, сборка бургера, оформление,
  модалка с номером, пустой конструктор после закрытия. Перед каждым тестом очищать
  `localStorage` и cookie — моков сети не требуется, «сервер» живёт в браузере.

## Порядок работы

1. Каркас: Vite, зависимости, алиасы, проверка UI-кита, ESLint и Prettier (одинарные кавычки,
   без висячих запятых).
2. Типы, данные ингредиентов, `cookie.ts`, `mock-db.ts`, `burger-api.ts`.
3. Стор и слайсы с тестами.
4. `App`, маршруты, `ProtectedRoute`, шапка, модалка.
5. Конструктор и детали ингредиента.
6. Авторизация и профиль.
7. Лента, история и детали заказа.
8. Cypress, README, деплой.

После каждого шага запускать `npm run lint` и `npm run test`, а экран проверять в браузере.
