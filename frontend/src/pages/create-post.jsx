import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/use-auth';
import { createPost } from '@/lib/api';
import { createPostSchema } from '@/lib/validation';
import { BUILDINGS, CATEGORIES } from '@/lib/postDisplay';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImagePlus, Loader2, X } from 'lucide-react';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export default function CreatePost() {
  const navigate = useNavigate();
  const { token, isGuest } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoError, setPhotoError] = useState('');

  const form = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      status: 'lost',
      title: '',
      description: '',
      category: '',
      building: '',
      otherLocation: '',
    },
  });

  const building = form.watch('building');

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError('Photo must be under 5MB');
      e.target.value = '';
      return;
    }
    setPhotoError('');
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const location = values.building === 'Somewhere else' ? values.otherLocation : values.building;
      const body = new FormData();
      body.append('title', values.title);
      body.append('description', values.description || '');
      body.append('category', values.category);
      body.append('location', location);
      body.append('status', values.status);
      if (photo) body.append('image', photo);

      await createPost(body, token);
      toast.success('Post published');
      navigate('/posts');
    } catch (err) {
      toast.error(err.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  if (isGuest) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4">
        <Card className="w-full items-center gap-3 px-8 py-14 text-center">
          <h2 className="font-heading text-xl font-semibold">Guest accounts are read-only</h2>
          <p className="text-sm text-muted-foreground">
            You're browsing as a guest. Create a free account to post a lost or found item.
          </p>
          <Button className="mt-2" onClick={() => navigate('/signup')}>
            Create an account
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="eyebrow text-muted-foreground">New post</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">What happened?</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Leave out one identifying detail on purpose. It becomes the question you ask whoever claims the item.
      </p>

      <Card className="mt-8 p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am reporting</FormLabel>
                  <FormControl>
                    <ToggleGroup type="single" variant="outline" value={field.value} onValueChange={(v) => v && field.onChange(v)}>
                      <ToggleGroupItem value="lost" className="px-5">
                        Something I lost
                      </ToggleGroupItem>
                      <ToggleGroupItem value="found" className="px-5">
                        Something I found
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Black Samsung Galaxy S23, clear case" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="When you last had it, what it looks like, anything unusual about it."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="building"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                    >
                      {[...BUILDINGS, 'Somewhere else'].map((b) => (
                        <Label
                          key={b}
                          htmlFor={`building-${b}`}
                          className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-normal has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary/5"
                        >
                          <RadioGroupItem id={`building-${b}`} value={b} />
                          {b}
                        </Label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {building === 'Somewhere else' && (
              <FormField
                control={form.control}
                name="otherLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where, exactly?</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. outside the Tim Hortons on Ring Road" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid gap-2">
              <Label>Photo (optional)</Label>
              {photoPreview ? (
                <div className="flex items-center gap-3">
                  <img src={photoPreview} alt="Preview" className="size-24 rounded-lg object-cover" />
                  <Button type="button" variant="outline" size="sm" onClick={removePhoto}>
                    <X />
                    Remove photo
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed py-6 text-sm text-muted-foreground hover:bg-muted/50">
                  <ImagePlus className="size-4" />
                  Choose a photo
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              )}
              {photoError && <p className="text-sm text-destructive">{photoError}</p>}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="animate-spin" />}
                {submitting ? 'Publishing…' : 'Publish post'}
              </Button>
              <span className="text-xs text-muted-foreground">Visible to anyone with a uwaterloo.ca account.</span>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
