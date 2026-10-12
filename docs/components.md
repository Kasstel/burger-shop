# Component Documentation

*Generated on 2026-05-02T18:27:07.181Z*

---

## App

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/app/app.tsx`

**Export:** Named

### Hooks Used

- `useLocation` (line 24)
- `useNavigate` (line 25)
- `useDispatch` (line 27)
- `useEffect` (line 28)


---

## AppHeader

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/app-header/app-header.tsx`

**Export:** Named


---

## BurgerConstructor

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/burger-constructor/burger-constructor.tsx`

**Export:** Named

### Hooks Used

- `useDispatch` (line 18)
- `useNavigate` (line 19)
- `useSelector` (line 20)
- `useSelector` (line 22)
- `useSelector` (line 23)
- `useSelector` (line 25)
- `useMemo` (line 46)


---

## BurgerIngredients

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/burger-ingredients/burger-ingredients.tsx`

**Export:** Named

### Hooks Used

- `useSelector` (line 15)
- `useSelector` (line 16)
- `useSelector` (line 17)
- `useState` (line 18)
- `useRef` (line 19)
- `useRef` (line 20)
- `useRef` (line 21)
- `useInView` (line 23)
- `useInView` (line 27)
- `useInView` (line 31)
- `useEffect` (line 35)


---

## FeedInfo

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/feed-info/feed-info.tsx`

**Export:** Named

### Hooks Used

- `useDispatch` (line 16)
- `useSelector` (line 18)
- `useEffect` (line 22)


---

## IngredientDetails

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ingredient-details/ingredient-details.tsx`

**Export:** Named

### Hooks Used

- `useParams` (line 8)
- `useSelector` (line 9)


---

## OrderInfo

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/order-info/order-info.tsx`

**Export:** Named

### Hooks Used

- `useSelector` (line 14)
- `useDispatch` (line 15)
- `useSelector` (line 16)
- `useParams` (line 18)
- `useEffect` (line 20)
- `useMemo` (line 26)


---

## OrderStatus

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/order-status/order-status.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| status | `string` | ✅ | - | - |


---

## ProfileMenu

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/profile-menu/profile-menu.tsx`

**Export:** Named

### Hooks Used

- `useLocation` (line 8)
- `useDispatch` (line 9)
- `useNavigate` (line 10)


---

## ProtectedRoute

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/protected-route/protected-route.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onlyUnAuth | `boolean | undefined` | ❌ | - | - |
| children | `ReactElement<any, string | JSXElementConstructor<any>>` | ✅ | - | - |

### Hooks Used

- `useLocation` (line 14)
- `useSelector` (line 16)


---

## AppHeaderUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/app-header/app-header.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| userName | `string | undefined` | ❌ | - | - |

### Hooks Used

- `useSelector` (line 15)
- `useLocation` (line 17)


---

## BurgerConstructorUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/burger-constructor/burger-constructor.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| constructorItems | `any` | ✅ | - | - |
| orderRequest | `boolean` | ✅ | - | - |
| price | `number` | ✅ | - | - |
| orderModalData | `TOrder | null` | ✅ | - | - |
| onOrderClick | `() => void` | ✅ | - | - |
| closeOrderModal | `() => void` | ✅ | - | - |


---

## HalfColumn

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/feed-info/feed-info.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| orders | `number[]` | ✅ | - | - |
| title | `string` | ✅ | - | - |
| textColor | `string | undefined` | ❌ | - | - |


---

## Column

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/feed-info/feed-info.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | `string` | ✅ | - | - |
| content | `number` | ✅ | - | - |


---

## ModalOverlayUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/modal-overlay/modal-overlay.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onClick | `() => void` | ✅ | - | - |


---

## OrderDetailsUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/order-details/order-details.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| orderNumber | `number` | ✅ | - | - |


---

## OrderStatusUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/order-status/order-status.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| textStyle | `string` | ✅ | - | - |
| text | `string` | ✅ | - | - |


---

## OrdersListUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/orders-list/orders-list.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| orderByDate | `TOrder[]` | ✅ | - | - |


---

## ConstructorPageUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/pages/constructor-page/constructor-page.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| isIngredientsLoading | `boolean` | ✅ | - | - |


---

## ForgotPasswordUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/pages/forgot-password/forgot-password.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| errorText | `string | undefined` | ❌ | - | - |
| email | `string` | ✅ | - | - |
| setEmail | `Dispatch<SetStateAction<string>>` | ✅ | - | - |
| handleSubmit | `(e: SyntheticEvent<Element, Event>) => void` | ✅ | - | - |


---

## LoginUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/pages/login/login.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| errorText | `string | undefined` | ❌ | - | - |
| email | `string` | ✅ | - | - |
| setEmail | `Dispatch<SetStateAction<string>>` | ✅ | - | - |
| handleSubmit | `(e: SyntheticEvent<Element, Event>) => void` | ✅ | - | - |
| password | `string` | ✅ | - | - |
| setPassword | `Dispatch<SetStateAction<string>>` | ✅ | - | - |


---

## ProfileUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/pages/profile/profile.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| formValue | `{ name: string; email: string; password: string; }` | ✅ | - | - |
| isFormChanged | `boolean` | ✅ | - | - |
| handleSubmit | `(e: SyntheticEvent<Element, Event>) => void` | ✅ | - | - |
| handleCancel | `(e: SyntheticEvent<Element, Event>) => void` | ✅ | - | - |
| handleInputChange | `(e: ChangeEvent<HTMLInputElement>) => void` | ✅ | - | - |
| updateUserError | `string | undefined` | ❌ | - | - |


---

## ProfileOrdersUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/pages/profile-orders/profile-orders.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| orders | `TOrder[]` | ✅ | - | - |


---

## RegisterUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/pages/register/register.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| errorText | `string | undefined` | ❌ | - | - |
| email | `string` | ✅ | - | - |
| setEmail | `Dispatch<SetStateAction<string>>` | ✅ | - | - |
| handleSubmit | `(e: SyntheticEvent<Element, Event>) => void` | ✅ | - | - |
| password | `string` | ✅ | - | - |
| userName | `string` | ✅ | - | - |
| setPassword | `Dispatch<SetStateAction<string>>` | ✅ | - | - |
| setUserName | `Dispatch<SetStateAction<string>>` | ✅ | - | - |


---

## ResetPasswordUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/pages/reset-password/reset-password.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| errorText | `string | undefined` | ❌ | - | - |
| handleSubmit | `(e: SyntheticEvent<Element, Event>) => void` | ✅ | - | - |
| password | `string` | ✅ | - | - |
| token | `string` | ✅ | - | - |
| setPassword | `Dispatch<SetStateAction<string>>` | ✅ | - | - |
| setToken | `Dispatch<SetStateAction<string>>` | ✅ | - | - |


---

## Preloader

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/preloader/preloader.tsx`

**Export:** Named


---

## ProfileMenuUI

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/components/ui/profile-menu/profile-menu.tsx`

**Export:** Named

### Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| pathname | `string` | ✅ | - | - |
| handleLogout | `() => void` | ✅ | - | - |


---

## ConstructorPage

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/pages/constructor-page/constructor-page.tsx`

**Export:** Named

### Hooks Used

- `useSelector` (line 15)


---

## Feed

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/pages/feed/feed.tsx`

**Export:** Named

### Hooks Used

- `useDispatch` (line 9)
- `useSelector` (line 10)
- `useEffect` (line 11)


---

## ForgotPassword

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/pages/forgot-password/forgot-password.tsx`

**Export:** Named

### Hooks Used

- `useState` (line 8)
- `useState` (line 9)
- `useNavigate` (line 11)


---

## Login

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/pages/login/login.tsx`

**Export:** Named

### Hooks Used

- `useDispatch` (line 8)
- `useNavigate` (line 9)
- `useState` (line 10)
- `useState` (line 11)


---

## NotFound404

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/pages/not-fount-404/not-fount-404.tsx`

**Export:** Named


---

## Profile

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/pages/profile/profile.tsx`

**Export:** Named

### Hooks Used

- `useSelector` (line 7)
- `useDispatch` (line 8)
- `useState` (line 10)
- `useEffect` (line 16)


---

## ProfileOrders

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/pages/profile-orders/profile-orders.tsx`

**Export:** Named

### Hooks Used

- `useDispatch` (line 8)
- `useSelector` (line 9)
- `useEffect` (line 11)


---

## Register

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/pages/register/register.tsx`

**Export:** Named

### Hooks Used

- `useNavigate` (line 8)
- `useDispatch` (line 9)
- `useState` (line 10)
- `useState` (line 11)
- `useState` (line 12)


---

## ResetPassword

**File:** `C:/Users/kasstel/dev/stellar-burgers/src/pages/reset-password/reset-password.tsx`

**Export:** Named

### Hooks Used

- `useNavigate` (line 8)
- `useState` (line 9)
- `useState` (line 10)
- `useState` (line 11)
- `useEffect` (line 24)


---

