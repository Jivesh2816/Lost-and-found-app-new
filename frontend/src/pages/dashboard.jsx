import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/use-auth';
import { getUserPosts, deletePost as deletePostRequest } from '@/lib/api';
import { timeAgo } from '@/lib/postDisplay';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/status-badge';
import { EmptyState } from '@/components/empty-state';
import { EditPostDialog } from '@/components/edit-post-dialog';
import { DeletePostAlertDialog } from '@/components/delete-post-alert-dialog';
import { Inbox, MoreVertical, Plus } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { token, isGuest } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);
  const listRef = useRef(null);

  const fetchPosts = () => {
    setLoading(true);
    getUserPosts({}, token)
      .then((data) => setPosts(data.posts || data || []))
      .catch((err) => setError(err.message || 'Failed to load your posts'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      if (loading || posts.length === 0) return;
      gsap.from('[data-my-post]', { opacity: 0, y: 12, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
    },
    { dependencies: [posts, loading], scope: listRef },
  );

  const handleSave = (updated) => {
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    setEditingPost(null);
  };

  const handleDelete = async () => {
    const post = deletingPost;
    setDeletingPost(null);
    try {
      await deletePostRequest(post._id, token);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
      toast.success('Post deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete post');
    }
  };

  if (error) {
    return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-muted-foreground">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-8">
        <div>
          <p className="eyebrow text-muted-foreground">Your account</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Your posts</h1>
        </div>
        {!isGuest && (
          <Button onClick={() => navigate('/create-post')}>
            <Plus />
            Post an item
          </Button>
        )}
      </div>

      {isGuest && (
        <p className="-mt-6 mb-6 text-sm text-muted-foreground">
          You're browsing as a guest. Sign up to post your own items.
        </p>
      )}

      <div ref={listRef}>
        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="You haven't posted anything yet"
            description="When you report a lost or found item, it'll show up here so you can edit or close it out."
            action={
              !isGuest && (
                <Button onClick={() => navigate('/create-post')}>
                  <Plus />
                  Post an item
                </Button>
              )
            }
          />
        ) : (
          <Card className="gap-0 divide-y overflow-hidden p-0 py-0">
            {posts.map((post) => (
              <div key={post._id} data-my-post className="flex items-center gap-4 p-5">
                {post.image && (
                  <img src={post.image} alt={post.title} className="size-14 shrink-0 rounded-lg object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <StatusBadge status={post.status} />
                    <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</span>
                  </div>
                  <h3 className="truncate font-heading text-base font-semibold">{post.title}</h3>
                  <p className="truncate text-sm text-muted-foreground">
                    {post.category} · {post.location}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Post actions">
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingPost(post)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => setDeletingPost(post)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </Card>
        )}
      </div>

      <EditPostDialog post={editingPost} onClose={() => setEditingPost(null)} onSave={handleSave} />
      <DeletePostAlertDialog post={deletingPost} onCancel={() => setDeletingPost(null)} onConfirm={handleDelete} />
    </div>
  );
}
