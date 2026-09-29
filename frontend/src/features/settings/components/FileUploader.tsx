/*
 * Název souboru:    FileUploader.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Formulář pro nahrání souborů
 */

import { ChangeEvent, useRef } from "react";
import { useSettingsContext } from "../contexts/SettingsContext";
import { Button } from "components/ui/button";
import { formatDate } from "utils/formatting";
import { X } from "lucide-react";
import { Loader } from "components/ui/loader";

const FileUploader = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    isSynchronizing,
    selectedFiles,
    uploadResult,
    setSelectedFiles,
    setUploadResult,
    submitFiles,
  } = useSettingsContext();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleSubmitFiles = (event: React.FormEvent) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    submitFiles(event);
  };
  const failedFiles = uploadResult ? uploadResult.failedFiles : [];
  return (
    <div
      className={`flex w-auto flex-col gap-y-2 rounded-lg border-2 border-solid border-primary bg-white p-4`}
    >
      <form onSubmit={handleSubmitFiles}>
        <div className="flex items-center justify-between">
          <div>
            <label
              htmlFor="file-upload"
              className={`rounded-lg border border-gray-300 px-4 py-2 ${
                isSynchronizing
                  ? "pointer-events-none cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-gray-200"
              }`}
            >
              Select files
            </label>
            <input
              ref={fileInputRef}
              disabled={isSynchronizing}
              className="hidden"
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <Button
            type="submit"
            disabled={!selectedFiles.length || isSynchronizing}
            className=""
          >
            Synchronise
          </Button>
        </div>
      </form>

      {failedFiles.length > 0 && (
        <div className="">
          <div className="flex items-center justify-between">
            <div>Failed files</div>
            <X
              className="text-red-500 hover:scale-125"
              onClick={() => setUploadResult(undefined)}
            />
          </div>
          {failedFiles.map((upload, index) => (
            <div
              key={index}
              className="mb-1 rounded-lg border border-gray-300 px-2 text-red-500"
            >
              {upload.message}
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <>
          <div>{`Number of files:${selectedFiles.length}`}</div>
          <div
            className={`relative flex max-h-72 flex-col gap-y-2 rounded-lg border border-gray-300 p-1 text-sm ${
              isSynchronizing ? "overflow-hidden" : "overflow-auto"
            }`}
          >
            {isSynchronizing && (
              <div className="absolute inset-0 z-10 h-full w-full items-center justify-center bg-white bg-opacity-5">
                <Loader />
              </div>
            )}

            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-300 px-4"
              >
                <p>{`Filename: ${file.name}`}</p>
                <p>{`Last modified: ${formatDate(file.lastModified)}`}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;
