import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/use-auth';
import { listPosts } from '@/lib/api';
import { CATEGORIES } from '@/lib/postDisplay';

import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/post-card';
import { EmptyState } from '@/components/empty-state';
import { PaginationControls } from '@/components/pagination-controls';
import { VantaBackground } from '@/components/vanta-background';
import { PackageSearch, Plus, Search } from 'lucide-react';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
];

export default function AllPosts() {
  const navigate = useNavigate();
  const { isAuthenticated, isGuest } = useAuth();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalPosts: 0 });
  const [loading, setLoading] = useState(true);

  const gridRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listPosts({ title: debouncedSearch, category, status, page })
      .then((data) => {
        if (!active) return;
        setPosts(data.posts || []);
        setPagination({ page: data.page || 1, totalPages: data.totalPages || 1, totalPosts: data.totalPosts || 0 });
      })
      .catch((err) => active && toast.error(err.message || 'Failed to load posts'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [debouncedSearch, category, status, page]);

  useGSAP(
    () => {
      if (loading || posts.length === 0) return;
      gsap.from('[data-post-card]', {
        opacity: 0,
        y: 16,
        duration: 0.4,
        stagger: 0.04,
        ease: 'power2.out',
      });
    },
    { dependencies: [posts, loading], scope: gridRef },
  );

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setStatus('');
    setPage(1);
  };

  return (
    <div>
      <VantaBackground effect="fog" className="border-b">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-14 sm:px-6">
          <div>
            <p className="eyebrow text-primary">Open posts on campus</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Browse
            </h1>
          </div>
          <div className="flex gap-2">
            {isAuthenticated && (
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                My posts
              </Button>
            )}
            {isAuthenticated && !isGuest && (
              <Button onClick={() => navigate('/create-post')}>
                <Plus />
                Post an item
              </Button>
            )}
          </div>
        </div>
      </VantaBackground>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-4 rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, description, or building"
              className="h-10 pl-9"
            />
          </div>
          <ToggleGroup
            type="single"
            variant="outline"
            value={status}
            onValueChange={(v) => {
              setStatus(v ?? '');
              setPage(1);
            }}
          >
            {STATUS_TABS.map((tab) => (
              <ToggleGroupItem key={tab.value} value={tab.value} className="px-4">
                {tab.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={category}
          onValueChange={(v) => {
            setCategory(v ?? '');
            setPage(1);
          }}
          className="flex-wrap justify-start gap-1.5"
        >
          <ToggleGroupItem value="" className="rounded-full px-3">
            All
          </ToggleGroupItem>
          {CATEGORIES.map((c) => (
            <ToggleGroupItem key={c} value={c} className="rounded-full px-3">
              {c}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex items-baseline justify-between pt-6 pb-4 text-sm text-muted-foreground">
        <p>{loading ? 'Loading…' : `${pagination.totalPosts} open post${pagination.totalPosts === 1 ? '' : 's'}`}</p>
        <p className="eyebrow">Newest first</p>
      </div>

      <div ref={gridRef}>
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post._id} data-post-card>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={PackageSearch}
            eyebrow="Nothing matches yet"
            title="No posts for that search"
            description="Items get posted all week. Clear the filters to see everything, or post your own so whoever finds it knows where to look."
            action={
              <>
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
                {isAuthenticated && !isGuest && <Button onClick={() => navigate('/create-post')}>Post an item</Button>}
              </>
            }
          />
        )}
      </div>

      <PaginationControls page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
