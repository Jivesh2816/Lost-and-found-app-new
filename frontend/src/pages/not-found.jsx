import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompassIcon } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4">
      <Card className="w-full items-center gap-3 px-8 py-14 text-center">
        <div className="mb-1 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <CompassIcon className="size-5" />
        </div>
        <p className="eyebrow text-muted-foreground">404</p>
        <h1 className="font-heading text-2xl font-semibold">This page wandered off</h1>
        <p className="text-sm text-muted-foreground">
          Maybe someone will post it to the lost &amp; found. In the meantime, here's the way back.
        </p>
        <Button className="mt-3" onClick={() => navigate('/posts')}>
          Back to Browse
        </Button>
      </Card>
    </div>
  );
}
