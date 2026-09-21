<script setup lang="ts">
// Shown above a builder-only page when the reader is on "Keep it simple",
// e.g. when they arrive from search or a shared link.
import { computed } from 'vue'
import { useData } from 'vitepress'
import { track, setTrack, TRACK_LABELS } from './track'

const { page, theme } = useData()

const builderOnly = computed(() => {
  const path = '/' + page.value.relativePath.replace(/(index)?\.md$/, '')
  return (theme.value.builderOnlyPages as string[] | undefined)?.includes(path) ?? false
})
</script>

<template>
  <div v-if="builderOnly && track === 'simple'" class="track-page-note">
    <p>
      This page is part of <strong>{{ TRACK_LABELS.everything }}</strong>, so it's hidden from your sidebar.
      You don't need it to build in the desktop app, but you're welcome to read it.
    </p>
    <button type="button" @click="setTrack('everything')">Switch to {{ TRACK_LABELS.everything }}</button>
  </div>
</template>
