"use client";

import { useAppStore } from "@/store/appStore";
import { Plus, Settings, FolderOpen, X, Archive } from "lucide-react";
import { useState, useTransition } from "react";
import { createTopic, getTopics } from "@/app/actions/topics";
import type { Topic } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SettingsPanel } from "@/components/settings-panel";
import { handleActionResult } from "@/lib/utils/action-result";

interface SidebarProps {
  topics: Topic[];
  archivedCount: number;
  onTopicsChange: (topics: Topic[]) => void;
  onRefresh: () => void;
}

export function Sidebar({ topics, archivedCount, onTopicsChange, onRefresh }: SidebarProps) {
  const selectedTopicId = useAppStore((s) => s.selectedTopicId);
  const viewMode = useAppStore((s) => s.viewMode);
  const selectTopic = useAppStore((s) => s.selectTopic);
  const selectDocument = useAppStore((s) => s.selectDocument);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddTopic = () => {
    if (!newName.trim()) return;
    startTransition(async () => {
      const result = await createTopic(newName.trim());
      handleActionResult(result, async () => {
        const fresh = await getTopics();
        if (fresh.status && fresh.data) {
          onTopicsChange(fresh.data);
        }
        setNewName("");
        setShowAdd(false);
      });
    });
  };

  const handleSelectTopic = (id: string) => {
    setViewMode("active");
    selectTopic(id);
    setSidebarOpen(false);
  };

  const handleSelectArchive = () => {
    setViewMode("archived");
    selectTopic(null);
    selectDocument(null);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`bg-sidebar text-sidebar-foreground border-sidebar-border fixed z-50 flex h-full w-64 flex-col border-r transition-transform duration-300 ease-out md:relative md:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="border-sidebar-border flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Knowledge Capsule"
              width={28}
              height={28}
              className="h-7 w-auto"
            />
            <span className="text-sidebar-foreground">Knowledge Capsule</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground size-7 hover:bg-transparent md:hidden"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Topics */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="mb-3 flex items-center justify-between px-2">
            <span className="text-sidebar-foreground/40 text-[10px] tracking-wider uppercase">
              Topics
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAdd(true)}
              className="text-sidebar-primary hover:text-sidebar-primary/80 size-7 hover:bg-transparent"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          {showAdd && (
            <div className="mb-3 px-1">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTopic();
                  if (e.key === "Escape") {
                    setShowAdd(false);
                    setNewName("");
                  }
                }}
                placeholder="Topic name..."
                className="bg-sidebar-accent text-sidebar-foreground placeholder:text-sidebar-foreground/30 w-full rounded-lg border-none px-3 py-2 text-sm outline-none"
              />
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={handleAddTopic}
                  disabled={isPending}
                  className="bg-sidebar-primary h-auto flex-1 py-1.5 text-xs text-white"
                >
                  {isPending ? "Adding..." : "Add"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAdd(false);
                    setNewName("");
                  }}
                  className="bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 h-auto flex-1 py-1.5 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {topics.length === 0 && !showAdd && (
            <div className="px-3 py-8 text-center">
              <FolderOpen className="text-sidebar-foreground/20 mx-auto mb-2 size-8" />
              <p className="text-sidebar-foreground/40 mb-3 text-sm">No topics yet</p>
              <Button
                variant="link"
                onClick={() => setShowAdd(true)}
                className="text-sidebar-primary h-auto p-0 text-sm"
              >
                Create your first topic
              </Button>
            </div>
          )}

          <div className="space-y-0.5">
            {topics.map((topic) => (
              <Button
                key={topic.id}
                variant="ghost"
                onClick={() => handleSelectTopic(topic.id)}
                className={`h-auto w-full justify-between rounded-lg px-3 py-2.5 text-sm ${
                  selectedTopicId === topic.id && viewMode === "active"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <span className="truncate">{topic.name}</span>
                <span className="text-sidebar-foreground/30 ml-2 shrink-0 text-[10px]">
                  {topic.documentCount}
                </span>
              </Button>
            ))}
          </div>

          {/* Archive section */}
          <div className="border-sidebar-border mt-6 border-t pt-4">
            <Button
              variant="ghost"
              onClick={handleSelectArchive}
              className={`h-auto w-full justify-start gap-2.5 px-3 py-2.5 text-sm ${
                viewMode === "archived"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <Archive className="size-4" />
              <span className="flex-1 text-left">Archive</span>
              {archivedCount > 0 && (
                <span className="text-sidebar-foreground/30 text-[10px]">{archivedCount}</span>
              )}
            </Button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-sidebar-border border-t p-3">
          {!showSettings ? (
            <Button
              variant="ghost"
              onClick={() => setShowSettings(true)}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 h-auto w-full justify-start gap-2 px-3 py-2.5 text-sm"
            >
              <Settings className="size-4" />
              Settings
            </Button>
          ) : (
            <SettingsPanel
              topics={topics}
              onTopicsChange={onTopicsChange}
              onRefresh={onRefresh}
              onClose={() => setShowSettings(false)}
            />
          )}
        </div>
      </aside>
    </>
  );
}
