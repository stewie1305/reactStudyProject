import { UserLayout } from "@/shared/layouts/UserLayout";
import { createBrowserRouter } from "react-router-dom";
// import MainLayout from "./components/layouts/MainLayout";
import HomePage from "@/features/landing/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RitualsCatalog from "@/features/ritual/pages/RitualsCatalog";
import RitualDetailPage from "@/features/ritual/pages/RitualDetailPage";
import { GuestRoute } from "@/shared/components/common/GuestRoute";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import { ProtectedRoute } from "@/shared/components/common/ProtectedRoute";
import AdminLayout from "@/shared/layouts/AdminLayout";
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";
import ProfilePage from "@/features/auth/pages/ProfilePage";
import NotFoundPage from "@/features/auth/pages/NotFoundPage";
import ManageRitualList from "@/features/ritual/pages/ManageRitualList";
import ManageRitualCreate from "@/features/ritual/pages/ManageRitualCreate";
import ManageRitualEdit from "@/features/ritual/pages/ManageRitualEdit";
import DashboardPage from "@/features/dashboards/pages/DashBoardPage";
import UserManagementPage from "@/features/users/pages/UserManagementPage";
//1. Su dung createBrowserRouter - API moi nhat cua v6
export const router = createBrowserRouter([
  //Public layout (User)
  {
    element: <UserLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "rituals", element: <RitualsCatalog /> },
      { path: "rituals/:id", element: <RitualDetailPage /> },
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
        element:(
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      },
      //404 fallback
      {path: "*", element: <NotFoundPage />},
    ],
  },
  //Admin Layout (Admin)
  {
    path: "admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      {path: "rituals", element: <ManageRitualList/>},
      {path: "rituals/create", element: <ManageRitualCreate/>},
      {path: "rituals/:id/edit", element: <ManageRitualEdit/>},
      {path: "users", element: <UserManagementPage />},
    ],
  }
]);
