/*
 * Název souboru:    SettingsContext.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Kontext pro sdílení nastavení napříč aplikací
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getItem, setItem } from "utils/localStorage";
import { uploadFiles } from "../utils/uploadFiles";
import { UploadResult } from "../types/types";

export interface SettingsType {
  safeMode: boolean;
  lastSync: number | null;
}

interface SettingsContextProps {
  settings: SettingsType | undefined;
  isSynchronizing: boolean;
  filesCount: number;
  uploadedFiles: number;
  selectedFiles: File[];
  uploadResult: UploadResult | undefined;
  isDeleting: boolean;
  refreshSettings: () => void;
  setIsSynchronizing: (isSyncing: boolean) => void;
  setFilesCount: (count: number) => void;
  setUploadedFiles: (uploaded: number) => void;
  setSelectedFiles: (files: File[]) => void;
  setUploadResult: (result: UploadResult | undefined) => void;
  setIsDeleting: (isDeleting: boolean) => void;
  submitFiles: (event: React.FormEvent) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined,
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SettingsType | undefined>(undefined);
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  const [filesCount, setFilesCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadResult, setUploadResult] = useState<UploadResult | undefined>(
    undefined,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const submitFiles = async (event: React.FormEvent) => {
    event.preventDefault();

    setFilesCount(selectedFiles.length);

    const result = await uploadFiles(
      selectedFiles,
      setUploadedFiles,
      setIsSynchronizing,
      settings,
      refreshSettings,
    );

    setUploadResult(result);

    setSelectedFiles([]);
  };

  const refreshSettings = () => {
    setSettings(getItem("settings"));
  };

  useEffect(() => {
    if (!getItem("settings")) {
      setItem("settings", {
        safeMode: false,
        lastSync: null,
      });
    }
    setSettings(getItem("settings"));
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isSynchronizing,
        filesCount,
        uploadedFiles,
        selectedFiles,
        uploadResult,
        isDeleting,
        refreshSettings,
        setIsSynchronizing,
        setFilesCount,
        setUploadedFiles,
        setSelectedFiles,
        setUploadResult,
        setIsDeleting,
        submitFiles,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "useSettingsContext musí být použit uvnitř SettingsProvider",
    );
  }
  return context;
};
