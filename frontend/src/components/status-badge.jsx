import { Badge } from '@/components/ui/badge';
import { statusMeta } from '@/lib/postDisplay';
import { cn } from '@/lib/utils';

export function StatusBadge({ status, className }) {
  const meta = statusMeta(status);
  return (
    <Badge variant="outline" className={cn('eyebrow gap-1.5 border py-2.5', meta.badge, className)}>
      <span className={cn('size-1.5 rounded-full', meta.dot)} />
      {meta.label}
    </Badge>
  );
}
