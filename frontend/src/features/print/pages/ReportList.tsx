/*
 * Název souboru:    ReportList.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Stránka se seznamem uložených porovnání a zpráv
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import PageTitle from "components/PageTitle";
import { Button } from "components/ui/button";
import { Loader } from "components/ui/loader";
import { successToast } from "components/ui/toast";
import { useComparisonStore } from "features/comparison/store/comparisonStore";
import { Comparison } from "features/comparison/types/types";
import { ExaminationWithPatient } from "features/examination/types/types";
import { useSettingsContext } from "features/settings/contexts/SettingsContext";
import { Link } from "react-router-dom";
import { anonymize } from "utils/anonymize";
import { axios } from "utils/api/axios";
import { fetchData } from "utils/api/fetchData";
import { convertJoint, convertSide } from "utils/converting";
import { extractDate, extractTime } from "utils/formatting";

type Saved = {
  id: number;
  description: string;
  title: string | null;
  therapist: string | null;
  createdAt: Date;
  comment: string | null;
  paramsJson: Comparison[];
};
const ReportList = () => {
  const queryClient = useQueryClient();

  const { setLoaded } = useComparisonStore();
  const { settings } = useSettingsContext();

  const { data: saved, isFetching } = useQuery({
    queryFn: () => fetchData<Saved[]>("/saved"),
    queryKey: ["saved"],
    refetchOnWindowFocus: false,
  });

  const { data: examinations, isFetching: isExamiantionFetching } = useQuery({
    queryFn: () => fetchData<ExaminationWithPatient[]>("/examination"),
    queryKey: ["examination"],
    refetchOnWindowFocus: false,
  });

  const handleDelete = async (id: number) => {
    try {
      await axios.delete("/saved", { data: [id] });
      queryClient.invalidateQueries({ queryKey: ["saved"] });
      successToast("Comparison deleted successfully!");
    } catch (error) {
      console.error("Error deleting:", error);
      successToast("Error deleting comparison!");
    }
  };

  if (saved?.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-500 bg-opacity-35 text-5xl">
        No saved comparisons
      </div>
    );
  }

  if (isFetching || !saved || isExamiantionFetching || !examinations) {
    return <Loader />;
  }

  return (
    <>
      <PageTitle text="saved comparisons" />
      <div className="mx-auto mb-2 flex w-11/12 flex-col gap-4 gap-y-4 rounded-lg border-2 border-primary p-4 xl:grid xl:grid-cols-2">
        {saved.map((s) => {
          const query = encodeURIComponent(JSON.stringify(s.paramsJson));
          const testType = s.paramsJson[0].type;
          const joint = convertJoint(s.paramsJson[0].joint);

          const formattedDate = new Intl.DateTimeFormat("cs-CZ", {
            timeZone: "Europe/Prague",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(new Date(s.createdAt));

          return (
            <div
              className="w-full rounded-lg border-2 border-primary px-4 py-2"
              key={s.id}
            >
              <div className="mb-2 flex w-full justify-between gap-x-2">
                <div>
                  <div className="max-h-24 w-full flex-1 overflow-y-auto overflow-x-hidden font-semibold">
                    {s.description}
                  </div>

                  <div className="font-semibold uppercase">{`${testType} - ${joint}`}</div>
                  <div>{`Created at: ${formattedDate}`}</div>
                </div>
                <div key={s.id} className="flex flex-col items-end gap-y-2">
                  <Link
                    to={`/comparison/${query}?id=${s.id}`}
                    state={{
                      id: s.id,
                      reportData: {
                        title: s.title,
                        therapist: s.therapist,
                        comment: s.comment,
                      },
                    }}
                    onClick={() => setLoaded(false)}
                  >
                    <Button>Open</Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-600 hover:bg-red-500"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {s.paramsJson.map((p, index) => {
                  const examination = examinations.find((e) => e.id === p.id);
                  if (!examination) {
                    return <div key={index}>Examination not available</div>;
                  }
                  const joint = convertJoint(examination.joint);
                  const side = convertSide(examination.joint_side);
                  return (
                    <div
                      className="grid grid-cols-2 rounded-lg border border-primary p-2"
                      key={index}
                    >
                      <div>{`Patient: ${anonymize(`${examination.patient.firstname} ${examination.patient.lastname}`, settings?.safeMode)}`}</div>
                      <div>{`Joint: ${side} ${joint}`}</div>
                      <div>{`Speed: ${examination.speed_1} / ${examination.speed_2}`}</div>
                      <div>{`Date of test: ${extractDate(examination.datetime)}, ${extractTime(examination.datetime)}`}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ReportList;
