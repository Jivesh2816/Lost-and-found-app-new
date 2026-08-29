import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import { useAuth } from '@/hooks/use-auth';
import { VantaBackground } from '@/components/vanta-background';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, MapPinned, MessagesSquare, Search } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    icon: MapPinned,
    title: 'Report it',
    description:
      'Lost your keys outside DC, or found a water bottle in the SLC? Post it with a photo in under a minute.',
  },
  {
    icon: Search,
    title: 'Search campus-wide',
    description:
      'Browse everything posted across buildings. Filter by category, status, and building to find a match fast.',
  },
  {
    icon: MessagesSquare,
    title: 'Reconnect safely',
    description:
      'Message the poster directly, verify one identifying detail, and meet up somewhere public on campus.',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);
  const stepsRef = useRef(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = reduceMotion ? 0 : 0.7;

      gsap.from('[data-hero-anim]', {
        opacity: 0,
        y: 24,
        duration,
        stagger: reduceMotion ? 0 : 0.1,
        ease: 'power2.out',
      });

      if (!reduceMotion) {
        gsap.utils.toArray('[data-step-card]').forEach((el, i) => {
          gsap.from(el, {
            opacity: 0,
            y: 28,
            duration: 0.6,
            delay: i * 0.05,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          });
        });
      }
    },
    { scope: heroRef },
  );

  return (
    <div ref={heroRef}>
      <VantaBackground className="flex min-h-[calc(100vh-4rem)] items-center">
        <div className="mx-auto w-full max-w-4xl px-4 py-24 text-center sm:px-6">
          <p data-hero-anim className="eyebrow text-primary">
            University of Waterloo · Campus community
          </p>
          <h1
            data-hero-anim
            className="mt-5 text-balance font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-6xl"
          >
            Someone probably <span className="text-primary">picked it up</span>.
          </h1>
          <p data-hero-anim className="mx-auto mt-5 max-w-xl text-balance text-lg text-muted-foreground">
            The lost &amp; found for Waterloo students. Report what you lost, list what you found, and message
            each other directly. No front desk required.
          </p>
          <div data-hero-anim className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={() => navigate('/posts')}>
              Browse lost &amp; found
              <ArrowRight />
            </Button>
            {!isAuthenticated && (
              <Button size="lg" variant="outline" onClick={() => navigate('/signup')}>
                Create an account
              </Button>
            )}
          </div>
        </div>
      </VantaBackground>

      <section ref={stepsRef} className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-muted-foreground">How it works</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Three steps back to its owner
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <Card key={step.title} data-step-card className="gap-3 p-6">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                <step.icon className="size-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-20 text-center sm:px-6">
          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to find what's missing?
          </h2>
          <p className="max-w-md text-muted-foreground">
            It only takes a minute to post, and every post stays visible to the whole campus until it's resolved.
          </p>
          <Button size="lg" onClick={() => navigate(isAuthenticated ? '/create-post' : '/signup')}>
            {isAuthenticated ? 'Post an item' : 'Get started'}
            <ArrowRight />
          </Button>
        </div>
      </section>
    </div>
  );
}
