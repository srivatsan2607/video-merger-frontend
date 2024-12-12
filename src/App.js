import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./routes/NotFound";
import UploadPage from "./pages/upload/Upload";
import DashboardPage from "./pages/dashboard/DashboardPage";
import MergedVideosPage from "./pages/merged/MergedVideos";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/upload",
    element: (
      <ProtectedRoute>
        <UploadPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/merged",
    element: (
      <ProtectedRoute>
        <MergedVideosPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
