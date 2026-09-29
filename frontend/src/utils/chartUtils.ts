/*
 * Název souboru:    chartUtils.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Funkce pro přibližování a pohyb v grafu.
 */

// Stará se o přibližování v grafu
export const zoom = (
  event: WheelEvent,
  chartStart: number,
  chartEnd: number,
  numberOfMeasurements: number,
  onChartStartChange: (newStart: number) => void,
  onChartEndChange: (newEnd: number) => void,
) => {
  if (numberOfMeasurements >= chartEnd) {
    const containerWidth = (event.currentTarget as HTMLDivElement).offsetWidth;
    const offsetX = event.offsetX;
    const zoomFactor = event.deltaY > 0 ? 1.2 : 0.8;

    const zoomCenter =
      chartStart + (offsetX / containerWidth) * (chartEnd - chartStart);
    const newStart = Math.max(
      0,
      zoomCenter - (zoomCenter - chartStart) * zoomFactor,
    );
    let newEnd = Math.min(
      numberOfMeasurements,
      zoomCenter + (chartEnd - zoomCenter) * zoomFactor,
    );

    if (newEnd <= newStart) newEnd = newStart + 1;

    if (newStart !== chartStart || newEnd !== chartEnd) {
      onChartStartChange(newStart);
      onChartEndChange(newEnd);
    }

    event.preventDefault();
  }
};

// Začíná táhnutí grafu - uloží aktuální pozici myši a nastaví dragování na true
export const startDragging = (
  event: React.MouseEvent<HTMLDivElement>,
  setIsDragging: (dragging: boolean) => void,
  lastMouseX: React.MutableRefObject<number>,
) => {
  setIsDragging(true);
  lastMouseX.current = event.clientX;
};

// Stará se o táhnutí grafu - aktualizuje chartStart a chartEnd na základě pohybu myši
export const drag = (
  event: MouseEvent,
  isDragging: boolean,
  chartStart: number,
  chartEnd: number,
  numberOfMeasurements: number,
  lastMouseX: React.MutableRefObject<number>,
  setChartStart: React.Dispatch<React.SetStateAction<number>>,
  setChartEnd: React.Dispatch<React.SetStateAction<number>>,
) => {
  if (isDragging) {
    const deltaX = event.clientX - lastMouseX.current;
    lastMouseX.current = event.clientX;

    setChartStart((prevStart) => {
      const newStart = prevStart - deltaX;

      // Zajistíme, že chartStart nebude menší než 0
      if (newStart < 0) {
        return 0;
      }

      // Zajistíme, že chartStart nebude větší než maximum (rozdíl mezi chartEnd a počtem měření)
      if (newStart > numberOfMeasurements - (chartEnd - prevStart)) {
        return numberOfMeasurements - (chartEnd - prevStart);
      }

      return newStart;
    });

    // Aktualizace chartEnd
    setChartEnd((prevEnd) => {
      const newEnd = prevEnd - deltaX;

      // Pokud je chartStart na 0, necháme chartEnd beze změny
      if (chartStart === 0) {
        return prevEnd;
      }

      // Zajistíme, že chartEnd nebude menší než chartStart
      if (newEnd < chartStart) {
        return chartStart;
      }

      // Zajistíme, že chartEnd nebude větší než počet měření
      if (newEnd > numberOfMeasurements) {
        return numberOfMeasurements;
      }

      return newEnd;
    });
  }
};

// Zastaví táhnutí grafu - nastaví dragging na false
export const stopDragging = (setIsDragging: (dragging: boolean) => void) => {
  setIsDragging(false);
};
