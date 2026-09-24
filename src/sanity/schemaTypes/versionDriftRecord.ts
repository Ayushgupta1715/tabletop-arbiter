import { defineField, defineType } from 'sanity'

export const versionDriftRecordType = defineType({
  name: 'versionDriftRecord',
  title: 'Version Drift & Breaking Contradiction Record',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Drift Title',
      type: 'string',
      description: 'e.g. @apply Directive Restrictions in CSS-First Engine vs v3 Nested Selectors',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'library',
      title: 'Target Library',
      type: 'reference',
      to: [{ type: 'libraryProfile' }],
    }),
    defineField({
      name: 'libraryName',
      title: 'Library Name (Cache)',
      type: 'string',
      description: 'e.g. Tailwind CSS, React Router, Next.js',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featureCategory',
      title: 'Feature Category',
      type: 'string',
      options: {
        list: [
          { title: '🎨 CSS Directives & Syntax (@apply, @import, @theme)', value: 'directives_css' },
          { title: '⚙️ Configuration & Bundler (tailwind.config.js vs CSS-first)', value: 'config_bundler' },
          { title: '🌓 Theming & Dark Mode (class vs @custom-variant)', value: 'theming_darkmode' },
          { title: '🔌 Plugins & Extensions (@plugin vs plugins[])', value: 'plugins_extensions' },
          { title: '🛣️ Routing & Navigation APIs', value: 'routing_apis' },
          { title: '⚡ Async Server & Request APIs', value: 'async_apis' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'driftSeverity',
      title: 'Breaking Severity',
      type: 'string',
      options: {
        list: [
          { title: '💥 Breaking: Build-time Crash / Compilation Error', value: 'breaking_build_error' },
          { title: '⚠️ Silent Regression: Config or Feature Ignored Silently', value: 'silent_regression' },
          { title: '⏳ Deprecated: Works with Warnings, Dropped in Future', value: 'deprecated_legacy' },
          { title: '🔄 Syntax Shift: Renamed API / Replacement Standard', value: 'renamed_syntax' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'queryPatterns',
      title: 'Trigger Questions & Query Patterns',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Keywords and questions like "@apply ab bhi chalta hai kya", "where is tailwind.config.js"',
    }),
    defineField({
      name: 'scenarioSummary',
      title: 'Developer Dilemma Summary',
      type: 'text',
      rows: 3,
      description: 'The real-world question or confusion that causes developers to get conflicting answers.',
    }),

    // Source 1: Legacy Claim (v3 / Outdated tutorials / SO)
    defineField({
      name: 'legacyVersion',
      title: 'Legacy Version Tag',
      type: 'string',
      initialValue: 'v3.x Legacy',
    }),
    defineField({
      name: 'legacyClaim',
      title: 'Legacy Claim (What v3 docs & 2021-2023 tutorials say)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'legacyCode',
      title: 'Legacy Code Snippet (Broken in v4)',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'legacySourceLabel',
      title: 'Legacy Source Label',
      type: 'string',
      description: 'e.g. FreeCodeCamp Tutorial (2022) / StackOverflow #581902 (Accepted Answer)',
    }),
    defineField({
      name: 'legacySourceUrl',
      title: 'Legacy Source URL',
      type: 'url',
    }),

    // Source 2: Modern Canonical Claim (v4 official docs / migration guide)
    defineField({
      name: 'currentVersion',
      title: 'Current Version Tag',
      type: 'string',
      initialValue: 'v4.0 Canonical',
    }),
    defineField({
      name: 'currentClaim',
      title: 'Modern Claim (Official v4 Documentation & Upgrade Guide)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'currentCode',
      title: 'Modern Code Snippet (Working v4)',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'currentSourceLabel',
      title: 'Current Source Label',
      type: 'string',
      description: 'e.g. Tailwind v4 Upgrade Guide / GitHub Release Notes v4.0.0',
    }),
    defineField({
      name: 'currentSourceUrl',
      title: 'Current Source URL',
      type: 'url',
    }),

    // Source 3: Community Confusion & GitHub Discussions
    defineField({
      name: 'communityClaim',
      title: 'Community Confusion (GitHub Discussions / Reddit Pitfalls)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'communitySourceLabel',
      title: 'Community Source Reference',
      type: 'string',
    }),
    defineField({
      name: 'communitySourceUrl',
      title: 'Community Source URL',
      type: 'url',
    }),

    // Simulated Error and Why Keyword Search Fails
    defineField({
      name: 'compilerError',
      title: 'Simulated Compiler / Terminal Output (When running old code)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'whyKeywordSearchFails',
      title: 'Why Keyword Search & Generic LLMs Fail',
      type: 'text',
      rows: 4,
      description: 'Detailed explanation of why keyword ranking favors the outdated answer.',
    }),

    // Resolution & Decision Carrying
    defineField({
      name: 'resolutionDecision',
      title: 'Agent Resolution Decision (Carried Forward into Builds)',
      type: 'text',
      rows: 3,
      description: 'e.g. v4 CSS-first engine is canonical, v3 JS config is rejected.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'decisionStatus',
      title: 'Decision Status',
      type: 'string',
      options: {
        list: [
          { title: '✅ Enforced Modern Standard (v4 Canonical)', value: 'enforced_modern' },
          { title: '🔒 Legacy Fallback Pinned (v3 Legacy)', value: 'legacy_fallback' },
          { title: '⏳ Migration In-Progress', value: 'migration_progress' },
        ],
      },
      initialValue: 'enforced_modern',
    }),
    defineField({
      name: 'migrationDiff',
      title: 'Migration Diff (+ / -)',
      type: 'text',
      rows: 8,
    }),
    defineField({
      name: 'verifiedBySanity',
      title: 'Verified in Sanity Knowledge Base',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'lastDecisionDate',
      title: 'Last Decision Timestamp',
      type: 'datetime',
    }),
  ],
})
