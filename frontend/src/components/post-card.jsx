import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { CategoryChip } from '@/components/category-chip';
import { timeAgo, truncate } from '@/lib/postDisplay';
import { ArrowUpRight, MapPin } from 'lucide-react';

export function PostCard({ post }) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/posts/${post._id}`)}
      className="post-card group/post-card cursor-pointer gap-0 overflow-hidden p-0 py-0 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/30"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="size-full object-cover transition-transform duration-500 group-hover/post-card:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-muted/50 font-heading text-3xl text-muted-foreground/40">
            {post.category?.[0] || '?'}
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-background/85 p-0.5 backdrop-blur-sm">
          <StatusBadge status={post.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg leading-tight font-semibold">{post.title}</h3>
          <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover/post-card:translate-x-0.5 group-hover/post-card:-translate-y-0.5" />
        </div>

        {post.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{truncate(post.description)}</p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <CategoryChip category={post.category} />
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {post.location}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span className="min-w-0 truncate">Posted by {post.userId?.name || 'Unknown'}</span>
          <span className="shrink-0">{timeAgo(post.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
}
