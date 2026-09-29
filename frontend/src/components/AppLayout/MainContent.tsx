/*
 * Název souboru:    MainContent.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta zodpovědná za hlavní obsah aplikace, která spravuje všechny routy.
 *                   Definuje routování pro různé stránky aplikace
 */

import { Routes, Route } from "react-router-dom";
import ExaminationListPage from "features/examination/pages/ExaminationListPage";
import ExaminationDetailPage from "features/examination/pages/ExaminationDetailPage";
import PatientListPage from "features/patient/pages/PatientListPage";
import PatientDetailPage from "features/patient/pages/PatientDetailPage";
import SettingsPage from "features/settings/pages/SettingsPage";
import GroupManagementPage from "features/group/pages/GroupManagementPage";
import ComparisonDetailPage from "features/comparison/pages/ComparisonDetailPage";
import ComparisonPage from "features/comparison/pages/ComparisonPage";
import ReportList from "features/print/pages/ReportList";

const MainContent = () => {
  return (
    <div className="main-scrollbar flex-1 overflow-auto">
      <Routes>
        <Route path="/" element={<ExaminationListPage />} />
        <Route path="examination" element={<ExaminationListPage />} />
        <Route path="examination/:id" element={<ExaminationDetailPage />} />
        <Route path="patient" element={<PatientListPage />} />
        <Route path="patient/:id" element={<PatientDetailPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="group" element={<GroupManagementPage />} />
        <Route path="comparison" element={<ComparisonPage />} />
        <Route path="saved" element={<ReportList />} />
        <Route path="comparison/:id" element={<ComparisonDetailPage />} />
        <Route
          path="*"
          element={
            <div>
              <h1>404 - Stránka nenalezena</h1>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default MainContent;
