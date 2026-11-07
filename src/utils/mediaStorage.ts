import {
  ProjectCoverSlot,
  ProjectCardCovers,
  deriveProjectCardCovers,
} from './portfolioMath';

export interface PersistedGalleryMediaItem {
  id: string;
  type: 'image' | 'video' | 'html';
  url: string;
  alt: string;
  fileName?: string;
  htmlContent?: string;
  coverUrl?: string;
  isCover?: boolean;
  isCustom?: boolean;
  coverSlot?: ProjectCoverSlot;
  fileBlob?: Blob;
}

const DB_NAME = 'portfolio_persistent_media_db';
const DB_VERSION = 1;
const GALLERY_STORE = 'project_galleries';
const COVERS_STORE = 'project_covers';
const COVERS_KEY = 'portfolio_custom_project_covers';

let dbPromise: Promise<IDBDatabase> | null = null;

function openMediaDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not supported in this environment'));
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(GALLERY_STORE)) {
          db.createObjectStore(GALLERY_STORE);
        }
        if (!db.objectStoreNames.contains(COVERS_STORE)) {
          db.createObjectStore(COVERS_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        dbPromise = null;
        reject(request.error);
      };
    });
  }
  return dbPromise;
}

/**
 * Reconstructs fresh Object URLs for persisted video Blobs and HTML content
 * after a page refresh so they play and open without broken blob: links.
 */
export function reviveGalleryItems(
  items: PersistedGalleryMediaItem[],
  fallbackCoverUrl?: string
): PersistedGalleryMediaItem[] {
  const hasExplicitCover = items.some((item) => Boolean(item.isCover));
  return items.map((item, idx) => {
    let revivedUrl = item.url;
    if (item.fileBlob instanceof Blob) {
      revivedUrl = URL.createObjectURL(item.fileBlob);
    } else if (item.type === 'html' && item.htmlContent) {
      const blob = new Blob([item.htmlContent], { type: 'text/html;charset=utf-8' });
      revivedUrl = URL.createObjectURL(blob);
    }

    return {
      ...item,
      type: item.type || 'image',
      url: revivedUrl,
      isCover: hasExplicitCover
        ? Boolean(item.isCover)
        : (fallbackCoverUrl ? revivedUrl === fallbackCoverUrl : false) ||
          idx === items.length - 1,
    };
  });
}

export async function saveGalleryToIndexedDb(
  storageKey: string,
  items: PersistedGalleryMediaItem[]
): Promise<void> {
  // Save serializable subset to localStorage for fast synchronous initial read
  try {
    const serializable = items.map(({ fileBlob: _blob, ...rest }) => rest);
    localStorage.setItem(storageKey, JSON.stringify(serializable));
  } catch {
    // Ignore localStorage quota error; IndexedDB below handles large files & videos
  }

  try {
    const db = await openMediaDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(GALLERY_STORE, 'readwrite');
      const store = tx.objectStore(GALLERY_STORE);
      store.put(items, storageKey);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback already handled via memory / localStorage
  }
}

export async function loadGalleryFromIndexedDb(
  storageKey: string,
  fallbackCoverUrl?: string
): Promise<PersistedGalleryMediaItem[] | null> {
  try {
    const db = await openMediaDb();
    const result = await new Promise<PersistedGalleryMediaItem[] | undefined>(
      (resolve, reject) => {
        const tx = db.transaction(GALLERY_STORE, 'readonly');
        const store = tx.objectStore(GALLERY_STORE);
        const req = store.get(storageKey);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }
    );
    if (Array.isArray(result) && result.length > 0) {
      return reviveGalleryItems(result, fallbackCoverUrl);
    }
  } catch {
    // Fallback to localStorage/sessionStorage
  }
  return null;
}

export async function clearGalleryFromIndexedDb(storageKey: string): Promise<void> {
  try {
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
  } catch {
    // ignore
  }
  try {
    const db = await openMediaDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(GALLERY_STORE, 'readwrite');
      const store = tx.objectStore(GALLERY_STORE);
      store.delete(storageKey);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}

export type StoredProjectCoversMap = Record<string, ProjectCardCovers>;

export function normalizeStoredCoversMap(
  raw: Record<string, unknown> | null | undefined,
  projects: Array<{
    number: string;
    col1Img1: string;
    col1Img2: string;
    col2Img: string;
  }>
): StoredProjectCoversMap {
  if (!raw || typeof raw !== 'object') return {};
  const normalized: StoredProjectCoversMap = {};
  for (const [projectNumber, val] of Object.entries(raw)) {
    const base = projects.find((p) => p.number === projectNumber);
    if (!base) continue;
    if (typeof val === 'string' && val) {
      normalized[projectNumber] = {
        col1Img1: base.col1Img1,
        col1Img2: base.col1Img2,
        col2Img: val,
      };
    } else if (val && typeof val === 'object') {
      const obj = val as Partial<ProjectCardCovers>;
      normalized[projectNumber] = {
        col1Img1: obj.col1Img1 || base.col1Img1,
        col1Img2: obj.col1Img2 || base.col1Img2,
        col2Img: obj.col2Img || base.col2Img,
      };
    }
  }
  return normalized;
}

export async function saveProjectCoversToStorage(
  covers: StoredProjectCoversMap
): Promise<void> {
  try {
    localStorage.setItem(COVERS_KEY, JSON.stringify(covers));
  } catch {
    // Ignore quota errors in localStorage; IndexedDB handles large base64 covers
  }
  try {
    const db = await openMediaDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(COVERS_STORE, 'readwrite');
      const store = tx.objectStore(COVERS_STORE);
      store.put(covers, COVERS_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // ignore
  }
}

export async function loadProjectCoversFromStorage(
  projects: Array<{
    number: string;
    name: string;
    col1Img1: string;
    col1Img2: string;
    col2Img: string;
  }>
): Promise<StoredProjectCoversMap> {
  let coversMap: StoredProjectCoversMap = {};

  try {
    const localSaved =
      localStorage.getItem(COVERS_KEY) || sessionStorage.getItem(COVERS_KEY);
    if (localSaved) {
      coversMap = normalizeStoredCoversMap(JSON.parse(localSaved), projects);
    }
  } catch {
    // ignore
  }

  try {
    const db = await openMediaDb();
    const result = await new Promise<Record<string, unknown> | undefined>(
      (resolve, reject) => {
        const tx = db.transaction(COVERS_STORE, 'readonly');
        const store = tx.objectStore(COVERS_STORE);
        const req = store.get(COVERS_KEY);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }
    );
    if (result && typeof result === 'object') {
      coversMap = {
        ...coversMap,
        ...normalizeStoredCoversMap(result, projects),
      };
    }
  } catch {
    // Fallback to localStorage / sessionStorage
  }

  // Also check each project's persisted gallery in IndexedDB / localStorage so any uploaded files sync to the 3 card images
  for (const proj of projects) {
    const storageKey = `project_gallery_state_${proj.number}`;
    const idbGallery = await loadGalleryFromIndexedDb(storageKey, proj.col2Img);
    if (idbGallery && idbGallery.length > 0) {
      coversMap[proj.number] = deriveProjectCardCovers(
        idbGallery,
        {
          col1Img1: proj.col1Img1,
          col1Img2: proj.col1Img2,
          col2Img: proj.col2Img,
        },
        proj.name
      );
      continue;
    }

    try {
      const storedGallery =
        localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);
      if (storedGallery) {
        const parsed = JSON.parse(storedGallery);
        if (Array.isArray(parsed) && parsed.length > 0) {
          coversMap[proj.number] = deriveProjectCardCovers(
            parsed,
            {
              col1Img1: proj.col1Img1,
              col1Img2: proj.col1Img2,
              col2Img: proj.col2Img,
            },
            proj.name
          );
        }
      }
    } catch {
      // ignore
    }
  }

  return coversMap;
}

/**
 * Extracts a cover frame data URL from an uploaded video file using an offscreen <video> + <canvas>.
 */
export function extractVideoFrameDataUrl(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(null);
      return;
    }
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    let settled = false;
    const finish = (dataUrl: string | null) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      resolve(dataUrl);
    };

    const timeoutId = window.setTimeout(() => finish(null), 2500);

    video.onloadedmetadata = () => {
      const targetTime =
        Number.isFinite(video.duration) && video.duration > 0.5
          ? Math.min(0.5, video.duration * 0.2)
          : 0.05;
      try {
        video.currentTime = targetTime;
      } catch {
        finish(null);
      }
    };

    video.onseeked = () => {
      window.clearTimeout(timeoutId);
      try {
        const w = video.videoWidth || 640;
        const h = video.videoHeight || 360;
        const scale = Math.min(1, 960 / Math.max(w, 1));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          finish(dataUrl);
          return;
        }
      } catch {
        // ignore
      }
      finish(null);
    };

    video.onerror = () => {
      window.clearTimeout(timeoutId);
      finish(null);
    };
  });
}
