import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

export default function HomePage() {
  const token = useAuthStore((state) => state.accessToken);

  const features = [
    {
      icon: Sparkles,
      title: "Rituals",
      description: "Create and manage your daily rituals with ease",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience blazing fast performance",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Your data is always protected and private",
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto">
          {/* Gradient Blob Background */}
          <div className="absolute inset-0 -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-block">
              <div className="px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
                <p className="text-sm font-medium text-primary">
                  ✨ Welcome to ShopApp
                </p>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent">
                  Create Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
                  Perfect Rituals
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Build meaningful habits and transform your daily routine. Track,
                manage, and celebrate your wins.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {token ? (
                <Link to="/ritual">
                  <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    View Rituals <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              Why ShopApp?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build habits that stick
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={i}
                  className="group relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300"
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${feature.gradient} transition-opacity duration-300`}
                  />

                  <div className="relative p-8 space-y-4">
                    <div
                      className={`inline-block p-3 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10`}
                    >
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <Card className="overflow-hidden border border-border/50 bg-gradient-to-br from-card via-card to-card/50">
            <div className="relative p-12 text-center space-y-6">
              <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-lg" />
              <div className="relative z-10 space-y-4">
                <h3 className="text-3xl sm:text-4xl font-black">
                  Ready to start?
                </h3>
                <p className="text-muted-foreground text-lg">
                  Join thousands building better habits today
                </p>
                {!token && (
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Create Your Account
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
