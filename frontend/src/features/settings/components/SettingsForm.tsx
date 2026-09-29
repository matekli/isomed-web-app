/*
 * Název souboru:    SettingsForm.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Přepínač pro zapnutí či vypnutí anonymizovaného režimu aplikace
 */

import { Button } from "components/ui/button";
import { successToast } from "components/ui/toast";
import { useState, useEffect } from "react";
import { setItem } from "utils/localStorage";
import { useSettingsContext } from "../contexts/SettingsContext";
import { Switch } from "components/ui/switch";

const SettingsForm = () => {
  const [safeMode, setSafeMode] = useState<boolean>(false);
  const { settings, refreshSettings } = useSettingsContext();

  useEffect(() => {
    if (settings) {
      setSafeMode(settings.safeMode);
    }
  }, [settings]);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setItem("settings", {
      safeMode: safeMode,
      lastSync: settings?.lastSync,
    });
    successToast("Settings saved");
    refreshSettings();
  };
  return (
    <form onSubmit={handleSettingsSubmit}>
      <div className="flex pb-4">
        <p className="pr-4">Hide sensitive data</p>
        <Switch
          checked={safeMode}
          onCheckedChange={(checked) => setSafeMode(checked)}
        />
      </div>
      <div className="pb-4">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default SettingsForm;
