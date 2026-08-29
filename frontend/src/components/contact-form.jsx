import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/use-auth';
import { sendContact } from '@/lib/api';
import { contactSchema } from '@/lib/validation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, MailCheck } from 'lucide-react';

export function ContactForm({ post }) {
  const { token, user } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '', message: '' },
  });

  const onSubmit = async (values) => {
    setSending(true);
    try {
      await sendContact({ postId: post._id, ...values }, token);
      setSent(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send your note');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <MailCheck className="size-5" />
        </div>
        <h3 className="font-heading text-lg font-semibold">Your note is on its way</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {post.userId?.name || 'The poster'} gets an email with your name and reply address. If it's a match,
          arrange the handoff somewhere public on campus.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your name</FormLabel>
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
              <FormLabel>Reply email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="It has a sticker on the back and a small crack near the corner."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={sending} className="w-full">
          {sending && <Loader2 className="animate-spin" />}
          {sending ? 'Sending…' : 'Send note'}
        </Button>
      </form>
    </Form>
  );
}
