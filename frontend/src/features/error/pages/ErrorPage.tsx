/*
 * Název souboru:    ErrorPage.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Stránka zobrazení chybového stavu aplikace
 */

import { Button } from "components/ui/button";
import { FallbackProps } from "react-error-boundary";

function ErrorPage({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="grid h-screen w-full place-items-center">
      <div className="flex flex-col justify-center">
        <p className="text-center">Something went wrong:</p>
        <pre style={{ color: "red" }}>{error.message}</pre>
        <div className="flex justify-center">
          <Button
            className="bg-slate-500 hover:bg-slate-600"
            onClick={resetErrorBoundary}
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ErrorPage;
