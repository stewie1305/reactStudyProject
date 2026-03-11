# Ritual Management Frontend

Frontend React + TypeScript cho hệ thống quản lý/tra cứu nghi lễ.

## Công nghệ sử dụng

- React 19 + TypeScript
- Vite 7
- React Router 7
- TanStack Query 5
- Zustand (persist auth)
- Axios (interceptor + refresh token)
- React Hook Form + Zod
- Tailwind CSS 4 + Radix UI + shadcn/ui
- Sonner (toast)

## Chức năng chính

- Đăng nhập / đăng ký
- Bảo vệ route theo trạng thái đăng nhập
- Phân quyền admin với `ProtectedRoute`
- Danh sách nghi lễ + chi tiết nghi lễ
- Khu vực quản trị:
  - Dashboard
  - Quản lý nghi lễ (list/create/edit)
  - Quản lý người dùng
- Trang cá nhân người dùng
- Dark/Light theme

## Cấu trúc thư mục chính

```text
src/
  app/                # app shell, providers, router
  features/           # domain modules (auth, ritual, users, ...)
  lib/                # axios, env, query client
  shared/             # components dùng chung, layouts, constants
  styles/             # global styles
```

## Yêu cầu môi trường

- Node.js >= 18
- npm (hoặc pnpm/yarn nếu muốn)

## Cài đặt

```bash
npm install
```

Tạo file `.env` ở thư mục gốc:

```env
VITE_API_URL=http://localhost:3000/
```

> Bắt buộc có `VITE_API_URL`, nếu thiếu app sẽ throw lỗi lúc khởi động.

## Chạy dự án

```bash
npm run dev
```

App mặc định chạy tại: `http://localhost:5173`

## Scripts

- `npm run dev`: chạy môi trường phát triển
- `npm run build`: type-check + build production
- `npm run preview`: preview bản build
- `npm run lint`: chạy ESLint

## Router overview

### Public/User

- `/` - Trang chủ
- `/ritual` - Danh sách nghi lễ
- `/ritual/:id` - Chi tiết nghi lễ
- `/login` - Đăng nhập (chỉ khách)
- `/register` - Đăng ký (chỉ khách)
- `/profile` - Hồ sơ cá nhân (cần đăng nhập)

### Admin

- `/admin` - Dashboard
- `/admin/ritual` - Quản lý nghi lễ
- `/admin/ritual/create` - Tạo nghi lễ
- `/admin/ritual/:id/edit` - Sửa nghi lễ
- `/admin/users` - Quản lý người dùng

## Ghi chú kỹ thuật

- Axios tự đính kèm `Bearer accessToken` từ store.
- Khi gặp `401`, hệ thống tự gọi refresh token và retry request.
- Auth state được persist trong `localStorage`.
- API response được normalize để trả thẳng payload `data` khi có.

## Định hướng phát triển thêm

- Bổ sung test (unit/integration) cho hooks và services
- Chuẩn hóa error handling theo mã lỗi backend
- Thêm CI pipeline (lint + build + test)
