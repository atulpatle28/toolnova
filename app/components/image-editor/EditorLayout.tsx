import { ReactNode } from "react";

type EditorLayoutProps = {
  left: ReactNode;
  right: ReactNode;
};

export default function EditorLayout({
  left,
  right,
}: EditorLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {left}
      </div>

      <div>
        {right}
      </div>
    </div>
  );
}