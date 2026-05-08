export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="w-full py-8 text-center text-brand-700">
      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
      <p>{text}</p>
    </div>
  );
}
