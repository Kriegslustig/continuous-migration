import * as path from 'path'

import * as fs from '../../utils/fs'
import { MigrationState } from '../migrationState'
import { Migration } from '../migration'

interface Options {
  migrationsDirectory: string
}

export class Migrations {
  constructor(
    private options: Options,
    private migrationState: MigrationState
  ) { }

  run = async () => {
    const migrations = await fs.readdir(this.options.migrationsDirectory)

    const runMigrations: Array<string> = []
    for (const migrationFile of migrations) {
      const migrationPath = path.join(
        process.cwd(),
        this.options.migrationsDirectory,
        migrationFile
      )

      const migration = new Migration(migrationPath, this.migrationState)

      if (!(await migration.hasRun())) {
        await migration.run()
        runMigrations.push(migration.name)
      }
    }

    return runMigrations
  }
}
