import { defineField, defineType } from 'sanity'

export const libraryProfileType = defineType({
  name: 'libraryProfile',
  title: 'Library & Framework Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Library Name',
      type: 'string',
      description: 'e.g. Tailwind CSS, React Router, Next.js, Zod',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fromVersion',
      title: 'Previous / Legacy Version',
      type: 'string',
      description: 'e.g. v3.4',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'toVersion',
      title: 'Current / Modern Version',
      type: 'string',
      description: 'e.g. v4.0',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'majorShiftSummary',
      title: 'Core Architectural Shift',
      type: 'text',
      rows: 3,
      description: 'e.g. JavaScript-based configuration replaced with CSS-first Rust engine (@theme directive)',
    }),
    defineField({
      name: 'officialDocsUrl',
      title: 'Modern Documentation URL',
      type: 'url',
    }),
    defineField({
      name: 'migrationGuideUrl',
      title: 'Upgrade & Migration Guide URL',
      type: 'url',
    }),
    defineField({
      name: 'badgeColor',
      title: 'Accent Color',
      type: 'string',
      description: 'Hex or Tailwind color indicator (e.g. #06b6d4, #f43f5e, #6366f1)',
    }),
  ],
})
