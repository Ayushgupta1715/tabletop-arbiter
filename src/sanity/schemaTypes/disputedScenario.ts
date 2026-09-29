import { defineField, defineType } from 'sanity'

export const disputedScenarioType = defineType({
  name: 'disputedScenario',
  title: 'Tournament Disputed Scenario Benchmark',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Dispute Heading',
      type: 'string',
      description: 'e.g. Ward Ability vs Uncounterable Spells, Deep Strike within 9" of Infiltrators',
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
      name: 'game',
      title: 'Game',
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
      name: 'stakesLevel',
      title: 'Competitive Stakes',
      type: 'string',
      options: {
        list: [
          { title: '🥇 World Championship / Pro Tour Finals', value: 'finals' },
          { title: '⚔️ Regional Qualifier / High Stakes Table', value: 'regional' },
          { title: '🎲 Game Night Table Argument (Friendship-Ending)', value: 'casual_dispute' },
        ],
      },
    }),
    defineField({
      name: 'scenarioDescription',
      title: 'Tabletop Incident Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'playerAClaim',
      title: 'Player A Argument',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'playerBClaim',
      title: 'Player B Argument',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'naiveLLMAnswer',
      title: 'Naive Vector RAG Output (Hallucination / Error)',
      type: 'text',
      rows: 3,
      description: 'What a generic embedding bot or vector RAG answers due to lack of graph-dereferenced errata.',
    }),
    defineField({
      name: 'groundedArbiterRuling',
      title: 'Grounded Sanity Arbiter Verdict',
      type: 'text',
      rows: 4,
      description: 'Exact authoritative verdict derived from Sanity Content Lake.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'winnerResolution',
      title: 'Official Verdict Winner',
      type: 'string',
      options: {
        list: [
          { title: 'Player A is Upheld (Player B Overruled)', value: 'player_a' },
          { title: 'Player B is Upheld (Player A Overruled)', value: 'player_b' },
          { title: 'Both Partially Correct / Nuanced Game State Reset', value: 'split' },
        ],
      },
    }),
    defineField({
      name: 'governingRule',
      title: 'Base Rule Reference',
      type: 'reference',
      to: [{ type: 'gameRule' }],
    }),
    defineField({
      name: 'governingErrata',
      title: 'Overriding Errata Reference',
      type: 'reference',
      to: [{ type: 'ruleErrata' }],
    }),
  ],
})
