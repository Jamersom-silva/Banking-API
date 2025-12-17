interface Props {
  message: string;
  type?: 'success' | 'error';
}

export default function Toast({ message, type = 'success' }: Props) {
  const base =
    'fixed top-6 right-6 px-4 py-3 rounded shadow text-white z-50';

  const color =
    type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return <div className={`${base} ${color}`}>{message}</div>;
}
