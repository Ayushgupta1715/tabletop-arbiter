import { type SchemaTypeDefinition } from 'sanity'
import { gameType } from './game'
import { gameRuleType } from './gameRule'
import { ruleErrataType } from './ruleErrata'
import { disputedScenarioType } from './disputedScenario'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [gameType, gameRuleType, ruleErrataType, disputedScenarioType],
}
