import { useLoading } from '../contexts/LoadingContext';

export default function GlobalLoading() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white px-6 py-4 rounded shadow">
        Carregando...
      </div>
    </div>
  );
}
