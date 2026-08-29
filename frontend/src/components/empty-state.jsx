import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function EmptyState({ icon: Icon, eyebrow, title, description, action, className }) {
  return (
    <Card className={cn('items-center gap-3 border-dashed bg-transparent px-8 py-16 text-center shadow-none ring-0', className)}>
      {Icon && (
        <div className="mb-1 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </div>
      )}
      {eyebrow && <p className="eyebrow text-muted-foreground">{eyebrow}</p>}
      <h3 className="font-heading text-xl font-semibold">{title}</h3>
      {description && <p className="mx-auto max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-3 flex flex-wrap justify-center gap-2">{action}</div>}
    </Card>
  );
}
