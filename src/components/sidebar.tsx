"use client";

import { useAppStore } from "@/store/appStore";
import {
  Plus,
  Settings,
  LogOut,
  ChevronLeft,
  FolderOpen,
  X,
  Archive,
  Trash2,
} from "lucide-react";
import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { createTopic, renameTopic, deleteTopic, getTopics } from "@/app/actions/topics";
import type { Topic } from "@/lib/types";

interface SidebarProps {
  topics: Topic[];
  archivedCount: number;
  onTopicsChange: (topics: Topic[]) => void;
  onArchivedCountChange: (count: number) => void;
  onRefresh: () => void;
}

export function Sidebar({
  topics,
  archivedCount,
  onTopicsChange,
  onRefresh,
}: SidebarProps) {
  const { selectedTopicId, viewMode, selectTopic, selectDocument, setViewMode, sidebarOpen, setSidebarOpen } =
    useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddTopic = () => {
    if (!newName.trim()) return;
    startTransition(async () => {
      const result = await createTopic(newName.trim());
      if ("error" in result) {
        toast.error(result.error);
      } else {
        const fresh = await getTopics();
        onTopicsChange(fresh);
        setNewName("");
        setShowAdd(false);
      }
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
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed md:relative z-50 md:z-auto
        h-full w-64 bg-sidebar text-sidebar-foreground
        flex flex-col border-r border-sidebar-border
        transition-transform duration-300 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        md:translate-x-0
      `}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Knowledge Capsule" className="h-7 w-auto" />
            <span className="text-sidebar-foreground">Knowledge Capsule</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topics */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-[11px] uppercase tracking-wider text-sidebar-foreground/40">
              Topics
            </span>
            <button
              onClick={() => setShowAdd(true)}
              className="text-sidebar-primary hover:text-sidebar-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
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
                className="w-full px-3 py-2 bg-sidebar-accent text-sidebar-foreground rounded-lg text-[13px] placeholder:text-sidebar-foreground/30 border-none outline-none"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleAddTopic}
                  disabled={isPending}
                  className="flex-1 px-3 py-1.5 bg-sidebar-primary text-white rounded-lg text-[12px] disabled:opacity-50"
                >
                  {isPending ? "Adding..." : "Add"}
                </button>
                <button
                  onClick={() => {
                    setShowAdd(false);
                    setNewName("");
                  }}
                  className="flex-1 px-3 py-1.5 bg-sidebar-accent text-sidebar-foreground rounded-lg text-[12px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {topics.length === 0 && !showAdd && (
            <div className="px-3 py-8 text-center">
              <FolderOpen className="w-8 h-8 text-sidebar-foreground/20 mx-auto mb-2" />
              <p className="text-[13px] text-sidebar-foreground/40 mb-3">No topics yet</p>
              <button
                onClick={() => setShowAdd(true)}
                className="text-sidebar-primary text-[13px] hover:underline"
              >
                Create your first topic
              </button>
            </div>
          )}

          <div className="space-y-0.5">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-[14px] transition-colors flex items-center justify-between ${
                  selectedTopicId === topic.id && viewMode === "active"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <span className="truncate">{topic.name}</span>
                <span className="text-[11px] text-sidebar-foreground/30 shrink-0 ml-2">
                  {topic.documentCount}
                </span>
              </button>
            ))}
          </div>

          {/* Archive section */}
          <div className="mt-6 pt-4 border-t border-sidebar-border">
            <button
              onClick={handleSelectArchive}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-[14px] transition-colors flex items-center gap-2.5 ${
                viewMode === "archived"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <Archive className="w-4 h-4" />
              <span className="flex-1">Archive</span>
              {archivedCount > 0 && (
                <span className="text-[11px] text-sidebar-foreground/30">{archivedCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="p-3 border-t border-sidebar-border">
          {!showSettings ? (
            <button
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 text-[14px] transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
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

function SettingsPanel({
  topics,
  onTopicsChange,
  onRefresh,
  onClose,
}: {
  topics: Topic[];
  onTopicsChange: (topics: Topic[]) => void;
  onRefresh: () => void;
  onClose: () => void;
}) {
  const { selectTopic, selectedTopicId } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRename = (id: string, name: string) => {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await renameTopic(id, name.trim());
      if ("error" in result) {
        toast.error(result.error);
      } else {
        const fresh = await getTopics();
        onTopicsChange(fresh);
        setEditingId(null);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteTopic(id);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Topic deleted");
        if (selectedTopicId === id) selectTopic(null);
        onRefresh();
        setDeletingId(null);
      }
    });
  };

  const handleLogout = () => signOut({ callbackUrl: "/" });

  return (
    <div className="bg-sidebar-accent rounded-xl p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-sidebar-foreground/50 uppercase tracking-wider">
          Settings
        </span>
        <button
          onClick={onClose}
          className="text-sidebar-foreground/40 hover:text-sidebar-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {topics.length > 0 && (
        <div>
          <span className="text-[11px] text-sidebar-foreground/40 block mb-1">Rename topics</span>
          {topics.map((t) => (
            <div key={t.id} className="flex items-center gap-1 mb-1">
              {editingId === t.id ? (
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => {
                    if (editName.trim()) handleRename(t.id, editName.trim());
                    else setEditingId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editName.trim()) handleRename(t.id, editName.trim());
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  disabled={isPending}
                  className="flex-1 px-2 py-1 bg-sidebar text-sidebar-foreground rounded text-[13px] border-none outline-none"
                />
              ) : deletingId === t.id ? (
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-[12px] text-destructive flex-1">Delete &ldquo;{t.name}&rdquo;?</span>
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={isPending}
                    className="px-2 py-0.5 text-[11px] bg-destructive text-destructive-foreground rounded disabled:opacity-50"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="px-2 py-0.5 text-[11px] border border-sidebar-border rounded text-sidebar-foreground"
                  >
                    No
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(t.id);
                      setEditName(t.name);
                    }}
                    className="flex-1 text-left px-2 py-1 text-[13px] text-sidebar-foreground/70 hover:text-sidebar-foreground rounded hover:bg-sidebar/50"
                  >
                    {t.name}
                  </button>
                  <button
                    onClick={() => setDeletingId(t.id)}
                    className="p-1 text-sidebar-foreground/30 hover:text-destructive transition-colors"
                    title="Delete topic"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-[13px] transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </div>
  );
}
