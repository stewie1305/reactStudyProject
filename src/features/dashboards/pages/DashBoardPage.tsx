import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { TrendingUp, Users, Calendar, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Users",
      value: "1,234",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Active Rituals",
      value: "567",
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Completion Rate",
      value: "89%",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Total Sessions",
      value: "12.5K",
      icon: Zap,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/50">
      {/* Header Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Gradient Blobs */}
          <div className="absolute inset-0 -top-20 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={i}
                  className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur group hover:border-primary/50 transition-all duration-300"
                >
                  <div className="relative p-6">
                    {/* Background Gradient */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${stat.color} transition-opacity duration-300`}
                    />

                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}
                        >
                          <Icon className="w-6 h-6 text-foreground" />
                        </div>
                      </div>
                      <div>
                        <p className="text-3xl font-black">{stat.value}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur">
              <div className="relative p-6 space-y-4">
                <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-purple-500 to-pink-500" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Manage Rituals</h3>
                  <p className="text-muted-foreground mb-4">
                    Create, edit, and organize your rituals
                  </p>
                  <Link to="/ritual">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      View Rituals
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur">
              <div className="relative p-6 space-y-4">
                <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-blue-500 to-cyan-500" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">User Profile</h3>
                  <p className="text-muted-foreground mb-4">
                    Update your personal information
                  </p>
                  <Link to="/profile">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                      View Profile
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur">
              <div className="relative p-6 space-y-4">
                <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-green-500 to-emerald-500" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Tags Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Organize content with tags
                  </p>
                  <Link to="/tags">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      Manage Tags
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
