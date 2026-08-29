import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { useAuth } from '@/hooks/use-auth';
import { signup as signupRequest } from '@/lib/api';
import { signupSchema } from '@/lib/validation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const cardRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(cardRef.current, { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' });
    },
    { scope: cardRef },
  );

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const data = await signupRequest(values.name, values.email, values.password);
      login(data.token);
      toast.success('Account created!');
      navigate('/posts');
    } catch (err) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-16 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div>
        <p className="eyebrow text-muted-foreground">Get started</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Sign up to claim or post
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Browsing is open to everyone. An account is only needed to post an item or message a poster, so people
          can be reached back.
        </p>
      </div>

      <Card ref={cardRef} className="mx-auto w-full max-w-md border-t-4 border-t-primary p-2">
        <CardHeader>
          <h2 className="font-heading text-lg font-semibold">Create account</h2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@uwaterloo.ca" {...field} />
                    </FormControl>
                    <FormDescription>Must end in @uwaterloo.ca</FormDescription>
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
                    <FormDescription>At least 8 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={submitting} className="mt-1 w-full">
                {submitting && <Loader2 className="animate-spin" />}
                {submitting ? 'Creating account…' : 'Create account'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
