"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDriveStore } from "@/store/drive-store";
import { useExpenseStore } from "@/store/expense-store";
import { uploadBackup, downloadBackup, DriveAuthError } from "@/utils/drive-sync";
import type { BackupSnapshot } from "@/types";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

// Module-level functions use getState() to avoid stale closures in the GIS callback
async function performBackup(token: string) {
  const { allExpenses, tags, currency } = useExpenseStore.getState();
  const { setSyncStatus, setError, setLastBackupAt, setAccessToken } = useDriveStore.getState();

  setSyncStatus("backing-up");
  setError(null);
  try {
    const snapshot: BackupSnapshot = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      allExpenses: allExpenses.map((e) => ({ ...e, date: new Date(e.date).toISOString() })),
      tags,
      currency,
    };
    await uploadBackup(token, JSON.stringify(snapshot));
    setLastBackupAt(new Date().toISOString());
  } catch (err) {
    if (err instanceof DriveAuthError) {
      setAccessToken(null);
      setError("Session expired. Please try again.");
    } else {
      setError(err instanceof Error ? err.message : "Backup failed");
    }
  } finally {
    setSyncStatus("idle");
  }
}

async function performRestore(token: string) {
  const { importState } = useExpenseStore.getState();
  const { setSyncStatus, setError, setLastBackupAt, setAccessToken } = useDriveStore.getState();

  setSyncStatus("restoring");
  setError(null);
  try {
    const content = await downloadBackup(token);
    if (!content) {
      setError("No backup found in Google Drive.");
      return;
    }
    const snapshot: BackupSnapshot = JSON.parse(content);
    importState(snapshot);
    setLastBackupAt(snapshot.exportedAt);
  } catch (err) {
    if (err instanceof DriveAuthError) {
      setAccessToken(null);
      setError("Session expired. Please try again.");
    } else {
      setError(err instanceof Error ? err.message : "Restore failed");
    }
  } finally {
    setSyncStatus("idle");
  }
}

type PendingAction = "backup" | "restore" | null;

export function DriveBackupSection() {
  const [gisReady, setGisReady] = useState(false);
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
  const tokenClientRef = useRef<{ requestAccessToken(config?: { prompt?: string }): void } | null>(null);
  const pendingActionRef = useRef<PendingAction>(null);

  const { accessToken, lastBackupAt, syncStatus, error, setAccessToken, setError } = useDriveStore();

  const onGisLoad = useCallback(() => {
    if (!CLIENT_ID) return;
    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "https://www.googleapis.com/auth/drive.appdata",
      callback: async (response) => {
        if (response.error) {
          setAccessToken(null);
          pendingActionRef.current = null;
          return;
        }
        const token = response.access_token;
        setError(null);
        setAccessToken(token);

        const pending = pendingActionRef.current;
        pendingActionRef.current = null;
        if (pending === "backup") await performBackup(token);
        else if (pending === "restore") await performRestore(token);
      },
    });
    setGisReady(true);
  }, [setAccessToken, setError]);

  // If the GIS script was already loaded from a previous mount, initialize immediately
  useEffect(() => {
    if (window.google?.accounts?.oauth2) {
      onGisLoad();
    }
  }, [onGisLoad]);

  const requestToken = (afterAuth: PendingAction) => {
    pendingActionRef.current = afterAuth;
    tokenClientRef.current?.requestAccessToken();
  };

  const handleConnect = () => requestToken(null);

  const handleDisconnect = () => {
    setAccessToken(null);
    setError(null);
  };

  const handleBackup = () => {
    if (accessToken) performBackup(accessToken);
    else requestToken("backup");
  };

  const handleRestore = () => {
    setIsRestoreConfirmOpen(true);
  };

  const handleRestoreConfirm = () => {
    setIsRestoreConfirmOpen(false);
    if (accessToken) performRestore(accessToken);
    else requestToken("restore");
  };

  if (!CLIENT_ID) return null;

  const isBusy = syncStatus !== "idle";

  return (
    <div className="space-y-2">
      <Script src="https://accounts.google.com/gsi/client" onLoad={onGisLoad} strategy="afterInteractive" />
      <Label>Cloud Backup</Label>
      {!accessToken ? (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleConnect}
          disabled={!gisReady}
        >
          Connect Google Drive
        </Button>
      ) : (
        <div className="space-y-2">
          {lastBackupAt ? (
            <p className="text-xs text-muted-foreground">
              Last backup: {format(new Date(lastBackupAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">No backup yet.</p>
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBackup} disabled={isBusy || !gisReady}>
              {syncStatus === "backing-up" ? "Saving..." : "Back up now"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRestore} disabled={isBusy || !gisReady}>
              {syncStatus === "restoring" ? "Restoring..." : "Restore"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDisconnect} disabled={isBusy}>
              Disconnect
            </Button>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}

      <AlertDialog open={isRestoreConfirmOpen} onOpenChange={setIsRestoreConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore from backup?</AlertDialogTitle>
            <AlertDialogDescription>
              This will overwrite all local data with the backup from Google Drive. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleRestoreConfirm}>
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
