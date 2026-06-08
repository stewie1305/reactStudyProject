# Flow Code Architecture & CRUD Implementation Guide

## 📋 Mục Lục
1. [Tổng Quan Kiến Trúc Dự Án](#-tổng-quan-kiến-trúc-dự-án)
2. [Flow Dữ Liệu](#-flow-dữ-liệu)
3. [Hướng Dẫn Tạo CRUD Feature Mới](#-hướng-dẫn-tạo-crud-feature-mới)
4. [Ví Dụ Thực Tế](#-ví-dụ-thực-tế)

---

## 🏗 Tổng Quan Kiến Trúc Dự Án

### Stack Công Nghệ
- **Frontend Framework**: React 19 + TypeScript
- **Routing**: React Router v7
- **State Management**: Zustand (Auth), React Query (Server State)
- **Form Management**: React Hook Form + Zod (Validation)
- **UI Components**: Radix UI + Tailwind CSS
- **HTTP Client**: Axios (with interceptors)
- **Theme**: Next-themes

### Cấu Trúc Thư Mục

```
src/
├── app/                          # Core app setup
│   ├── App.tsx                   # Root component
│   ├── router.tsx               # Route definitions
│   ├── store.ts                 # Zustand stores
│   └── providers/               # Query & Router providers
├── features/                     # Feature modules (auth, ritual, users, etc.)
│   ├── [feature-name]/
│   │   ├── schema.ts            # Zod validation schemas
│   │   ├── services.ts          # API service layer
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── store.ts             # Zustand store (if needed)
│   │   ├── components/          # UI components
│   │   ├── hooks/               # Custom React hooks
│   │   └── pages/               # Page components
├── lib/                         # Library & utilities
│   ├── axios.ts                 # Axios instance + interceptors
│   ├── queryClient.ts           # React Query config
│   ├── env.ts                   # Environment variables
│   └── utils.ts                 # Helper functions
├── shared/                      # Shared resources
│   ├── components/              # Shared UI components
│   │   ├── common/              # Common components (Auth, Loading, etc.)
│   │   └── ui/                  # Radix UI wrapper components
│   ├── services/                # BaseService class
│   ├── types/                   # Global TypeScript types
│   ├── constants/               # API endpoints & constants
│   ├── hooks/                   # Shared hooks
│   └── layouts/                 # Layout components
└── styles/                      # Global styles
```

---

## 🔄 Flow Dữ Liệu

### 1. Request Flow (From Component to API)

```
React Component
    ↓
[Custom Hook] (useRituals.ts)
    ↓
React Query (useMutation/useQuery)
    ↓
Service Layer (ritualService)
    ↓
Axios Instance + Interceptors
    ↓
API Backend
```

### 2. Response Flow (From API to Component)

```
API Backend
    ↓
Axios Response Interceptor
    ├─ Extract data from response
    ├─ Handle 401 (Refresh Token)
    └─ Handle errors
    ↓
React Query Cache
    ↓
Custom Hook returns data
    ↓
React Component (renders)
```

### 3. Authentication Flow

```
Login Page (LoginForm)
    ↓
useAuthMutation hook
    ↓
authService.login()
    ↓
Response: { accessToken, refreshToken }
    ↓
Zustand Store (useAuthStore)
    ├─ Save to localStorage
    └─ useAuthStore.setState()
    ↓
Protected/Guest Routes check
    ↓
API Interceptor adds Authorization header
```

---

## 📊 Chi Tiết Các Lớp

### 1. **Service Layer** (`features/[feature]/services.ts`)

Sử dụng `createBaseService()` - một factory function generic:

```typescript
// Ví dụ: Ritual Service
export const ritualService = createBaseService<Ritual, CreateRitualDto, UpdateRitualDto, RitualFilterParams>({
  endpoint: API_ENDPOINTS.RITUAL.BASE,
  remove: async (id) => {
    await apiClient.patch(`${API_ENDPOINTS.RITUAL.BASE}/${id}/soft-remove`);
  },
});

// Methods tự động có sẵn:
// - getAll(filter?: params) -> Promise<PaginatedResponse<T>>
// - getById(id) -> Promise<T>
// - create(dto) -> Promise<T>
// - update(id, dto) -> Promise<T>
// - remove(id) -> Promise<void>
```

### 2. **Custom Hooks** (`features/[feature]/hooks/`)

Kết hợp React Query + Service + Navigation:

```typescript
export function useRituals() {
  const [searchParams] = useSearchParams();
  // 1. Parse query params
  const filter = useMemo<RitualFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || undefined,
    };
  }, [searchParams]);

  // 2. Fetch data với React Query
  const query = useQuery({
    queryKey: [QUERY_KEYS.RITUALS, filter],
    queryFn: () => ritualService.getAll(filter),
    placeholderData: (prev) => prev, // Keep old data while fetching new
  });

  // 3. Return formatted data
  return {
    rituals: query.data?.data ?? [],
    pagination: query.data?.meta,
    isLoading: query.isLoading,
  };
}

export function useCreateRitual() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRitualDto) => ritualService.create(data),
    onSuccess: () => {
      toast.success("Tạo thành công");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RITUALS] });
      navigate("/admin/ritual");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
}
```

### 3. **Validation Schema** (`features/[feature]/schema.ts`)

Sử dụng Zod để validate form data:

```typescript
import { z } from "zod";

export const ritualSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  dateLunar: z.string().min(1, "Ngày âm lịch không được để trống"),
  difficultyLevel: z.enum(["dễ", "trung bình", "khó", "rất khó"]),
  description: z.string().optional(),
  content: z.string().optional(),
});

export type RitualFormData = z.infer<typeof ritualSchema>;
```

### 4. **Form Component** (Ví dụ: `RitualForm.tsx`)

Sử dụng React Hook Form + Zod validation:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ritualSchema, type RitualFormData } from "../schema";

export function RitualForm() {
  const form = useForm<RitualFormData>({
    resolver: zodResolver(ritualSchema),
    defaultValues: {
      name: "",
      difficultyLevel: "dễ",
    },
  });

  const { mutate, isPending } = useCreateRitual();

  return (
    <form onSubmit={form.handleSubmit((data) => mutate(data))}>
      {/* Form fields */}
    </form>
  );
}
```

### 5. **Page Component** (Ví dụ: `ManageRitualList.tsx`)

Tổng hợp hooks + components để tạo page:

```typescript
import { useRituals } from "../hooks/useRituals";
import { RitualTable } from "../components/RitualTable";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";

export default function ManageRitualList() {
  const { rituals, pagination, isLoading } = useRituals();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <RitualTable rituals={rituals} />
      <Pagination meta={pagination} />
    </div>
  );
}
```

---

## 🛠 Hướng Dẫn Tạo CRUD Feature Mới

### Bước 1: Tạo Cấu Trúc Thư Mục

```bash
src/features/[feature-name]/
├── schema.ts              # Zod validation schemas
├── types.ts               # TypeScript interfaces
├── services.ts            # API services
├── store.ts               # (Optional) Zustand store
├── components/
│   ├── [FeatureName]Form.tsx     # Form component
│   ├── [FeatureName]Table.tsx    # Table/List component
│   └── [FeatureName]Card.tsx     # Card/Item component
├── hooks/
│   └── use[FeatureNames].ts      # Custom hooks
└── pages/
    ├── [FeatureName]ListPage.tsx    # List/Manage page
    ├── [FeatureName]CreatePage.tsx  # Create page
    └── [FeatureName]EditPage.tsx    # Edit page
```

### Bước 2: Định Nghĩa Types (`types.ts`)

```typescript
// src/features/categories/types.ts
import type { BaseFilterParams } from "@/shared/types";

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

export interface CategoryFilterParams extends BaseFilterParams {
  search?: string;
}
```

### Bước 3: Tạo Validation Schema (`schema.ts`)

```typescript
// src/features/categories/schema.ts
import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Tên danh mục không được để trống")
    .max(100, "Tên tối đa 100 ký tự"),
  description: z
    .string()
    .max(500, "Mô tả tối đa 500 ký tự")
    .optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
```

### Bước 4: Tạo Service Layer (`services.ts`)

```typescript
// src/features/categories/services.ts
import { createBaseService } from "@/shared/services/BaseService";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryFilterParams,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";

export const categoryService = createBaseService<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryFilterParams
>({
  endpoint: API_ENDPOINTS.CATEGORY.BASE, // Thêm vào constants nếu chưa có
});

// Nếu có custom logic, override methods:
// export const categoryService = createBaseService<...>({
//   endpoint: API_ENDPOINTS.CATEGORY.BASE,
//   getAll: async (params) => {
//     // Custom fetch logic
//   },
//   remove: async (id) => {
//     await apiClient.patch(`${endpoint}/${id}/soft-remove`);
//   },
// });
```

### Bước 5: Tạo Custom Hooks (`hooks/use[FeatureNames].ts`)

```typescript
// src/features/categories/hooks/useCategories.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryFilterParams,
} from "../types";
import { categoryService } from "../services";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import { useMemo } from "react";

// 🔍 Get all categories with filtering
export function useCategories() {
  const [searchParams] = useSearchParams();
  
  const filter = useMemo<CategoryFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || undefined,
    };
  }, [searchParams]);

  const query = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, filter],
    queryFn: () => categoryService.getAll(filter),
    placeholderData: (prev) => prev,
  });

  return {
    categories: query.data?.data ?? [],
    pagination: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error,
  };
}

// ➕ Create category
export function useCreateCategory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryService.create(data),
    onSuccess: () => {
      toast.success("Tạo danh mục thành công");
      // Invalidate cache để refetch data
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.CATEGORIES] 
      });
      navigate("/admin/categories");
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
}

// ✏️ Update category
export function useUpdateCategory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoryService.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật danh mục thành công");
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.CATEGORIES] 
      });
      navigate("/admin/categories");
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
}

// 🗑️ Delete category
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.remove(id),
    onSuccess: () => {
      toast.success("Xóa danh mục thành công");
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.CATEGORIES] 
      });
    },
    onError: (error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });
}

// 🔎 Get single category by ID
export function useGetCategory(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id, // Chỉ fetch khi có id
  });
}
```

### Bước 6: Tạo Form Component (`components/CategoryForm.tsx`)

```typescript
// src/features/categories/components/CategoryForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormData } from "../schema";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import type { Category } from "../types";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
}

export function CategoryForm({
  initialData,
  onSubmit,
  isLoading = false,
}: CategoryFormProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Tên danh mục *</Label>
        <Input
          id="name"
          placeholder="Nhập tên danh mục"
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <span className="text-red-500 text-sm">
            {form.formState.errors.name.message}
          </span>
        )}
      </div>

      <div>
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          placeholder="Nhập mô tả danh mục"
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <span className="text-red-500 text-sm">
            {form.formState.errors.description.message}
          </span>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Lưu"}
      </Button>
    </form>
  );
}
```

### Bước 7: Tạo List/Table Component (`components/CategoryTable.tsx`)

```typescript
// src/features/categories/components/CategoryTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDeleteCategory } from "../hooks/useCategories";
import type { Category } from "../types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/shared/components/ui/alert-dialog";

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const navigate = useNavigate();
  const { mutate: deleteCategory } = useDeleteCategory();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Tên</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-mono text-sm">{category.id}</TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.description}</TableCell>
            <TableCell className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
              >
                Sửa
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Xóa
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc muốn xóa danh mục "{category.name}"?
                  </AlertDialogDescription>
                  <AlertDialogAction
                    onClick={() => deleteCategory(category.id)}
                  >
                    Xóa
                  </AlertDialogAction>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Bước 8: Tạo Page Components

#### List Page (`pages/CategoryListPage.tsx`)

```typescript
// src/features/categories/pages/CategoryListPage.tsx
import { useCategories } from "../hooks/useCategories";
import { CategoryTable } from "../components/CategoryTable";
import { LoadingSpinner, ErrorState, EmptyState } from "@/shared/components/common";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/shared/components/ui/input";
import { useSearchParams } from "react-router-dom";

export default function CategoryListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, pagination, isLoading, error } = useCategories();

  const handleSearch = (search: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (search) {
      newParams.set("search", search);
      newParams.set("page", "1");
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;
  if (categories.length === 0)
    return <EmptyState message="Chưa có danh mục nào" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản Lý Danh Mục</h1>
        <Button onClick={() => navigate("/admin/categories/create")}>
          + Thêm Danh Mục
        </Button>
      </div>

      <Input
        placeholder="Tìm kiếm danh mục..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("search") ?? ""}
      />

      <CategoryTable categories={categories} />

      {pagination && (
        <Pagination meta={pagination} baseUrl="/admin/categories" />
      )}
    </div>
  );
}
```

#### Create Page (`pages/CategoryCreatePage.tsx`)

```typescript
// src/features/categories/pages/CategoryCreatePage.tsx
import { useCreateCategory } from "../hooks/useCategories";
import { CategoryForm } from "../components/CategoryForm";
import type { CategoryFormData } from "../schema";

export default function CategoryCreatePage() {
  const { mutate: createCategory, isPending } = useCreateCategory();

  const handleSubmit = (data: CategoryFormData) => {
    createCategory(data);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tạo Danh Mục Mới</h1>
      <CategoryForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}
```

#### Edit Page (`pages/CategoryEditPage.tsx`)

```typescript
// src/features/categories/pages/CategoryEditPage.tsx
import { useParams } from "react-router-dom";
import { useGetCategory, useUpdateCategory } from "../hooks/useCategories";
import { CategoryForm } from "../components/CategoryForm";
import { LoadingSpinner, ErrorState } from "@/shared/components/common";
import type { CategoryFormData } from "../schema";

export default function CategoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: category, isLoading, error } = useGetCategory(id!);
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;
  if (!category) return <div>Danh mục không tìm thấy</div>;

  const handleSubmit = (data: CategoryFormData) => {
    updateCategory({ id: id!, data });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Chỉnh Sửa Danh Mục</h1>
      <CategoryForm
        initialData={category}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </div>
  );
}
```

### Bước 9: Thêm API Endpoints Constant

```typescript
// src/shared/constants/index.ts
export const API_ENDPOINTS = {
  // ... existing endpoints
  CATEGORY: {
    BASE: "/categories",
    // Nếu cần: DETAIL: (id) => `/categories/${id}`,
  },
};

export const QUERY_KEYS = {
  // ... existing keys
  CATEGORIES: "categories",
};
```

### Bước 10: Thêm Routes

```typescript
// src/app/router.tsx
import CategoryListPage from "@/features/categories/pages/CategoryListPage";
import CategoryCreatePage from "@/features/categories/pages/CategoryCreatePage";
import CategoryEditPage from "@/features/categories/pages/CategoryEditPage";

export const router = createBrowserRouter([
  {
    element: <UserLayout />,
    children: [
      // ... existing routes
      // Admin routes (wrapped in ProtectedRoute)
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          // ... existing admin routes
          {
            path: "categories",
            element: <CategoryListPage />,
          },
          {
            path: "categories/create",
            element: <CategoryCreatePage />,
          },
          {
            path: "categories/:id/edit",
            element: <CategoryEditPage />,
          },
        ],
      },
    ],
  },
]);
```

---

## 📌 Ví Dụ Thực Tế

### Scenario: Thêm Feature "Bộ Lễ Vật" (Offering Management)

Làm theo 10 bước trên với structure:

```
src/features/offerings/
├── types.ts
│   - Offering interface
│   - CreateOfferingDto
│   - UpdateOfferingDto
│   - OfferingFilterParams
├── schema.ts
│   - offeringSchema (Zod)
├── services.ts
│   - offeringService (createBaseService)
├── hooks/
│   - useOfferings() -> get all with filter
│   - useCreateOffering()
│   - useUpdateOffering()
│   - useDeleteOffering()
│   - useGetOffering(id)
├── components/
│   - OfferingForm.tsx
│   - OfferingTable.tsx
└── pages/
    - OfferingListPage.tsx
    - OfferingCreatePage.tsx
    - OfferingEditPage.tsx
```

**Key Points:**
- ✅ Tất cả business logic ở service layer
- ✅ Tất cả form validation ở schema.ts
- ✅ React Query handle caching + invalidation
- ✅ Custom hooks handle navigation + toast
- ✅ Components chỉ care về UI
- ✅ Pages compose hooks + components

---

## 🎯 Best Practices

### 1. **Separation of Concerns**
- Service Layer: API calls only
- Custom Hooks: Data fetching + side effects
- Components: UI only
- Pages: Compose everything

### 2. **Error Handling**
```typescript
// Tất cả mutations nên có error handler
const { mutate, isPending, error } = useMutation({
  mutationFn: categoryService.create,
  onError: (error) => {
    toast.error(error.message);
  },
});
```

### 3. **Loading States**
```typescript
// Luôn show loading state
<Button disabled={isPending}>
  {isPending ? "Đang xử lý..." : "Lưu"}
</Button>
```

### 4. **Query Key Management**
```typescript
// Use consistent query keys
queryKey: [QUERY_KEYS.CATEGORIES, filter]
// Invalidate exactly
queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] })
```

### 5. **Type Safety**
```typescript
// Luôn define proper types
interface CategoryFilterParams extends BaseFilterParams {
  search?: string;
}

export const categoryService = createBaseService<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryFilterParams
>(config);
```

---

## 🚀 Checklist Tạo CRUD Feature

- [ ] 1. Tạo folder structure
- [ ] 2. Define types.ts
- [ ] 3. Create schema.ts with Zod
- [ ] 4. Create services.ts using createBaseService
- [ ] 5. Create custom hooks (get, create, update, delete)
- [ ] 6. Create Form component
- [ ] 7. Create Table/List component
- [ ] 8. Create Pages (List, Create, Edit)
- [ ] 9. Add API_ENDPOINTS + QUERY_KEYS to constants
- [ ] 10. Add routes to router.tsx
- [ ] 11. Test all CRUD operations
- [ ] 12. Add error handling + loading states
