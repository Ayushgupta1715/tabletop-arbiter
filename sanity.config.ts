'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './src/sanity/schemaTypes'
import { apiVersion, dataset, projectId } from './src/sanity/env'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'TableTop Arbiter — Official Rules & Tournament Errata Lake',
  schema,
  plugins: [
    structureTool({
      title: 'Tournament Rules Studio',
    }),
  ],
})
