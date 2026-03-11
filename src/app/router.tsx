import { UserLayout } from "@/shared/layouts/UserLayout";
import { createBrowserRouter } from "react-router-dom";
// import MainLayout from "./components/layouts/MainLayout";
import HomePage from "@/features/landing/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RitualsCatalog from "@/features/ritual/pages/RitualsCatalog";
import { GuestRoute } from "@/shared/components/common/GuestRoute";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import { ProtectedRoute } from "@/shared/components/common/ProtectedRoute";
// import AdminLayout from "@/shared/layouts/AdminLayout";
const AdminLayout = lazy(() => import("@/shared/layouts/AdminLayout"));
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";
import ProfilePage from "@/features/users/pages/ProfilePage";
import NotFoundPage from "@/features/auth/pages/NotFoundPage";
import ManageRitualList from "@/features/ritual/pages/ManageRitualList";
// import { ManageRitualCreate } from "@/features/ritual/pages/ManageRitualCreate";
// import { ManageRitualEdit } from "@/features/ritual/pages/ManageRitualEdit";
const ManageRitualCreate = lazy(
  () => import("@/features/ritual/pages/ManageRitualCreate"),
);
const ManageRitualEdit = lazy(
  () => import("@/features/ritual/pages/ManageRitualEdit"),
);
// import DashboardPage from "@/features/dashboards/pages/DashBoardPage";
const DashboardPage = lazy(
  () => import("@/features/dashboards/pages/DashBoardPage"),
);
const UserManagementPage = lazy(
  () => import("@/features/users/pages/UserManagementPage"),
);
import { RitualDetail } from "@/features/ritual/pages/RitualDetailPage";
import { lazy, Suspense, type ReactNode } from "react";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
const withSuspense = (children: ReactNode) => {
  return (
    <Suspense fallback={<LoadingSpinner className="py-20" size="lg" />}>
      {children}
    </Suspense>
  );
};

//1. Su dung createBrowserRouter - API moi nhat cua v6
export const router = createBrowserRouter([
  //Public layout (User)
  {
    element: <UserLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "ritual", element: <RitualsCatalog /> },
      { path: "ritual/:id", element: <RitualDetail /> },
      {
        path: "login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
      { path: "unauthorized", element: <UnauthorizedPage /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      //404 fallback
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  //Admin Layout (Admin)
  {
    path: "admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        {withSuspense(<AdminLayout />)}
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(<DashboardPage />) },
      { path: "ritual", element: withSuspense(<ManageRitualList />) },
      { path: "ritual/create", element: withSuspense(<ManageRitualCreate />) },
      { path: "ritual/:id/edit", element: withSuspense(<ManageRitualEdit />) },
      { path: "users", element: withSuspense(<UserManagementPage />) },
    ],
  },
]);
