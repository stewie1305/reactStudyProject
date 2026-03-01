import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LoginForm } from "../components/LoginForm";
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Hoc Axios Interceptor & Service Layer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium hover:underline focus-visible:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
