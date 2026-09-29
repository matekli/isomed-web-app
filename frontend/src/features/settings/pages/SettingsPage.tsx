/*
 * Název souboru:    SettingsPage.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Stránka nastavení aplikace
 */

import { useSettingsContext } from "features/settings/contexts/SettingsContext";
import { Loader } from "components/ui/loader";
import PageTitle from "components/PageTitle";
import FileUploader from "../components/FileUploader";
import SettingsForm from "../components/SettingsForm";
import DeleteData from "../components/DeleteData";
import DeletingLoader from "../components/DeletingLoader";

const SettingsPage = () => {
  const { settings, isDeleting } = useSettingsContext();

  if (!settings) {
    return <Loader />;
  }

  if (isDeleting) {
    return <DeletingLoader />;
  }

  return (
    <>
      <PageTitle text="settings" />
      <div className="m-auto flex w-11/12 flex-col gap-y-2 rounded-lg border-2 border-solid border-primary p-8 px-fluid-xl sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
        <SettingsForm />

        <FileUploader />

        <DeleteData />
      </div>
    </>
  );
};

export default SettingsPage;
