<script setup lang="ts">
// The full chooser, placed in pages with <TrackChooser />. Copy follows R2-VOICE (T3).
import { track, setTrack, TRACK_LABELS } from './track'
</script>

<template>
  <div class="track-chooser">
    <button
      type="button"
      class="track-card"
      :class="{ active: track === 'simple' }"
      :aria-pressed="track === 'simple'"
      @click="setTrack('simple')"
    >
      <span class="track-card-title">{{ TRACK_LABELS.simple }}</span>
      <span class="track-card-body">Build and run your app inside the Claude desktop app. No terminal, nothing to install beyond the app.</span>
    </button>
    <button
      type="button"
      class="track-card"
      :class="{ active: track === 'everything' }"
      :aria-pressed="track === 'everything'"
      @click="setTrack('everything')"
    >
      <span class="track-card-title">{{ TRACK_LABELS.everything }}</span>
      <span class="track-card-body">Claude Code in VS Code or a terminal, plus Git, Docker and deploys. Every page, nothing hidden.</span>
    </button>
  </div>
  <p class="track-chooser-note">You can switch at any time from the top of the sidebar.</p>
</template>
