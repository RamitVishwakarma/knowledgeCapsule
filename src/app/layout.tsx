import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Knowledge Capsule",
  description: "Record it. Save it. Revisit it years later.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
