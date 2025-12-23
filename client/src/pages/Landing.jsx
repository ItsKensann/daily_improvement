import React from "react";
import {
  Timer,
  CheckSquare,
  BookOpen,
  Calendar,
  BarChart3,
  ArrowRight,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Landing() {
  // Login logic
  const handleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  // Get theme state and toggle function
  const { theme, toggleTheme } = useTheme();

  // Data arrays
  const stats = [
    { value: "2.5hrs", label: "avg. daily focus", sublabel: "per user" },
    { value: "92%", label: "focus score", sublabel: "improvement" },
    { value: "10k+", label: "students", sublabel: "using daily" },
    { value: "4.9", label: "rating", sublabel: "from users" },
  ];

  const features = [
    {
      icon: Timer,
      title: "Focus Timer",
      description:
        "Immersive full-screen timer for deep work sessions. Block out distractions and track your focused hours.",
    },
    {
      icon: CheckSquare,
      title: "Minimal Tasks",
      description:
        "A clean task list that shows only what matters. Prioritize ruthlessly, complete intentionally.",
    },
    {
      icon: BookOpen,
      title: "Daily Journal",
      description:
        "Reflect on your day with a distraction-free writing space. Track your mood and capture insights.",
    },
    {
      icon: Calendar,
      title: "Calm Calendar",
      description:
        "A month view that reduces visual noise. See your commitments without the overwhelm.",
    },
    {
      icon: BarChart3,
      title: "Progress Insights",
      description:
        "Understand your patterns with simple, meaningful metrics. No vanity numbers, just clarity.",
    },
    {
      icon: ArrowRight,
      title: "Daily Briefing",
      description:
        "Start each day with a clear focus. One priority, curated tips, and gentle reminders.",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Set your focus",
      description:
        "Each morning, choose your singular priority. One task that matters most today.",
    },
    {
      step: "02",
      title: "Enter deep work",
      description:
        "Use the focus timer to work without distraction. Track your hours, build your streak.",
    },
    {
      step: "03",
      title: "Reflect & improve",
      description:
        "Journal your insights, review your progress, and prepare for tomorrow.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="flex items-center justify-between px-8 py-6 lg:px-16">
        <div className="font-serif text-xl text-foreground">Kaizen</div>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="text-muted-foreground transition-colors hover:text-foreground p-2"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={handleLogin}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </button>
          <button
            onClick={handleLogin}
            className="border border-foreground bg-foreground px-4 py-2 text-sm text-background transition-colors hover:bg-transparent hover:text-foreground"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 pb-24 pt-16 lg:px-16 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance font-serif text-4xl leading-tight text-foreground md:text-5xl lg:text-6xl">
            A sanctuary for
            <br />
            <span className="italic">deep, focused work</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-pretty font-serif text-lg leading-relaxed text-muted-foreground">
            Built for students who value clarity over chaos. Manage tasks, track
            focus sessions, and journal your progress — all in one calm,
            distraction-free space.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={handleLogin}
              className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-sm text-background transition-colors hover:bg-transparent hover:text-foreground"
            >
              Start focusing today
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#features"
              className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm text-foreground transition-colors hover:border-foreground"
            >
              Explore features
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/50 bg-secondary px-8 py-16 lg:px-16">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-serif text-3xl text-foreground">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground/70">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-24 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Features
            </p>
            <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl">
              Everything you need, nothing you don't
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-serif text-muted-foreground">
              Designed with intention. Every feature exists to help you achieve
              deeper focus and meaningful progress.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group border border-border/50 p-6 transition-colors hover:border-border"
                >
                  <div className="flex h-10 w-10 items-center justify-center border border-border/50 text-muted-foreground transition-colors group-hover:border-accent group-hover:text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 font-serif text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-border/50 bg-secondary/30 px-8 py-24 lg:px-16"
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl">
              Simple by design
            </h2>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {howItWorks.map((item, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center border border-accent text-sm text-accent">
                  {item.step}
                </div>
                <h3 className="mt-6 font-serif text-lg text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 font-serif text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 bg-secondary/30 px-8 py-24 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">
            Ready to focus?
          </h2>
          <p className="mt-4 font-serif text-muted-foreground">
            Join thousands of students who have found their calm in the chaos.
          </p>
          <button
            onClick={handleLogin}
            className="mt-8 inline-flex items-center gap-2 border border-foreground bg-foreground px-8 py-4 text-sm text-background transition-colors hover:bg-transparent hover:text-foreground"
          >
            Get started for free
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-8 py-12 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="font-serif text-foreground">Kaizen</div>
          <div className="flex gap-8">
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </a>
          </div>
          <div className="text-xs text-muted-foreground">
            © 2025 Kaizen. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
