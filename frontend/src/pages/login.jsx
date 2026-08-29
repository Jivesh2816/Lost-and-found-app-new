import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { login as loginRequest, guestLogin } from '@/lib/api';
import { loginSchema } from '@/lib/validation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const cardRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(cardRef.current, { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' });
    },
    { scope: cardRef },
  );

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const redirectTo = location.state?.from?.pathname || '/posts';

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const data = await loginRequest(values.email, values.password);
      login(data.token);
      toast.success('Welcome back!');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = async () => {
    setGuestLoading(true);
    try {
      const data = await guestLogin();
      login(data.token);
      toast.success('Browsing as a guest');
      navigate('/posts');
    } catch (err) {
      toast.error(err.message || 'Could not start a guest session');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-16 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div>
        <p className="eyebrow text-muted-foreground">Welcome back</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Sign in to Lost &amp; Found
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Manage your posts, message other students, and keep track of what's still open on campus.
        </p>
      </div>

      <Card ref={cardRef} className="mx-auto w-full max-w-md border-t-4 border-t-primary p-2">
        <CardHeader>
          <h2 className="font-heading text-lg font-semibold">Log in</h2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@uwaterloo.ca" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={submitting} className="mt-1 w-full">
                {submitting && <Loader2 className="animate-spin" />}
                {submitting ? 'Signing in…' : 'Sign in'}
              </Button>

              <div className="flex items-center gap-3 py-1">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">or</span>
                <Separator className="flex-1" />
              </div>

              <Button type="button" variant="outline" disabled={guestLoading} onClick={handleGuest} className="w-full">
                {guestLoading && <Loader2 className="animate-spin" />}
                {guestLoading ? 'Starting guest session…' : 'Continue as guest'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                No account yet?{' '}
                <Link to="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
                  Create one
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
