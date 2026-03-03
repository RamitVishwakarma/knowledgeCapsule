"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavBarProps {
  onSignIn: () => void;
}

export function NavBar({ onSignIn }: NavBarProps) {
  return (
    <nav className="bg-background/60 border-border/50 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Knowledge Capsule" width={28} height={28} className="h-7 w-auto" />
          <span className="text-foreground">Knowledge Capsule</span>
        </div>
        <div className="text-muted-foreground hidden items-center gap-8 md:flex">
          <Link href="#why" className="hover:text-foreground transition-colors">
            Why
          </Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
        </div>
        <Button
          onClick={onSignIn}
          className="rounded-full px-5 py-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
        >
          Sign in
        </Button>
      </div>
    </nav>
  );
}
