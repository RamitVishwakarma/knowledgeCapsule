"use client";

import { useAppStore } from "@/store/appStore";
import { Sidebar } from "@/components/sidebar";
import { DocumentList } from "@/components/document-list";
import { DocumentDetail } from "@/components/document-detail";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Topic } from "@/lib/types";

interface DashboardProps {
  initialTopics: Topic[];
  initialArchivedCount: number;
}

export function Dashboard({ initialTopics, initialArchivedCount }: DashboardProps) {
  const { selectedDocId, toggleSidebar } = useAppStore();
  const [topics, setTopics] = useState(initialTopics);
  const [archivedCount, setArchivedCount] = useState(initialArchivedCount);
  const router = useRouter();

  // Sync with server when page is refreshed via router.refresh()
  useEffect(() => {
    setTopics(initialTopics);
  }, [initialTopics]);

  useEffect(() => {
    setArchivedCount(initialArchivedCount);
  }, [initialArchivedCount]);

  const refreshData = () => router.refresh();

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <Sidebar
        topics={topics}
        archivedCount={archivedCount}
        onTopicsChange={setTopics}
        onArchivedCountChange={setArchivedCount}
        onRefresh={refreshData}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button onClick={toggleSidebar} className="p-2 hover:bg-accent rounded-lg">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <span className="text-foreground text-[14px]">Knowledge Capsule</span>
        </div>
        {selectedDocId ? (
          <DocumentDetail onRefresh={refreshData} />
        ) : (
          <DocumentList onRefresh={refreshData} />
        )}
      </div>
    </div>
  );
}
