import { Toaster } from "@/shared/components/ui/sonner";
import { QueryProvider } from "./providers/QueryProvider";
import { RouterProvider } from "./providers/RouterProvider";
export default function App() {
  return (
    <QueryProvider>
      <RouterProvider />
      <Toaster position="top-right" richColors closeButton />
    </QueryProvider>
  );
}
