/*
 * Název souboru:    PageTitle.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta pro zobrazení titulku stránky.
 */

type PageTitleProps = {
  text: string;
};
const PageTitle = ({ text }: PageTitleProps) => {
  return (
    <h1 className="p-4 text-center text-2xl font-semibold uppercase">{text}</h1>
  );
};
export default PageTitle;
