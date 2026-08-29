import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { initialsFor } from '@/lib/postDisplay';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ModeToggle } from '@/components/layout/mode-toggle';
import { Menu, PlusCircle } from 'lucide-react';

function navLinkClass({ isActive }) {
  return cn(
    'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
  );
}

export function Navbar() {
  const { isAuthenticated, isGuest, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const links = [
    { to: '/posts', label: 'Browse' },
    ...(isAuthenticated ? [{ to: '/dashboard', label: 'My posts' }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="mr-2 flex items-baseline gap-2">
          <span className="font-heading text-lg font-semibold tracking-tight">Lost&nbsp;&amp;&nbsp;Found</span>
          <span className="eyebrow hidden text-muted-foreground sm:inline">Campus</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ModeToggle />
          {isAuthenticated ? (
            <>
              {!isGuest && (
                <Button size="sm" onClick={() => navigate('/create-post')}>
                  <PlusCircle />
                  Post an item
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 flex items-center gap-2 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar size="sm">
                      <AvatarFallback className="bg-primary/15 text-primary">
                        {initialsFor(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="flex items-center gap-2 font-normal">
                    <span className="truncate">{user?.name || 'Account'}</span>
                    {isGuest && (
                      <Badge variant="outline" className="eyebrow shrink-0">
                        Guest
                      </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>My posts</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Sign up
              </Button>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ModeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Lost &amp; Found</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {links.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <NavLink to={link.to} className={navLinkClass}>
                      {link.label}
                    </NavLink>
                  </SheetClose>
                ))}
                {isAuthenticated && !isGuest && (
                  <SheetClose asChild>
                    <NavLink to="/create-post" className={navLinkClass}>
                      Post an item
                    </NavLink>
                  </SheetClose>
                )}
              </div>
              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 px-1 text-sm">
                      <Avatar size="sm">
                        <AvatarFallback className="bg-primary/15 text-primary">
                          {initialsFor(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate font-medium">{user?.name}</span>
                      {isGuest && (
                        <Badge variant="outline" className="eyebrow">
                          Guest
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button variant="outline" onClick={() => navigate('/login')}>
                        Log in
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button onClick={() => navigate('/signup')}>Sign up</Button>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
