"use client";

import { useAppStore } from "@/store/appStore";
import {
  BookOpen,
  Plus,
  Settings,
  LogOut,
  ChevronLeft,
  FolderOpen,
  X,
  Archive,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const {
    topics,
    documents,
    selectedTopicId,
    viewMode,
    selectTopic,
    selectDocument,
    addTopic,
    setViewMode,
    sidebarOpen,
    setSidebarOpen,
  } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const archivedCount = documents.filter((d) => d.archived).length;

  const handleAddTopic = () => {
    if (newName.trim()) {
      addTopic(newName.trim());
      setNewName("");
      setShowAdd(false);
    }
  };

  const handleSelectTopic = (id: string) => {
    setViewMode("active");
    selectTopic(id);
    selectDocument(null);
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
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
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
                  className="flex-1 px-3 py-1.5 bg-sidebar-primary text-white rounded-lg text-[12px]"
                >
                  Add
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
            {topics.map((topic) => {
              const activeCount = documents.filter(
                (d) => d.topicId === topic.id && !d.archived
              ).length;
              return (
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
                    {activeCount}
                  </span>
                </button>
              );
            })}
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
            <SettingsPanel onClose={() => setShowSettings(false)} />
          )}
        </div>
      </aside>
    </>
  );
}

function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { logout, topics, renameTopic } = useAppStore();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

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
                    if (editName.trim()) renameTopic(t.id, editName.trim());
                    setEditingId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (editName.trim()) renameTopic(t.id, editName.trim());
                      setEditingId(null);
                    }
                  }}
                  className="flex-1 px-2 py-1 bg-sidebar text-sidebar-foreground rounded text-[13px] border-none outline-none"
                />
              ) : (
                <button
                  onClick={() => {
                    setEditingId(t.id);
                    setEditName(t.name);
                  }}
                  className="flex-1 text-left px-2 py-1 text-[13px] text-sidebar-foreground/70 hover:text-sidebar-foreground rounded hover:bg-sidebar/50"
                >
                  {t.name}
                </button>
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
