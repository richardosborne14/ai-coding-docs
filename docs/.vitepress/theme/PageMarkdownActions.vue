<script setup lang="ts">
// Top of every page: copy or download it as Markdown, to hand to Claude.
// The .md files are written at build time (see ../llm-markdown.ts).
import { computed, ref } from 'vue'
import { useData, withBase } from 'vitepress'

const { page } = useData()

const mdUrl = computed(() => withBase('/' + page.value.relativePath))
const fileName = computed(() => page.value.relativePath.split('/').pop())

const status = ref<'idle' | 'copied' | 'failed'>('idle')
let timer: ReturnType<typeof setTimeout> | undefined

async function fetchText() {
  const res = await fetch(mdUrl.value)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

async function copy() {
  try {
    // Safari only allows a clipboard write inside the click, so hand it the pending
    // fetch as a ClipboardItem rather than awaiting the fetch first.
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      const blob = fetchText().then(t => new Blob([t], { type: 'text/plain' }))
      await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })])
    } else {
      await navigator.clipboard.writeText(await fetchText())
    }
    status.value = 'copied'
  } catch {
    status.value = 'failed'
  }
  clearTimeout(timer)
  timer = setTimeout(() => (status.value = 'idle'), 2500)
}
</script>

<template>
  <div class="page-md-actions">
    <button type="button" title="Copies this page as Markdown, ready to paste into Claude" @click="copy">
      {{ status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy page as Markdown' }}
    </button>
    <a :href="mdUrl" :download="fileName">Download .md</a>
    <span class="visually-hidden" aria-live="polite">{{ status === 'copied' ? 'Page copied as Markdown' : '' }}</span>
  </div>
</template>
