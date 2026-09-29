/*
 * Název souboru:    loader.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení spinneru (indikátoru načítání).
 */

import { Oval } from "react-loader-spinner";
import { cn } from "utils/utils";
interface LoaderProps {
  className?: string;
  height?: string;
  weight?: string;
}
export const Loader = ({ className, height, weight }: LoaderProps) => {
  return (
    <Oval
      visible={true}
      height={height ?? 80}
      width={weight ?? 80}
      color="#327ff9"
      secondaryColor="#1984d1"
      ariaLabel="oval-loading"
      wrapperStyle={{}}
      wrapperClass={cn("flex justify-center p-4", className)}
    />
  );
};
