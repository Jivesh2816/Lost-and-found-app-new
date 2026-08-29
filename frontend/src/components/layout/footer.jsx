import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <p>
          <span className="font-heading font-semibold text-foreground">Lost &amp; Found</span>, built for the
          University of Waterloo campus.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/posts" className="hover:text-foreground">
            Browse
          </Link>
          <Link to="/create-post" className="hover:text-foreground">
            Report an item
          </Link>
        </div>
      </div>
    </footer>
  );
}
