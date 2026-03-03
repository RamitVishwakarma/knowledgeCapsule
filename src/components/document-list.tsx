"use client";

import { useAppStore } from "@/store/appStore";
import { ActiveList } from "@/components/active-list";
import { ArchivedList } from "@/components/archived-list";

interface DocumentListProps {
  onRefresh: () => void;
}

export function DocumentList({ onRefresh }: DocumentListProps) {
  const selectedTopicId = useAppStore((s) => s.selectedTopicId);
  const viewMode = useAppStore((s) => s.viewMode);
  const selectDocument = useAppStore((s) => s.selectDocument);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  if (viewMode === "archived") {
    return <ArchivedList onRefresh={onRefresh} />;
  }

  return (
    <ActiveList
      selectedTopicId={selectedTopicId}
      onRefresh={onRefresh}
      onSelectDocument={selectDocument}
      onOpenSidebar={() => setSidebarOpen(true)}
    />
  );
}
