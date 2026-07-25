type UploadBoxProps = {
  onClick?: () => void;
};

export default function UploadBox({ onClick }: UploadBoxProps) {
  return (
    <div
      onClick={onClick}
      className="
        border-2 border-dashed border-slate-700
        rounded-2xl
        p-10
        text-center
        cursor-pointer
        transition-all
        duration-200
        hover:border-blue-500
        hover:bg-slate-900
      "
    >
      <div className="text-5xl mb-4">📂</div>

      <h2 className="text-xl font-semibold">
        Upload your image
      </h2>

      <p className="text-slate-400 mt-2">
        Click here or drag & drop your image
      </p>

      <p className="text-sm text-slate-500 mt-4">
        PNG, JPG, JPEG, WEBP
      </p>
    </div>
  );
}