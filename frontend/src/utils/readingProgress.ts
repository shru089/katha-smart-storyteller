/**
 * Reading Progress Utilities
 * LocalStorage-based progress tracking
 */

export interface ReadingProgress {
    storyId: number;
    storyTitle: string;
    chapterId: number;
    chapterTitle: string;
    chapterIndex: number;
    coverImageUrl?: string;
    progress: number; // 0-100
    lastRead: string; // ISO timestamp
    sceneIndex?: number; // Current scene position
}

const STORAGE_KEY = "katha_reading_progress";

/**
 * Save reading progress
 */
export function saveReadingProgress(progress: ReadingProgress): void {
    try {
        const existing = getAllReadingProgress();
        const index = existing.findIndex(
            (p) => p.chapterId === progress.chapterId
        );

        if (index >= 0) {
            // Update existing
            existing[index] = { ...progress, lastRead: new Date().toISOString() };
        } else {
            // Add new
            existing.unshift({ ...progress, lastRead: new Date().toISOString() });
        }

        // Keep only last 10
        const limited = existing.slice(0, 10);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
    } catch (error) {
        console.error("Failed to save reading progress:", error);
    }
}

/**
 * Get all reading progress (sorted by most recent)
 */
export function getAllReadingProgress(): ReadingProgress[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const progress: ReadingProgress[] = JSON.parse(stored);
        return progress.sort(
            (a, b) =>
                new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime()
        );
    } catch (error) {
        console.error("Failed to get reading progress:", error);
        return [];
    }
}

/**
 * Get most recent reading progress
 */
export function getLastReadingProgress(): ReadingProgress | null {
    const all = getAllReadingProgress();
    return all.length > 0 ? all[0] : null;
}

/**
 * Get progress for a specific chapter
 */
export function getChapterProgress(chapterId: number): ReadingProgress | null {
    const all = getAllReadingProgress();
    return all.find((p) => p.chapterId === chapterId) || null;
}

/**
 * Clear all reading progress
 */
export function clearReadingProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Remove specific chapter progress
 */
export function removeChapterProgress(chapterId: number): void {
    try {
        const existing = getAllReadingProgress();
        const filtered = existing.filter((p) => p.chapterId !== chapterId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error("Failed to remove chapter progress:", error);
    }
}
