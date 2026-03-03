"use client";

import { useAppStore } from "@/store/appStore";
import { ChevronLeft, Trash2, LogOut } from "lucide-react";
import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { renameTopic, deleteTopic, getTopics } from "@/app/actions/topics";
import type { Topic } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { handleActionResult } from "@/lib/utils/action-result";

interface SettingsPanelProps {
  topics: Topic[];
  onTopicsChange: (topics: Topic[]) => void;
  onRefresh: () => void;
  onClose: () => void;
}

export function SettingsPanel({ topics, onTopicsChange, onRefresh, onClose }: SettingsPanelProps) {
  const selectTopic = useAppStore((s) => s.selectTopic);
  const selectedTopicId = useAppStore((s) => s.selectedTopicId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRename = (id: string, name: string) => {
    if (!name.trim()) return;
    startTransition(async () => {
      const result = await renameTopic(id, name.trim());
      handleActionResult(result, async () => {
        const fresh = await getTopics();
        onTopicsChange(fresh);
        setEditingId(null);
      });
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteTopic(id);
      handleActionResult(result, () => {
        toast.success("Topic deleted");
        if (selectedTopicId === id) selectTopic(null);
        onRefresh();
        setDeletingId(null);
      });
    });
  };

  const handleLogout = () => signOut({ callbackUrl: "/" });

  return (
    <div className="bg-sidebar-accent space-y-3 rounded-xl p-3">
      <div className="flex items-center justify-between">
        <span className="text-sidebar-foreground/50 text-xs tracking-wider uppercase">
          Settings
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-sidebar-foreground/40 hover:text-sidebar-foreground size-6 hover:bg-transparent"
        >
          <ChevronLeft className="size-4" />
        </Button>
      </div>

      {topics.length > 0 && (
        <div>
          <span className="text-sidebar-foreground/40 mb-1 block text-xs">Rename topics</span>
          {topics.map((t) => (
            <div key={t.id} className="mb-1 flex items-center gap-1">
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
                  className="bg-sidebar text-sidebar-foreground flex-1 rounded border-none px-2 py-1 text-sm outline-none"
                />
              ) : deletingId === t.id ? (
                <div className="flex flex-1 items-center gap-1">
                  <span className="text-destructive flex-1 text-xs">
                    Delete &ldquo;{t.name}&rdquo;?
                  </span>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(t.id)}
                    disabled={isPending}
                    className="h-auto rounded px-2 py-0.5 text-xs"
                  >
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDeletingId(null)}
                    className="h-auto px-2 py-0.5 text-xs"
                  >
                    No
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingId(t.id);
                      setEditName(t.name);
                    }}
                    className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar/50 h-auto flex-1 justify-start px-2 py-1 text-sm"
                  >
                    {t.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(t.id)}
                    className="text-sidebar-foreground/30 hover:text-destructive size-6 hover:bg-transparent"
                    title="Delete topic"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <Button
        variant="ghost"
        onClick={handleLogout}
        className="h-auto w-full justify-start gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut className="size-4" />
        Sign out
      </Button>
    </div>
  );
}
