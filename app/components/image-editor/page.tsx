import { CropTool } from "@/app/components/tools/CropTool";

export default function Page() {
  return (
    <main className="min-h-screen p-6 bg-slate-950 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <CropTool imageSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60" />
      </div>
    </main>
  );
}