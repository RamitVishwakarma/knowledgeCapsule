import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-border bg-card border-t px-6 py-10">
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center gap-4 text-sm">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.svg"
            alt="Knowledge Capsule"
            width={20}
            height={20}
            className="h-5 w-auto"
          />
          Knowledge Capsule
        </div>
        <p>Your personal knowledge time capsule.</p>
      </div>
    </footer>
  );
}
