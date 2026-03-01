import { useAuthStore } from "@/features/auth/store";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { Link, useLocation } from "react-router-dom";
import { navigationMenuTriggerStyle } from "@/shared/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/features/auth/hooks/useAuthMutation";

const Header = () => {
  const location = useLocation();
  const logoutMutation = useLogoutMutation();
  const token = useAuthStore((state) => state.accessToken);

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold tracking-tight">
          ShopApp
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-2">
            {/* Home */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    location.pathname === "/" &&
                      "bg-primary/10 text-primary font-bold underline",
                  )}
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {token && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/profile"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/profile" &&
                        "bg-primary/10 text-primary font-bold underline",
                    )}
                  >
                    Profile
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {/* Ritual */}
            {token && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/ritual"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/ritual" &&
                        "bg-primary/10 text-primary font-bold underline",
                    )}
                  >
                    Ritual
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {/* Tags */}
            {token && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/tags"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/tags" &&
                        "bg-primary/10 text-primary font-bold underline",
                    )}
                  >
                    Tags
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {/* Login / Logout */}
            {!token ? (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/login"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/login" &&
                        "bg-primary/10 text-primary font-bold underline",
                    )}
                  >
                    Login
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "cursor-pointer text-destructive",
                  )}
                  onClick={() => logoutMutation.mutate()}
                >
                  Logout
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
