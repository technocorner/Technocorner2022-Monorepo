export default function Loading() {
  return (
    <div className="flex-grow flex items-center justify-center gap-3">
      <span className="material-icons-outlined animate-spin">refresh</span>
      <p>Sedang memproses...</p>
    </div>
  );
}
