<script setup lang="ts">
// Compact two-way switch. Sits at the top of the sidebar and in the mobile nav.
import { track, setTrack, TRACK_LABELS, type Track } from './track'

const options: Track[] = ['simple', 'everything']
</script>

<template>
  <div class="track-switch" role="radiogroup" aria-label="How much of the guide to show">
    <button
      v-for="t in options"
      :key="t"
      type="button"
      role="radio"
      :aria-checked="track === t"
      :class="{ active: track === t }"
      @click="setTrack(t)"
    >{{ TRACK_LABELS[t] }}</button>
  </div>
</template>
