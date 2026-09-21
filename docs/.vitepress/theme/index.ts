import { h, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import TrackSwitch from './TrackSwitch.vue'
import TrackChooser from './TrackChooser.vue'
import TrackPageNote from './TrackPageNote.vue'
import { initTrack } from './track'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'sidebar-nav-before': () => h(TrackSwitch),
      'nav-screen-content-after': () => h(TrackSwitch),
      'doc-before': () => h(TrackPageNote),
    })
  },
  enhanceApp({ app }) {
    app.component('TrackChooser', TrackChooser)
  },
  setup() {
    onMounted(initTrack)
  },
} satisfies Theme
