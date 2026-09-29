/*
 * Název souboru:    useChartInteractions.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Hook poskytující funkce pro interaktivitu grafu
 */

import { useEffect, useRef, useState } from "react";
import { drag, startDragging, stopDragging, zoom } from "utils/chartUtils";

type useChartInteractionsProps = {
  chartDataLength: number;
  chartContainerRef: React.MutableRefObject<HTMLDivElement | null>;
};
const useChartInteractions = ({
  chartDataLength,
  chartContainerRef,
}: useChartInteractionsProps) => {
  const [chartStart, setChartStart] = useState(0);
  const [chartEnd, setChartEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastMouseX = useRef<number>(0);

  const handleZoom = (event: WheelEvent) => {
    zoom(
      event,
      chartStart,
      chartEnd,
      chartDataLength,
      setChartStart,
      setChartEnd,
    );
  };

  const handleStartDragging = (event: React.MouseEvent<HTMLDivElement>) => {
    startDragging(event, setIsDragging, lastMouseX);
  };

  const handleDragging = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      drag(
        event.nativeEvent,
        isDragging,
        chartStart,
        chartEnd,
        chartDataLength,
        lastMouseX,
        setChartStart,
        setChartEnd,
      );
    }
  };

  const handleStopDragging = () => {
    stopDragging(setIsDragging);
  };

  useEffect(() => {
    if (chartDataLength > 0) {
      setChartStart(0);
      setChartEnd(chartDataLength);
    }
  }, [chartDataLength]);

  useEffect(() => {
    const chartElement = chartContainerRef.current;
    if (chartElement) {
      const zoomHandler = handleZoom as unknown as EventListener;
      chartElement.addEventListener("wheel", zoomHandler, { passive: false });

      return () => {
        chartElement.removeEventListener("wheel", zoomHandler);
      };
    }
  }, [chartStart, chartEnd]);

  return {
    chartStart,
    chartEnd,
    handleStartDragging,
    handleDragging,
    handleStopDragging,
  };
};

export default useChartInteractions;
