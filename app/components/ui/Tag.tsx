import Link from 'next/link';

interface TagProps {
  name: string;
}

export function Tag({ name }: TagProps) {
  return (
    <Link
      href={`/feed?tag=${name}`}
      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
    >
      #{name}
    </Link>
  );
}
