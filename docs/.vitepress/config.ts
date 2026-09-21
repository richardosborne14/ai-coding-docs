import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AI-Assisted Software Engineering Guide',
  description: 'Build production-ready apps with AI — systematically, not randomly',

  sitemap: { hostname: 'https://ai-coding.digitalbricks.io' },
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/brand/db-icon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' }],
    ['link', { rel: 'apple-touch-icon', href: '/brand/apple-touch-icon.png' }],
    ['meta', { name: 'author', content: 'Richard Osborne, Digital Bricks' }],
    ['meta', { name: 'theme-color', content: '#0A192B' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'AI-Assisted Software Engineering Guide' }],
    ['meta', { property: 'og:description', content: 'Build production-ready apps with AI — systematically, not randomly' }],
  ],

  themeConfig: {
    siteTitle: 'AI-Assisted SE Guide',
    logo: {
      light: '/brand/db-lockup-navy-nav.svg',
      dark: '/brand/db-lockup-nav.svg',
      alt: 'Digital Bricks'
    },

    nav: [
      { text: '👋 Start Here', link: '/start-here' },
      { text: 'Guide', link: '/introduction' },
      { text: 'Templates', link: '/part-6/templates' },
      {
        text: 'Resources',
        items: [
          { text: 'Prompt Library', link: '/part-6/prompts' },
          { text: 'Case Studies', link: '/part-6/case-studies' },
          { text: 'Setup Guide', link: '/part-6/setup-guide' },
        ]
      },
      { text: 'About', link: '/about' }
    ],

    sidebar: [
      {
        text: '👋 New Here? Start Here',
        collapsed: false,
        items: [
          { text: 'Start Here (For Non-Techies)', link: '/start-here' },
        ]
      },
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/introduction' },
        ]
      },
      {
        text: 'Part 0: Before You Start',
        collapsed: false,
        items: [
          { text: 'Setting Up Your Computer', link: '/part-0/setting-up-your-computer' },
          { text: 'Cline & AI Credits', link: '/part-0/cline-and-credits' },
          { text: 'Claude Code: Setup & Customisation', link: '/part-0/claude-code-setup' },
          { text: 'Browser DevTools', link: '/part-0/browser-devtools' },
          { text: 'How Apps Run', link: '/part-0/how-apps-run' },
          { text: 'Files & Styling Basics', link: '/part-0/files-and-styles' },
          { text: 'Concepts Glossary', link: '/part-0/glossary' },
        ]
      },
      {
        text: 'Part I: Foundation',
        collapsed: false,
        items: [
          { text: 'Philosophy & Approach', link: '/part-1/philosophy' },
          { text: 'Tool Selection', link: '/part-1/tool-selection' },
        ]
      },
      {
        text: 'Part II: Pre-Development',
        collapsed: false,
        items: [
          { text: 'The Brainstorming Session', link: '/part-2/brainstorming' },
          { text: 'Documentation Architecture', link: '/part-2/documentation-architecture' },
          { text: 'The Live Project Overview', link: '/part-2/live-project-overview' },
        ]
      },
      {
        text: 'Part III: Execution',
        collapsed: false,
        items: [
          { text: 'The Execution Workflow', link: '/part-3/cline-workflow' },
          { text: 'Task Documentation', link: '/part-3/task-patterns' },
          { text: 'Confidence Scoring', link: '/part-3/confidence-scoring' },
        ]
      },
      {
        text: 'Part IV: Quality Assurance',
        collapsed: false,
        items: [
          { text: 'Phase Audits', link: '/part-4/phase-audits' },
          { text: 'Commenting Philosophy', link: '/part-4/commenting-philosophy' },
        ]
      },
      {
        text: 'Part V: Advanced Topics',
        collapsed: true,
        items: [
          { text: 'Context Management', link: '/part-5/context-management' },
          { text: 'Project Memory & Self-Improvement', link: '/part-5/project-memory' },
          { text: 'The Project Brain', link: '/part-5/project-brain' },
          { text: 'Common Pitfalls', link: '/part-5/pitfalls-recovery' },
          { text: 'Team Workflows', link: '/part-5/team-workflows' },
          { text: 'The Project Control Panel', link: '/part-5/control-panel' },
          { text: 'Observability & Error Tracking', link: '/part-5/observability' },
          { text: 'The In-App Feedback Loop', link: '/part-5/feedback-loop' },
          { text: 'Accessibility by Default', link: '/part-5/accessibility' },
          { text: 'The Frontend Tweaker', link: '/part-5/frontend-tweaker' },
          { text: 'Token Economics', link: '/part-5/token-economics' },
          { text: 'Deployment & Platform Targets', link: '/part-5/deployment-platforms' },
          { text: 'Deploy Verification', link: '/part-5/deploy-verification' },
        ]
      },
      {
        text: 'Part VI: Resources',
        collapsed: false,
        items: [
          { text: 'Project Templates', link: '/part-6/templates' },
          { text: 'Prompt Library', link: '/part-6/prompts' },
          { text: 'Case Studies', link: '/part-6/case-studies' },
          { text: 'Setup Guide', link: '/part-6/setup-guide' },
        ]
      },
      {
        text: 'Appendices',
        collapsed: true,
        items: [
          { text: 'Beyond Coding', link: '/appendix-e-beyond-coding' },
          { text: 'About', link: '/about' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/richardosborne14/ai-coding-docs' }
    ],

    footer: {
      message: 'Written by Richard Osborne · <a href="https://digitalbricks.io">Digital Bricks</a>',
      copyright: '© 2026 Digital Bricks'
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'medium'
      }
    }
  },

  markdown: {
    lineNumbers: false,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
