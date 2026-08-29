import { Badge } from '@/components/ui/badge';
import { categoryClass } from '@/lib/postDisplay';
import { cn } from '@/lib/utils';

export function CategoryChip({ category, className }) {
  return (
    <Badge variant="outline" className={cn('border font-normal', categoryClass(category), className)}>
      {category}
    </Badge>
  );
}
