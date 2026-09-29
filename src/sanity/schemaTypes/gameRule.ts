import { defineField, defineType } from 'sanity'

export const gameRuleType = defineType({
  name: 'gameRule',
  title: 'Official Game Rule (Base Rulebook)',
  type: 'document',
  fields: [
    defineField({
      name: 'ruleTitle',
      title: 'Rule Heading / Topic',
      type: 'string',
      description: 'e.g. Ward Keyword Mechanic, Deep Strike Reserves Arrival, Building Roads Through Settlements',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sectionCode',
      title: 'Rulebook Section / Index Code',
      type: 'string',
      description: 'e.g. CR 702.21a, Sec 4.1.2, Page 43 Rule 3',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'game',
      title: 'Target Game',
      type: 'reference',
      to: [{ type: 'game' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gameName',
      title: 'Game Name (Cached)',
      type: 'string',
    }),
    defineField({
      name: 'ruleCategory',
      title: 'Rule Category',
      type: 'string',
      options: {
        list: [
          { title: 'Turn Phases & Timing', value: 'timing' },
          { title: 'Combat & Damage Resolution', value: 'combat' },
          { title: 'Targeting & Line of Sight', value: 'targeting_los' },
          { title: 'Resource & Trading Restrictions', value: 'resources' },
          { title: 'Action Economy & Spell Slots', value: 'action_economy' },
          { title: 'Movement & Positioning', value: 'movement' },
        ],
      },
    }),
    defineField({
      name: 'originalRulebookEdition',
      title: 'Original Rulebook Edition',
      type: 'string',
      description: 'e.g. 2021 Core Rules, 10th Ed Launch Codex, 2014 Player\'s Handbook',
    }),
    defineField({
      name: 'officialRawText',
      title: 'Official Rulebook Text',
      type: 'text',
      rows: 4,
      description: 'Exact text verbatim from the printed rulebook.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'apparentInterpretation',
      title: 'Common / Naive Interpretation (What Vector RAG Retrieves)',
      type: 'text',
      rows: 3,
      description: 'Why a basic embedding model thinks this rule stands without knowing subsequent errata.',
    }),
    defineField({
      name: 'isSuperseded',
      title: 'Has Active Errata / Overrides?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
