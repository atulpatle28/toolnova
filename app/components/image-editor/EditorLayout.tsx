import { ReactNode } from "react";

type EditorLayoutProps = {
  canvas: ReactNode;
  sidebar: ReactNode;
};

export default function EditorLayout({
  canvas,
  sidebar,
}: EditorLayoutProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {canvas}
      </div>

      <div>
        {sidebar}
      </div>
    </div>
  );
}