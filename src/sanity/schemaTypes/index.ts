import { type SchemaTypeDefinition } from 'sanity'
import { libraryProfileType } from './libraryProfile'
import { versionDriftRecordType } from './versionDriftRecord'
import { knowledgeSourceType } from './knowledgeSource'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [libraryProfileType, versionDriftRecordType, knowledgeSourceType],
}
