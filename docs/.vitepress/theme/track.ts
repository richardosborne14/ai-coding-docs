// The reader's track: "simple" (Keep it simple) or "everything" (Show me everything).
// Nothing stored means "everything", so the site reads fine with storage blocked.
// The choice lives on <html data-track>, which CSS uses to hide builder-only content.
// An inline script in config.ts `head` sets the attribute before first paint.
import { ref } from 'vue'

export type Track = 'simple' | 'everything'

export const TRACK_KEY = 'db-learn-track'

export const TRACK_LABELS: Record<Track, string> = {
  simple: 'Keep it simple',
  everything: 'Show me everything',
}

export const track = ref<Track>('everything')

function read(): Track {
  try {
    return localStorage.getItem(TRACK_KEY) === 'simple' ? 'simple' : 'everything'
  } catch {
    return 'everything'
  }
}

export function initTrack() {
  track.value = read()
  apply(track.value)
}

export function setTrack(next: Track) {
  track.value = next
  apply(next)
  try {
    localStorage.setItem(TRACK_KEY, next)
  } catch {
    // Storage blocked: the choice lasts until the page is reloaded.
  }
}

function apply(t: Track) {
  document.documentElement.dataset.track = t
}
