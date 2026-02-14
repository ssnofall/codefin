import Link from 'next/link';

interface TagProps {
  name: string;
}

export function Tag({ name }: TagProps) {
  return (
    <Link
      href={`/feed?tag=${name}`}
      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
    >
      #{name}
    </Link>
  );
}
