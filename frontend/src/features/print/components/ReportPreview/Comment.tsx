/*
 * Název souboru:    Comment.tsx
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Komponenta zobrazující komentář pro exportovanou zprávu
 */

import { ReportData } from "../../types/types";

type CommentProps = {
  reportData: ReportData;
};
const Comment = ({ reportData }: CommentProps) => {
  return (
    <div>
      <pre className="h-full whitespace-pre-wrap text-sm">
        {reportData.comment}
      </pre>
    </div>
  );
};

export default Comment;
