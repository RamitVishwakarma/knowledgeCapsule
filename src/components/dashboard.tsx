"use client";

import { useAppStore } from "@/store/appStore";
import { Sidebar } from "@/components/sidebar";
import { DocumentList } from "@/components/document-list";
import { DocumentDetail } from "@/components/document-detail";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Topic } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  initialTopics: Topic[];
  initialArchivedCount: number;
}

export function Dashboard({ initialTopics, initialArchivedCount }: DashboardProps) {
  const selectedDocId = useAppStore((s) => s.selectedDocId);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
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
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar
        topics={topics}
        archivedCount={archivedCount}
        onTopicsChange={setTopics}
        onRefresh={refreshData}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <div className="border-border bg-card flex items-center gap-3 border-b px-4 py-3 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="size-9">
            <Menu className="text-foreground h-5 w-5" />
          </Button>
          <span className="text-foreground text-sm">Knowledge Capsule</span>
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
