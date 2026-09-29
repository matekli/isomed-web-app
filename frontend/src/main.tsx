/*
 * Název souboru:    main.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hlavní soubor aplikace, který inicializuje a renderuje React aplikaci s
 *                   routováním a dynamickým nastavením názvu dokumentu na základě aktuální
 *                   stránky.
 */

import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App";
import PatientsListPage from "features/patient/pages/PatientListPage";
import PatientDetailPage from "features/patient/pages/PatientDetailPage";
import SettingsPage from "features/settings/pages/SettingsPage";
import ErrorPage from "features/error/pages/ErrorPage";
import GroupManagementPage from "features/group/pages/GroupManagementPage";
import ComparisonPage from "features/comparison/pages/ComparisonPage";
import ComparisonDetailPage from "features/comparison/pages/ComparisonDetailPage";
import ExaminationListPage from "features/examination/pages/ExaminationListPage";
import { QueryClient } from "@tanstack/react-query";
import ExaminationDetailPage from "features/examination/pages/ExaminationDetailPage";
import ReportList from "features/print/pages/ReportList";

// Komponenta pro dynamickou změnu názvu dokumentu
const DynamicTitle = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/*":
        document.title = "Patients | ISOMED";
        break;
      case "/group":
        document.title = "Groups | ISOMED";
        break;
      case "/comparison":
        document.title = "Comparisons | ISOMED";
        break;
      case "/examination":
        document.title = "Examinations | ISOMED";
        break;
      case "/patient":
        document.title = "Patients | ISOMED";
        break;
      case "/settings":
        document.title = "Settings | ISOMED";
        break;
      default:
        if (location.pathname.startsWith("/examination/")) {
          document.title = "Examination detail | ISOMED";
        } else if (location.pathname.startsWith("/patient/")) {
          document.title = "Patient detail | ISOMED";
        } else if (location.pathname.startsWith("/comparison/")) {
          document.title = "Comparison detail | ISOMED";
        } else {
          document.title = "ISOMED";
        }
    }
  }, [location]);

  return <>{children}</>;
};

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/*",
    element: (
      <DynamicTitle>
        <ErrorBoundary
          FallbackComponent={ErrorPage}
          onReset={() => window.location.reload()}
        >
          <App client={queryClient} />
        </ErrorBoundary>
      </DynamicTitle>
    ),
    children: [
      {
        path: "",
        element: <ExaminationListPage />,
      },
      {
        path: "comparison",
        element: <ComparisonPage />,
      },
      {
        path: "group",
        element: <GroupManagementPage />,
      },
      {
        path: "examination",
        element: <ExaminationListPage />,
      },
      {
        path: "patient",
        element: <PatientsListPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "examination/:examination_id",
        element: <ExaminationDetailPage />,
      },

      {
        path: "patient/:patient_id",
        element: <PatientDetailPage />,
      },
      {
        path: "saved",
        element: <ReportList />,
      },
      {
        path: "comparison/:data",
        element: <ComparisonDetailPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
