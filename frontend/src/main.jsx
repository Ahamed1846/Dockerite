import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Containers from "./pages/Containers";
import ContainerDetail from "./pages/ContainerDetail";
import Logs from "./pages/Logs";
import Images from "./pages/Images";
import Volumes from "./pages/Volumes";
import VolumeDetail from "./pages/VolumeDetail";
import Networks from "./pages/Networks";
import NetworkDetail from "./pages/NetworkDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/containers", element: <Containers /> },
      { path: "/containers/:id", element: <ContainerDetail /> },
      { path: "/containers/:id/logs", element: <Logs /> },
      { path: "/images", element: <Images /> },
      { path: "/volumes", element: <Volumes /> },
      { path: "/volumes/:name", element: <VolumeDetail /> },
      { path: "/networks", element: <Networks /> },
      { path: "/networks/:id", element: <NetworkDetail /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
