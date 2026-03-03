import { useUser } from "@/features/users/hooks/useUser";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { User, Mail, Loader2, Shield, RefreshCw } from "lucide-react";

export default function ProfilePage() {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useUser();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ErrorState
          message={(error as any)?.message || "Failed to load profile"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Empty state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <EmptyState
          title="No Profile Data"
          description="Unable to find your profile information."
        />
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/50">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Your Profile
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your account information
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile Card */}
          <Card className="p-8 sm:p-10 space-y-8 border border-border/50 bg-card/50 backdrop-blur">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black">
                    {user.fullName || "User"}
                  </h2>
                  <p className="text-muted-foreground text-sm">Active member</p>
                </div>
              </div>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
                />
                {isFetching ? "Refreshing..." : "Refresh"}
              </Button>
            </div>

            {/* Info Section */}
            <div className="border-t border-border/50 pt-8 space-y-6">
              <div>
                <Label className="text-base font-semibold">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </Label>
                <Input
                  value={user.fullName || "-"}
                  disabled
                  className="mt-2 text-base h-11 bg-muted/30 border-border/30"
                />
              </div>

              <div>
                <Label className="text-base font-semibold">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </Label>
                <Input
                  value={user.email || "-"}
                  disabled
                  className="mt-2 text-base h-11 bg-muted/30 border-border/30"
                />
              </div>
            </div>
          </Card>

          {/* Security Card */}
          <Card className="p-8 sm:p-10 space-y-6 border border-border/50 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl font-bold">Security</h3>
            </div>

            <Button variant="outline" className="w-full justify-start h-11">
              <Shield className="w-4 h-4 mr-2" />
              Change Password
            </Button>

            <Button variant="outline" className="w-full justify-start h-11">
              <Shield className="w-4 h-4 mr-2" />
              Two-Factor Authentication
            </Button>
          </Card>

          {/* Welcome */}
          <Card className="p-8 border border-border/50 bg-gradient-to-br from-card via-card to-card/50">
            <p className="text-muted-foreground">
              Welcome back to ShopApp! We're glad to have you here.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
