import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/use-auth';
import { getPost } from '@/lib/api';
import { timeAgo } from '@/lib/postDisplay';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/status-badge';
import { CategoryChip } from '@/components/category-chip';
import { ContactForm } from '@/components/contact-form';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { initialsFor } from '@/lib/postDisplay';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isGuest } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getPost(id)
      .then((data) => active && setPost(data))
      .catch((err) => active && setError(err.message || 'Failed to load post'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  useGSAP(
    () => {
      if (loading || !post) return;
      gsap.from('[data-detail-anim]', { opacity: 0, y: 16, duration: 0.5, stagger: 0.06, ease: 'power2.out' });
    },
    { dependencies: [loading, post], scope: containerRef },
  );

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-muted-foreground">
        Loading post…
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-muted-foreground">
        <p>{error || 'Post not found'}</p>
        <Button onClick={() => navigate('/posts')}>Back to all posts</Button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate('/posts')}>
        <ArrowLeft />
        All posts
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <Card data-detail-anim className="gap-5 p-6 sm:p-8">
          <StatusBadge status={post.status} className="w-fit" />
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>

          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="max-h-[420px] w-full rounded-xl object-cover"
            />
          )}

          {post.description && <p className="max-w-2xl leading-relaxed text-muted-foreground">{post.description}</p>}

          <Separator />

          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <dt className="eyebrow mb-2 text-muted-foreground">Category</dt>
              <dd>
                <CategoryChip category={post.category} />
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-2 text-muted-foreground">Building</dt>
              <dd className="text-sm font-medium">{post.location}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-2 text-muted-foreground">Posted</dt>
              <dd className="text-sm font-medium">
                {timeAgo(post.createdAt)} by {post.userId?.name || 'Unknown'}
              </dd>
            </div>
          </dl>
        </Card>

        <div data-detail-anim className="grid gap-4">
          <Card className="gap-4 p-6">
            {!isAuthenticated ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Lock className="size-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold">Log in to contact the poster</h3>
                <p className="text-sm text-muted-foreground">
                  Create a free @uwaterloo.ca account, or log in, to message whoever posted this.
                </p>
                <Button className="mt-1 w-full" onClick={() => navigate('/login', { state: { from: { pathname: `/posts/${id}` } } })}>
                  Log in
                </Button>
              </div>
            ) : isGuest ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Lock className="size-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold">Message the poster</h3>
                <p className="text-sm text-muted-foreground">
                  Guest accounts can't send messages. Create a free account to contact the poster.
                </p>
                <Button className="mt-1 w-full" onClick={() => navigate('/signup')}>
                  Create an account
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary/15 text-primary">
                      {initialsFor(post.userId?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-heading text-base font-semibold">Message the poster</h3>
                    <p className="text-xs text-muted-foreground">
                      Describe one detail only the owner would know.
                    </p>
                  </div>
                </div>
                <ContactForm post={post} />
              </>
            )}
          </Card>

          <Card className="gap-3 p-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-4" />
              <p className="eyebrow">Meeting safely</p>
            </div>
            <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground">
              <li>Meet in a staffed building during open hours.</li>
              <li>Never send a deposit or a code to claim an item.</li>
              <li>High-value finds can be handed to Special Constable Service.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
