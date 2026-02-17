import Link from 'next/link';
import { Badge } from './Badge';

interface TagProps {
  name: string;
}

export function Tag({ name }: TagProps) {
  return (
    <Link href={`/feed?tag=${name}`}>
      <Badge variant="accent" size="sm">
        #{name}
      </Badge>
    </Link>
  );
}
