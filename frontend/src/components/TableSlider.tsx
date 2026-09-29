/*
 * Název souboru:    TableSlider.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení dat v karuselu, který umožňuje
 *                   horizontální posouvání položek v tabulce. Umožňuje nastavit
 *                   počet najednou viditelných tabulek.
 */

import {
  Carousel,
  CarouselPrevious,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselApi,
} from "components/ui/carousel";
import { useEffect, useState } from "react";

type TableSliderProps<T> = {
  tableData: T[];
  itemsPerView: number; // počet položek, které mají být vidět najednou
  onScrollPrev?: (index: number) => void;
  onScrollNext?: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  scrollOnDataChange?: boolean;
};

const TableSlider = <T,>({
  tableData,
  itemsPerView,
  onScrollPrev,
  onScrollNext,
  renderItem,
  scrollOnDataChange = false,
}: TableSliderProps<T>) => {
  const [api, setApi] = useState<CarouselApi>();

  const basis =
    tableData.length >= itemsPerView
      ? `${100 / itemsPerView}%`
      : `${100 / tableData.length}%`;

  useEffect(() => {
    if (scrollOnDataChange) {
      api?.scrollTo(0);
    }
  }, [tableData]);
  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "start" }}
      className="flex items-center"
    >
      {tableData.length > itemsPerView && (
        <CarouselPrevious
          className="static"
          onClick={() => {
            api?.scrollPrev();
            onScrollPrev?.(api?.selectedScrollSnap() ?? 0);
          }}
        />
      )}
      <CarouselContent className="mx-2 max-w-max">
        {tableData.map((item, index) => (
          <CarouselItem
            key={index}
            className="px-1.5"
            style={{ flexBasis: basis }}
          >
            {renderItem(item, index)}
          </CarouselItem>
        ))}
      </CarouselContent>
      {tableData.length > itemsPerView && (
        <CarouselNext
          className="static"
          onClick={() => {
            api?.scrollNext();
            onScrollNext?.(api?.selectedScrollSnap() ?? 0);
          }}
        />
      )}
    </Carousel>
  );
};

export default TableSlider;
