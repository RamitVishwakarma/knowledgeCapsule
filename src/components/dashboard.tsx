"use client";

import { useAppStore } from "@/store/appStore";
import { Sidebar } from "@/components/sidebar";
import { DocumentList } from "@/components/document-list";
import { DocumentDetail } from "@/components/document-detail";
import { Menu } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function Dashboard() {
  const { isAuthenticated, selectedDocId, toggleSidebar } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button onClick={toggleSidebar} className="p-2 hover:bg-accent rounded-lg">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <span className="text-foreground text-[14px]">Knowledge Capsule</span>
        </div>
        {selectedDocId ? <DocumentDetail /> : <DocumentList />}
      </div>
    </div>
  );
}
