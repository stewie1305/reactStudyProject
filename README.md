# 🛕 Ritual Management App

Ứng dụng quản lý **nghi lễ / nghi thức** (Ritual) xây dựng bằng React 19, TypeScript và Vite. Hỗ trợ hai vai trò: **User** (duyệt danh mục nghi lễ) và **Admin** (quản lý CRUD nghi lễ, người dùng).

---

## 🚀 Công nghệ sử dụng

| Công nghệ                    | Phiên bản | Vai trò                                                |
| ---------------------------- | --------- | ------------------------------------------------------ |
| **React**                    | 19        | UI framework chính                                     |
| **TypeScript**               | ~5.9      | Type-safe code                                         |
| **Vite**                     | 7         | Build tool & Dev server (HMR)                          |
| **React Router DOM**         | 7         | Client-side routing (`createBrowserRouter`)            |
| **TanStack React Query**     | 5         | Server state, caching, background refetch              |
| **Zustand**                  | 5         | Client state (auth token, theme), persist localStorage |
| **Axios**                    | 1.x       | HTTP client với request/response interceptors          |
| **Tailwind CSS**             | 4         | Utility-first CSS framework                            |
| **Radix UI**                 | 1–2.x     | Headless, accessible UI primitives                     |
| **shadcn/ui**                | —         | Pre-built components dựa trên Radix UI + Tailwind      |
| **React Hook Form**          | 7         | Form state management hiệu suất cao                    |
| **Zod**                      | 4         | Schema validation cho form và API                      |
| **jwt-decode**               | 4         | Decode JWT token phía client để đọc `role`             |
| **Sonner**                   | 2         | Toast notification                                     |
| **Lucide React**             | 0.56x     | Icon library                                           |
| **next-themes**              | 0.4       | Hỗ trợ Dark/Light mode                                 |
| **class-variance-authority** | 0.7       | Tạo variant cho components (CVA)                       |
| **clsx + tailwind-merge**    | —         | Merge Tailwind class an toàn                           |

---

## ⚙️ Cài đặt & Chạy dự án

### Yêu cầu

- Node.js >= 18
- npm (hoặc yarn / pnpm)

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` ở thư mục gốc:

```env
VITE_API_URL=http://localhost:3000
```

> ⚠️ **Bắt buộc** – thiếu `VITE_API_URL` sẽ ném lỗi ngay khi khởi động app (xem `src/lib/env.ts`).

### 3. Chạy development server

```bash
npm run dev
```

App mặc định chạy tại: `http://localhost:5173`

### 4. Build production

```bash
npm run build
```

Lệnh này chạy `tsc -b` (type-check) trước, sau đó Vite build bundle ra thư mục `dist/`.

### 5. Preview bản build

```bash
npm run preview
```

### 6. Kiểm tra lỗi ESLint

```bash
npm run lint
```

---

## 🌐 Deploy lên Vercel

File `vercel.json` cấu hình rewrite toàn bộ route về `index.html` để SPA routing hoạt động đúng:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 🗺️ Routing & Phân quyền

| Path                     | Layout      | Quyền truy cập  | Mô tả                                        |
| ------------------------ | ----------- | --------------- | -------------------------------------------- |
| `/`                      | UserLayout  | 🌐 Public       | Trang chủ landing                            |
| `/ritual`                | UserLayout  | 🌐 Public       | Catalog nghi lễ (search, filter, pagination) |
| `/ritual/:id`            | UserLayout  | 🌐 Public       | Chi tiết một nghi lễ                         |
| `/login`                 | UserLayout  | 👤 Guest only   | Đăng nhập (redirect nếu đã login)            |
| `/register`              | UserLayout  | 👤 Guest only   | Đăng ký (redirect nếu đã login)              |
| `/profile`               | UserLayout  | 🔒 Đã đăng nhập | Hồ sơ cá nhân                                |
| `/unauthorized`          | UserLayout  | 🌐 Public       | Trang không có quyền                         |
| `/admin`                 | AdminLayout | 🔒 Admin        | Dashboard thống kê                           |
| `/admin/ritual`          | AdminLayout | 🔒 Admin        | Danh sách nghi lễ (CRUD)                     |
| `/admin/ritual/create`   | AdminLayout | 🔒 Admin        | Tạo nghi lễ mới                              |
| `/admin/ritual/:id/edit` | AdminLayout | 🔒 Admin        | Chỉnh sửa nghi lễ                            |
| `/admin/users`           | AdminLayout | 🔒 Admin        | Quản lý người dùng                           |
| `*`                      | UserLayout  | 🌐 Public       | Trang 404 Not Found                          |

**Lazy loading** áp dụng cho các trang nặng/ít dùng của Admin:
`AdminLayout`, `DashboardPage`, `ManageRitualCreate`, `ManageRitualEdit`, `UserManagementPage` — kết hợp `React.lazy()` + `<Suspense fallback={<LoadingSpinner />}>`.

---

## 📁 Cấu trúc thư mục chi tiết

```
src/
├── main.tsx                        # Entry point: mount <App /> vào #root
│
├── app/                            # App shell
│   ├── App.tsx                     # Root component: QueryProvider → Theme → RouterProvider → Toaster
│   ├── router.tsx                  # Toàn bộ route definitions (createBrowserRouter)
│   ├── store.ts                    # Zustand store: theme (light/dark), persist localStorage
│   └── providers/
│       ├── QueryProvider.tsx       # Bọc <QueryClientProvider> + <ReactQueryDevtools>
│       └── RouterProvider.tsx      # Bọc <RouterProvider router={router}>
│
├── features/                       # Feature-based architecture – mỗi folder = 1 domain
│   │
│   ├── auth/                       # Domain: Xác thực
│   │   ├── schema.ts               # Zod: loginSchema, registerSchema
│   │   │                           #   registerSchema: fullName, email, password mạnh (hoa/số/ký tự đặc biệt),
│   │   │                           #   confirmPassword, date_of_birth (tuổi >= 18, coerce Date -> ISO string)
│   │   ├── services.ts             # authService: login(), register(), logout()
│   │   ├── store.ts                # Zustand: { accessToken, role } + setAuth(), clearAuth()
│   │   │                           #   persist vào localStorage key "shopping-auth-storage"
│   │   ├── types.ts                # AuthTokens, LoginRequest, User, RegisterDto, AuthResponse,
│   │   │                           #   AuthState, AuthActions, JwtPayload
│   │   ├── components/
│   │   │   ├── LoginForm.tsx       # Controlled form: email + password + rememberMe
│   │   │   └── RegisterForm.tsx    # Controlled form: fullName, email, password, confirmPassword, dob
│   │   ├── hooks/
│   │   │   └── useAuthMutation.ts  # useLoginMutation: decode JWT -> setAuth -> redirect theo role
│   │   │                           # useRegisterMutation: register -> redirect /login
│   │   │                           # useLogoutMutation: clearAuth -> clear query cache -> redirect /login
│   │   └── pages/
│   │       ├── LoginPage.tsx       # Route /login
│   │       ├── RegisterPage.tsx    # Route /register
│   │       ├── NotFoundPage.tsx    # Route * (404)
│   │       └── UnauthorizedPage.tsx# Route /unauthorized
│   │
│   ├── ritual/                     # Domain: Nghi lễ / Nghi thức
│   │   ├── schema.ts               # Zod: ritualSchema (name, dateLunar, difficultyLevel enum, isHot...)
│   │   ├── services.ts             # ritualService = createBaseService<Ritual>(...)
│   │   │                           #   override remove -> PATCH /ritual/:id/soft-remove (xóa mềm)
│   │   │                           # ritualCategoryService = createBaseService<RitualCategory>(...)
│   │   ├── types.ts                # Ritual, RitualCategory, Prayer, RitualMedia, RitualOffering, Tag
│   │   │                           # RitualFilterParams, CreateRitualDto, UpdateRitualDto
│   │   ├── components/
│   │   │   ├── RitualCard.tsx      # Card hiển thị nghi lễ trong catalog
│   │   │   ├── RitualForm.tsx      # Form dùng chung cho Create và Edit (React Hook Form + Zod)
│   │   │   └── RitualTable.tsx     # Bảng danh sách cho trang Admin (sort, action buttons)
│   │   ├── hooks/
│   │   │   └── useRituals.ts       # useRituals(): đọc filter từ URL -> query API
│   │   │                           # useRitualDetail(id): fetch chi tiết
│   │   │                           # useCreateRitual(): mutation -> invalidate cache -> navigate
│   │   │                           # useUpdateRitual(): mutation -> invalidate cache -> navigate
│   │   │                           # useDeleteRitual(): mutation -> invalidate cache
│   │   │                           # useRitualCategories(): fetch danh mục (dùng cho dropdown)
│   │   └── pages/
│   │       ├── RitualsCatalog.tsx      # /ritual – Search (debounce 500ms) + filter + pagination
│   │       │                           #   Toàn bộ state lưu trên URL -> có thể bookmark/share
│   │       ├── RitualDetailPage.tsx    # /ritual/:id – Chi tiết đầy đủ
│   │       ├── ManageRitualList.tsx    # /admin/ritual – Bảng + nút xóa
│   │       ├── ManageRitualCreate.tsx  # /admin/ritual/create – Form tạo (lazy)
│   │       └── ManageRitualEdit.tsx    # /admin/ritual/:id/edit – Form sửa (lazy)
│   │
│   ├── users/                      # Domain: Người dùng
│   │   ├── services.ts             # userService.getMe() -> GET /user/me
│   │   ├── types.ts                # User profile type
│   │   ├── hooks/
│   │   │   └── useUser.tsx         # useUser(): React Query, queryKey ["me"], staleTime 2 phút
│   │   └── pages/
│   │       ├── ProfilePage.tsx         # /profile – Thông tin cá nhân
│   │       └── UserManagementPage.tsx  # /admin/users – Quản lý users (lazy)
│   │
│   ├── dashboards/                 # Domain: Dashboard Admin
│   │   └── pages/
│   │       └── DashBoardPage.tsx   # /admin – Stats cards: Total Users, Active Rituals... (lazy)
│   │
│   └── landing/                    # Domain: Landing page
│       └── pages/
│           └── HomePage.tsx        # / – Trang chủ công khai
│
├── lib/                            # Utility & config cốt lõi
│   ├── axios.ts                    # Axios instance (baseURL = VITE_API_URL, timeout 15s, withCredentials)
│   │                               #  Request interceptor: gắn Bearer token từ Zustand store
│   │                               #  Response interceptor (success): unwrap response.data.data
│   │                               #  Response interceptor (401): auto refresh token + queue retry
│   │                               #  Nếu refresh thất bại -> clearAuth() -> toast -> redirect /login
│   ├── env.ts                      # Validate VITE_API_URL, throw Error nếu thiếu
│   ├── queryClient.ts              # Cấu hình QueryClient (defaultOptions)
│   └── utils.ts                    # cn() = clsx + tailwind-merge
│
└── shared/                         # Code dùng chung toàn app
    ├── components/
    │   ├── common/
    │   │   ├── EmptyState.tsx          # UI khi danh sách rỗng
    │   │   ├── ErrorState.tsx          # UI khi fetch lỗi
    │   │   ├── GuestRoute.tsx          # Redirect đã login -> /profile (bảo vệ /login, /register)
    │   │   ├── LoadingSpinner.tsx      # Spinner, prop: size (sm/md/lg), className
    │   │   ├── Pagination.tsx          # Phân trang tái sử dụng (currentPage, totalPages, onPageChange)
    │   │   ├── ProtectedRoute.tsx      # Kiểm tra accessToken + allowedRoles -> redirect nếu sai
    │   │   ├── Theme.tsx               # Apply theme class lên <html> ngay khi mount
    │   │   └── ThemeToggle.tsx         # Nút toggle dark/light mode
    │   └── ui/                         # shadcn/ui components
    │       ├── badge.tsx               # Badge (variant: default, secondary, destructive...)
    │       ├── button.tsx              # Button (variant + size CVA)
    │       ├── card.tsx                # Card, CardHeader, CardContent, CardFooter
    │       ├── input.tsx               # Input styled
    │       ├── label.tsx               # Label accessible
    │       ├── navigation-menu.tsx     # NavigationMenu (Radix)
    │       ├── pagination.tsx          # Pagination UI (Radix)
    │       ├── separator.tsx           # Separator (Radix)
    │       ├── sonner.tsx              # Toaster wrapper (Sonner)
    │       ├── table.tsx               # Table, TableHeader, TableBody, TableRow, TableCell
    │       ├── textarea.tsx            # Textarea styled
    │       └── toggle.tsx              # Toggle (Radix)
    │
    ├── constants/
    │   └── index.ts                # API_ENDPOINTS (AUTH, RITUAL, RITUAL_CATEGORY)
    │                               # QUERY_KEYS (ME, RITUALS, RITUAL_DETAIL, RITUAL_CATEGORIES)
    │                               # DIFFICULTY_LEVELS (dễ / trung bình / khó / rất khó)
    │
    ├── hooks/
    │   └── useDebounce.ts          # useDebounce<T>(value, delay): trả về giá trị sau delay ms
    │
    ├── layouts/
    │   ├── Header.tsx              # Sticky header: logo, nav links (ẩn/hiện theo role/token), ThemeToggle, Logout
    │   ├── Footer.tsx              # Footer chung
    │   ├── UserLayout.tsx          # Header + <Outlet> + Footer (dành cho User)
    │   └── AdminLayout.tsx         # Header + <Outlet> + Footer (dành cho Admin, lazy loaded)
    │
    ├── services/
    │   └── BaseService.ts          # createBaseService<TEntity, TCreateDto, TUpdateDto, TFilterParams>()
    │                               # Factory tạo CRUD service: getAll, getById, create, update, remove, getSelectOptions
    │                               # Hỗ trợ override từng method qua config
    │
    └── types/
        └── index.ts                # UserRole ("user" | "admin")
                                    # PaginationMeta, PaginatedResponse<T>
                                    # BaseFilterParams (page, limit, sortBy, sortOrder, search)
                                    # BaseServiceConfig, BaseService
                                    # SelectOption, ApiError
```

---

## 🔐 Luồng xác thực (Authentication Flow)

```
ĐĂNG NHẬP
  User nhập email/password
       ↓
  useLoginMutation -> authService.login() -> POST /auth/login
       ↓
  Nhận { accessToken, refreshToken }
       ↓
  jwtDecode(accessToken) -> lấy { role }
       ↓
  useAuthStore.setAuth({ accessToken, role }) -> persist localStorage
       ↓
  redirect: admin -> /admin/ritual | user -> /profile (hoặc trang trước đó)

AUTO REFRESH TOKEN (Axios Response Interceptor)
  Request gặp lỗi 401 (token hết hạn)
       ↓
  isRefreshing = false -> gọi POST /auth/refresh (httpOnly cookie)
  isRefreshing = true  -> push vào failedQueue (đợi)
       ↓
  Nhận accessToken mới -> setAuth() -> processQueue() -> retry tất cả
       ↓ (nếu refresh thất bại)
  clearAuth() -> clear cache -> toast lỗi -> redirect /login

ĐĂNG XUẤT
  useLogoutMutation -> authService.logout()
       ↓
  clearAuth() -> queryClient.clear() -> navigate("/login")
```

---

## 📡 Kiến trúc Service Layer

### BaseService Pattern

```typescript
// Ví dụ tạo service cho Ritual
export const ritualService = createBaseService<
  Ritual,
  CreateRitualDto,
  UpdateRitualDto,
  RitualFilterParams
>({
  endpoint: "/ritual",
  remove: async (id) => {
    // Override: dùng soft-delete thay vì DELETE thật
    await apiClient.patch(`/ritual/${id}/soft-remove`);
  },
});
```

Sinh ra object service với đầy đủ các method:

| Method               | HTTP                 | URL                             |
| -------------------- | -------------------- | ------------------------------- |
| `getAll(params?)`    | GET                  | `/endpoint?page=1&limit=10&...` |
| `getById(id)`        | GET                  | `/endpoint/:id`                 |
| `create(dto)`        | POST                 | `/endpoint`                     |
| `update(id, dto)`    | PUT                  | `/endpoint/:id`                 |
| `remove(id)`         | DELETE hoặc override | `/endpoint/:id`                 |
| `getSelectOptions()` | GET                  | `/endpoint/select`              |

### Axios Interceptors

| Interceptor           | Hành động                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| **Request**           | Đọc `accessToken` từ Zustand `getState()` (không dùng hook), gắn `Authorization: Bearer <token>` |
| **Response success**  | Unwrap tự động: trả về `response.data.data` nếu tồn tại, ngược lại `response.data`               |
| **Response 401**      | Tự động refresh token, queue request đang chờ, retry sau khi có token mới                        |
| **Response lỗi khác** | Toast lỗi qua Sonner (bỏ qua endpoint logout), reject promise                                    |

---

## 🗃️ State Management

| Store                               | Công cụ              | Nơi lưu                                | Dữ liệu                              |
| ----------------------------------- | -------------------- | -------------------------------------- | ------------------------------------ |
| **Auth** (`features/auth/store.ts`) | Zustand + `persist`  | localStorage `"shopping-auth-storage"` | `accessToken`, `role`                |
| **Theme** (`app/store.ts`)          | Zustand + `persist`  | localStorage `"theme-storage"`         | `theme` (light/dark/system)          |
| **Server State**                    | TanStack React Query | In-memory cache                        | Rituals, user profile, categories... |

---

## 🔑 API Endpoints

```
AUTH
  POST  /auth/login              Đăng nhập -> { accessToken, refreshToken }
  POST  /auth/register           Đăng ký -> { accessToken, refreshToken }
  POST  /auth/logout             Đăng xuất
  POST  /auth/refresh            Làm mới access token (dùng refreshToken qua cookie)

RITUAL
  GET   /ritual                  Danh sách (params: page, limit, search, difficultyLevel, ritualCategoryId)
  GET   /ritual/:id              Chi tiết nghi lễ
  POST  /ritual                  Tạo nghi lễ mới
  PUT   /ritual/:id              Cập nhật nghi lễ
  PATCH /ritual/:id/soft-remove  Xóa mềm nghi lễ

RITUAL CATEGORY
  GET   /ritual-category         Danh sách danh mục
  GET   /ritual-category/select  Dropdown options

USER
  GET   /user/me                 Thông tin người dùng đang đăng nhập
```

---

## ✨ Tính năng nổi bật

- **Phân quyền 2 tầng** – `GuestRoute` ngăn user đã đăng nhập vào `/login`/`/register`; `ProtectedRoute` kiểm tra token và `allowedRoles`
- **Auto refresh token với request queue** – tránh race condition khi nhiều request 401 song song
- **URL-driven filter/search/pagination** – state lưu trên URL, có thể bookmark hoặc chia sẻ link
- **Debounce search 500ms** – chỉ gọi API sau khi user ngừng gõ, giảm số lần request
- **Lazy loading trang Admin** – giảm bundle ban đầu, tăng tốc load lần đầu
- **Dark / Light mode** – persist qua localStorage, apply ngay khi rehydrate trang
- **Toast notification** thống nhất qua Sonner (top-right, richColors, closeButton)
- **Form validation mạnh với Zod** – mật khẩu phải có chữ hoa/số/ký tự đặc biệt, tuổi >= 18
- **Soft delete nghi lễ** – PATCH `/soft-remove` thay vì DELETE thật
- **BaseService factory** – viết service mới chỉ cần truyền endpoint, tránh lặp code CRUD
- **Response unwrap tự động** – Axios interceptor bóc `data.data` giúp component không cần xử lý thêm
