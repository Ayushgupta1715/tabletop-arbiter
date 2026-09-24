import { defineField, defineType } from 'sanity'

export const knowledgeSourceType = defineType({
  name: 'knowledgeSource',
  title: 'Sanity Knowledge Source & Document Corpus',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Document / Source Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'libraryName',
      title: 'Target Framework / Library',
      type: 'string',
      description: 'e.g. Tailwind CSS, React Router, Next.js',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sourceType',
      title: 'Source Ingestion Category',
      type: 'string',
      options: {
        list: [
          { title: '📘 Official Modern Documentation (v4/v7/v15)', value: 'official_modern' },
          { title: '📜 Official Legacy Documentation Archive (v3/v6/v14)', value: 'official_legacy' },
          { title: '🚀 Migration & Upgrade Guide (Authoritative)', value: 'migration_guide' },
          { title: '📦 GitHub Release Notes & Adam Wathan RFCs', value: 'github_release' },
          { title: '⚠️ Popular Outdated Tutorial (2020-2023 Medium/FreeCodeCamp)', value: 'outdated_tutorial' },
          { title: '💬 StackOverflow Accepted Answer (Stale High-Rank)', value: 'stackoverflow_stale' },
          { title: '💡 GitHub Discussions / Issue Trackers', value: 'github_discussion' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'versionTarget',
      title: 'Version Target',
      type: 'string',
      description: 'e.g. v4.0 Current, v3.4 Legacy, v7.0 Modern, v6.x Legacy',
    }),
    defineField({
      name: 'temporalFreshness',
      title: 'Temporal Freshness Status',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Canonical Current (Enforced)', value: 'canonical_current' },
          { title: '🟡 Deprecated Legacy (Reference Only)', value: 'deprecated_legacy' },
          { title: '🔴 Outdated Pitfall (Causes Hallucinations)', value: 'outdated_pitfall' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedYear',
      title: 'Publication Year',
      type: 'number',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL / Reference',
      type: 'url',
    }),
    defineField({
      name: 'authorOrDomain',
      title: 'Author / Domain Reference',
      type: 'string',
      description: 'e.g. tailwindcss.com, freecodecamp.org, stackoverflow.com, github.com',
    }),
    defineField({
      name: 'summary',
      title: 'Document Content Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'contradictionNotes',
      title: 'Contradiction & Drift Notes',
      type: 'text',
      rows: 3,
      description: 'Explains what breaking changes or outdated advice this source represents.',
    }),
    defineField({
      name: 'status',
      title: 'Sanity Ingestion Status',
      type: 'string',
      options: {
        list: [
          { title: 'Indexed & Grounded', value: 'indexed' },
          { title: 'Drift Flagged', value: 'drift_flagged' },
          { title: 'Deprecated Archive', value: 'deprecated' },
        ],
      },
      initialValue: 'indexed',
    }),
  ],
})
