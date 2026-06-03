"use client";

import Link from "next/link";

import {
  Show, SignInButton, UserAvatar
} from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold"
        >
          Study Planner
        </Link>

        <div className="flex items-center gap-3">
          <Show when="signed-in">
            <UserAvatar />
          </Show>
          <Show when="signed-out">
            <SignInButton />
          </Show>
        </div>
      </div>
    </nav>
  );
}