import { create } from "zustand";
import { persist } from "zustand/middleware";

type SyncStatus = "idle" | "backing-up" | "restoring";

interface DriveState {
  accessToken: string | null;
  lastBackupAt: string | null;
  syncStatus: SyncStatus;
  error: string | null;
  setAccessToken: (token: string | null) => void;
  setLastBackupAt: (at: string) => void;
  setSyncStatus: (status: SyncStatus) => void;
  setError: (error: string | null) => void;
}

export const useDriveStore = create<DriveState>()(
  persist(
    (set) => ({
      accessToken: null,
      lastBackupAt: null,
      syncStatus: "idle",
      error: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setLastBackupAt: (at) => set({ lastBackupAt: at }),
      setSyncStatus: (status) => set({ syncStatus: status }),
      setError: (error) => set({ error }),
    }),
    {
      name: "drive-storage",
      // token lives in memory only; only persist last backup time
      partialize: (state) => ({ lastBackupAt: state.lastBackupAt }),
    }
  )
);
