"use client";

import Link from "next/link";
import { SignInButton, UserButton, SignOutButton, useAuth } from "@clerk/nextjs";
import { BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Study Planner</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Don't render anything until Clerk has loaded to avoid flicker */}
          {isLoaded && (
            <>
              {isSignedIn ? (
                <div className="flex items-center gap-3.5">
                  {/* Clerk profile picture + account management */}
                  <UserButton afterSignOutUrl="/sign-in" />

                  <SignOutButton redirectUrl="/sign-in">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 px-3 text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-all shadow-sm rounded-md"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign out</span>
                    </Button>
                  </SignOutButton>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <Button size="sm" variant="outline">
                    Sign in
                  </Button>
                </SignInButton>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}