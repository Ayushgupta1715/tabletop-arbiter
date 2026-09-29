import { defineField, defineType } from 'sanity'

export const gameType = defineType({
  name: 'game',
  title: 'Board Game / TCG Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Game Title',
      type: 'string',
      description: 'e.g. Magic: The Gathering, Warhammer 40,000, Catan, Gloomhaven',
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
      name: 'publisher',
      title: 'Publisher / Rules Authority',
      type: 'string',
      description: 'e.g. Wizards of the Coast, Games Workshop, Catan Studio, Cephalofair',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'currentEdition',
      title: 'Current Official Edition',
      type: 'string',
      description: 'e.g. 2024 Comprehensive Rules, 10th Edition, 6th Edition',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Trading Card Game (TCG)', value: 'tcg' },
          { title: 'Miniature Wargame', value: 'wargame' },
          { title: 'Strategy Board Game', value: 'boardgame' },
          { title: 'Dungeon Crawler / Co-op', value: 'coop_rpg' },
          { title: 'Tabletop Role-Playing (TTRPG)', value: 'ttrpg' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tournamentCircuit',
      title: 'Official Tournament Circuit',
      type: 'string',
      description: 'e.g. Pro Tour, ITC (Independent Tournament Circuit), Catan World Championship',
    }),
    defineField({
      name: 'iconName',
      title: 'Icon Name / Badge',
      type: 'string',
      description: 'Lucide icon identifier (e.g. Swords, Shield, Dice5, Skull, Scroll)',
    }),
    defineField({
      name: 'description',
      title: 'Overview',
      type: 'text',
      rows: 3,
    }),
  ],
})
