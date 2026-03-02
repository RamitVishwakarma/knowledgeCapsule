import { create } from "zustand";

export interface Document {
  id: string;
  topicId: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  videoUrl: string;
  transcript: string;
  transcriptSource: "youtube" | "manual" | "none";
  summary: string;
  summaryStatus: "none" | "processing" | "ready" | "failed";
  createdAt: string;
  archived: boolean;
  archivedAt: string | null;
}

export interface Topic {
  id: string;
  name: string;
  createdAt: string;
}

export type ViewMode = "active" | "archived";

interface AppStore {
  isAuthenticated: boolean;
  topics: Topic[];
  documents: Document[];
  selectedTopicId: string | null;
  selectedDocId: string | null;
  sidebarOpen: boolean;
  viewMode: ViewMode;
  login: () => void;
  logout: () => void;
  addTopic: (name: string) => void;
  renameTopic: (id: string, name: string) => void;
  deleteTopic: (id: string) => void;
  selectTopic: (id: string | null) => void;
  addDocument: (
    doc: Omit<
      Document,
      "id" | "createdAt" | "transcript" | "transcriptSource" | "summary" | "summaryStatus" | "archived" | "archivedAt"
    >
  ) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  archiveDocument: (id: string) => void;
  restoreDocument: (id: string) => void;
  permanentlyDeleteDocument: (id: string) => void;
  selectDocument: (id: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  regenerateSummary: (docId: string) => void;
}

const MOCK_TOPICS: Topic[] = [
  { id: "t1", name: "DSA", createdAt: "2022-03-15" },
  { id: "t2", name: "System Design", createdAt: "2022-06-20" },
  { id: "t3", name: "React Internals", createdAt: "2023-01-10" },
];

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "d1",
    topicId: "t1",
    title: "Me explaining Binary Search Trees",
    shortDescription: "Recorded after finishing the BST chapter — covers insert, delete, traversal",
    longDescription:
      "I recorded this after spending two weeks on BSTs. I walk through insertion, deletion (all three cases), and the three traversal methods. Future me: pay attention to the AVL rotation part at 8:30, that's the tricky bit.",
    videoUrl: "https://www.youtube.com/watch?v=example1",
    transcript:
      "Alright, so I just finished the BST chapter and I want to explain this while it's still fresh. A binary search tree is a node-based structure where every node's left children are smaller and right children are larger...",
    transcriptSource: "youtube",
    summary:
      "## Binary Search Trees — My Explanation\n\n**What I covered:**\n- BST property: left < node < right\n- Insertion: walk down and place at the correct leaf\n- Deletion: three cases — leaf, one child, two children (successor swap)\n- Traversals: inorder gives sorted output\n\n**Key insight I had:**\nUnbalanced BSTs degrade to O(n). AVL trees fix this with rotations after every insert/delete.\n\n**Timestamp to revisit:** 8:30 — AVL rotation walkthrough",
    summaryStatus: "ready",
    createdAt: "2022-03-18",
    archived: false,
    archivedAt: null,
  },
  {
    id: "d2",
    topicId: "t1",
    title: "Dynamic Programming — my mental model",
    shortDescription: "How I think about DP problems after grinding 50+ questions",
    longDescription:
      "After solving around 50 DP problems, I finally developed a mental framework. This video is me explaining the 5 patterns I see everywhere.",
    videoUrl: "https://www.youtube.com/watch?v=example2",
    transcript: "",
    transcriptSource: "none",
    summary: "",
    summaryStatus: "none",
    createdAt: "2022-04-02",
    archived: false,
    archivedAt: null,
  },
  {
    id: "d3",
    topicId: "t1",
    title: "Graph traversal — BFS vs DFS explained to myself",
    shortDescription: "Whiteboard session where I trace through both algorithms",
    longDescription:
      "I set up a whiteboard and walked through BFS and DFS on the same graph so I could see the difference visually. Really helped it click.",
    videoUrl: "https://www.youtube.com/watch?v=example3",
    transcript: "Ok so I have this graph drawn out and I want to trace through both BFS and DFS...",
    transcriptSource: "youtube",
    summary: "",
    summaryStatus: "processing",
    createdAt: "2022-04-15",
    archived: false,
    archivedAt: null,
  },
  {
    id: "d4",
    topicId: "t2",
    title: "URL Shortener — my system design walkthrough",
    shortDescription: "Designed a URL shortener end-to-end, explaining each decision",
    longDescription:
      "I pretended I was in an interview and designed a URL shortener from scratch. Talked through requirements, API design, database choice, and caching strategy.",
    videoUrl: "https://www.youtube.com/watch?v=example4",
    transcript: "Let me design a URL shortening service from the ground up...",
    transcriptSource: "youtube",
    summary:
      "## URL Shortener — My Design\n\n**Requirements I chose:** Short URL generation, redirect, basic analytics\n\n**Architecture:** Load balancer → App servers → Redis cache → Postgres\n\n**Key decisions I made:**\n- Base62 encoding for short codes (no collisions)\n- Postgres for persistence, Redis for hot URL caching\n- 301 redirect for speed, but 302 if we want analytics\n\n**What I'd do differently next time:** Consider consistent hashing for the cache layer",
    summaryStatus: "ready",
    createdAt: "2022-07-05",
    archived: false,
    archivedAt: null,
  },
  {
    id: "d5",
    topicId: "t3",
    title: "React Server Components — what I understood",
    shortDescription: "Explaining RSC mental model after reading the RFC and Dan's posts",
    longDescription:
      "I spent a weekend reading the RSC RFC and Dan Abramov's blog posts. This is me trying to explain the mental model in my own words to make sure I actually get it.",
    videoUrl: "https://www.youtube.com/watch?v=example5",
    transcript:
      "So I've been reading about React Server Components and I want to explain what I think I understand...",
    transcriptSource: "manual",
    summary:
      "## React Server Components — My Understanding\n\n**Core idea:** Components that execute only on the server, sending rendered output (not JS) to the client.\n\n**Why it matters:**\n- Zero JS bundle for server components\n- Can query databases directly\n- Automatic code splitting — only client components ship JS\n\n**My analogy:** It's like PHP but you get to keep React's component model and composability.",
    summaryStatus: "ready",
    createdAt: "2023-01-15",
    archived: false,
    archivedAt: null,
  },
  {
    id: "d6",
    topicId: "t1",
    title: "Sorting algorithms comparison — early attempt",
    shortDescription: "My first recording comparing bubble, merge, and quick sort",
    longDescription:
      "This was one of my earliest recordings. The explanation is a bit rough but it helped me at the time.",
    videoUrl: "https://www.youtube.com/watch?v=example6",
    transcript: "Let me try to explain the difference between these sorting algorithms...",
    transcriptSource: "youtube",
    summary:
      "## Sorting Algorithms Comparison\n\n- Bubble sort: O(n²), simple but slow\n- Merge sort: O(n log n), stable, needs extra space\n- Quick sort: O(n log n) average, in-place but unstable",
    summaryStatus: "ready",
    createdAt: "2022-02-10",
    archived: true,
    archivedAt: "2023-06-01",
  },
];

export const useAppStore = create<AppStore>((set) => ({
  isAuthenticated: false,
  topics: MOCK_TOPICS,
  documents: MOCK_DOCUMENTS,
  selectedTopicId: null,
  selectedDocId: null,
  sidebarOpen: true,
  viewMode: "active",

  login: () => set({ isAuthenticated: true }),

  logout: () =>
    set({
      isAuthenticated: false,
      selectedTopicId: null,
      selectedDocId: null,
      viewMode: "active",
    }),

  addTopic: (name) =>
    set((state) => ({
      topics: [
        ...state.topics,
        { id: `t${Date.now()}`, name, createdAt: new Date().toISOString() },
      ],
    })),

  renameTopic: (id, name) =>
    set((state) => ({
      topics: state.topics.map((t) => (t.id === id ? { ...t, name } : t)),
    })),

  deleteTopic: (id) =>
    set((state) => ({
      topics: state.topics.filter((t) => t.id !== id),
      documents: state.documents.filter((d) => d.topicId !== id),
      selectedTopicId: state.selectedTopicId === id ? null : state.selectedTopicId,
    })),

  selectTopic: (id) => set({ selectedTopicId: id }),

  addDocument: (doc) =>
    set((state) => {
      const newDoc: Document = {
        ...doc,
        id: `d${Date.now()}`,
        createdAt: new Date().toISOString(),
        transcript: "",
        transcriptSource: "none",
        summary: "",
        summaryStatus: "none",
        archived: false,
        archivedAt: null,
      };
      return { documents: [...state.documents, newDoc], selectedDocId: newDoc.id };
    }),

  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),

  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
      selectedDocId: state.selectedDocId === id ? null : state.selectedDocId,
    })),

  archiveDocument: (id) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, archived: true, archivedAt: new Date().toISOString() } : d
      ),
      selectedDocId: state.selectedDocId === id ? null : state.selectedDocId,
    })),

  restoreDocument: (id) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, archived: false, archivedAt: null } : d
      ),
    })),

  permanentlyDeleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
      selectedDocId: state.selectedDocId === id ? null : state.selectedDocId,
    })),

  selectDocument: (id) => set({ selectedDocId: id }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setViewMode: (mode) => set({ viewMode: mode }),

  regenerateSummary: (docId) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === docId ? { ...d, summaryStatus: "processing" as const } : d
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        documents: state.documents.map((d) =>
          d.id === docId
            ? {
                ...d,
                summaryStatus: "ready" as const,
                summary:
                  "## Auto-Generated Summary\n\nThis summary was regenerated from the available transcript. Key points have been extracted and organized for quick review.\n\n**Main Topics:**\n- Core concepts explained in my own words\n- Practical examples walked through\n- Key insights and 'aha' moments captured",
              }
            : d
        ),
      }));
    }, 3000);
  },
}));
