/*
 * Název souboru:    ReportForm.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Formulář pro editaci exportované zprávy
 */

import { ReportData } from "../types/types";

type ReportFormProps = {
  data: ReportData;
  onlyIsokinetic: boolean;
  setData: React.Dispatch<React.SetStateAction<ReportData>>;
  setOnlyIsokinetic: React.Dispatch<React.SetStateAction<boolean>>;
  setEdited: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReportForm = ({
  data,
  onlyIsokinetic,
  setData,
  setOnlyIsokinetic,
  setEdited,
}: ReportFormProps) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full justify-center text-lg font-semibold">
        Edit report
      </div>
      <input
        type="text"
        placeholder="Title"
        value={data.title}
        onChange={(e) => {
          setData((prev) => ({ ...prev, title: e.target.value }));
          setEdited(true);
        }}
        className="rounded border border-gray-300 p-2"
      />

      {/* <input
        type="text"
        placeholder="Therapist"
        value={data.therapist}
        onChange={(e) => {
          setData((prev) => ({ ...prev, therapist: e.target.value }));
          setEdited(true);
        }}
        className="rounded border border-gray-300 p-2"
      /> */}

      <textarea
        value={data.comment}
        onChange={(e) => {
          setData((prev) => ({ ...prev, comment: e.target.value }));
          setEdited(true);
        }}
        className="h-32 resize-none rounded border border-gray-300 p-2"
        placeholder="Comment"
      />
      <div className="flex gap-x-2">
        <div>Only isokinetic</div>
        <input
          type="checkbox"
          className="h-6 w-6"
          checked={onlyIsokinetic}
          onChange={(e) => {
            setOnlyIsokinetic(e.target.checked);
            setEdited(true);
          }}
        />
      </div>
    </div>
  );
};

export default ReportForm;
