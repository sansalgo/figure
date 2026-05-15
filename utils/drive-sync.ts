const BACKUP_FILENAME = "figure-backup.json";
const DRIVE_FILES_API = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3/files";

export class DriveAuthError extends Error {
  constructor() {
    super("Authentication expired. Please reconnect Google Drive.");
    this.name = "DriveAuthError";
  }
}

async function driveRequest(url: string, token: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
  if (res.status === 401) throw new DriveAuthError();
  if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
  return res;
}

async function findBackupFileId(token: string): Promise<string | null> {
  const res = await driveRequest(
    `${DRIVE_FILES_API}?spaces=appDataFolder&fields=files(id)&q=name%3D'${BACKUP_FILENAME}'`,
    token
  );
  const data: { files: { id: string }[] } = await res.json();
  return data.files?.[0]?.id ?? null;
}

export async function uploadBackup(token: string, content: string): Promise<void> {
  const existingId = await findBackupFileId(token);

  if (existingId) {
    await driveRequest(`${DRIVE_UPLOAD_API}/${existingId}?uploadType=media`, token, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: content,
    });
  } else {
    const boundary = `figure_${Date.now()}`;
    const body = [
      `--${boundary}`,
      "Content-Type: application/json",
      "",
      JSON.stringify({ name: BACKUP_FILENAME, parents: ["appDataFolder"] }),
      `--${boundary}`,
      "Content-Type: application/json",
      "",
      content,
      `--${boundary}--`,
    ].join("\r\n");

    await driveRequest(`${DRIVE_UPLOAD_API}?uploadType=multipart`, token, {
      method: "POST",
      headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
      body,
    });
  }
}

export async function downloadBackup(token: string): Promise<string | null> {
  const fileId = await findBackupFileId(token);
  if (!fileId) return null;

  const res = await driveRequest(`${DRIVE_FILES_API}/${fileId}?alt=media`, token);
  return res.text();
}
