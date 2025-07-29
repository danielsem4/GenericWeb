import { RouterProvider } from "react-router-dom";
import router from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" theme="light" />
    </QueryClientProvider>
  );
}

export default App;
