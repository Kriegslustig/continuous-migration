#!/usr/bin/env node

import { argv } from 'yargs'

import requireEnv from './utils/requireEnv'
import runMigration from './lib'

const optionalString = (x: unknown): void | string =>
  typeof x === 'string'
    ? x
    : undefined

const requireString = (x: unknown): string => {
  const optStr = optionalString(x)
  if (!optStr) throw new Error('Expected string, got something else')
  return optStr
}

runMigration({
  contentManagementToken: requireString(argv.contentManagementToken),
  spaceId: requireString(argv.spaceId),
  environment: requireString(argv.environment),
  migrationsDirectory: optionalString(argv.migrationsDirectory)
})
  .then((runMigrations) => {
    if (runMigrations.length === 0) {
      console.log('No migrations to be run')
    } else {
      console.log(`Ran migrations: ${runMigrations.join(', ')}`)
    }
  })
