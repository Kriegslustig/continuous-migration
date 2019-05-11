import * as path from 'path'
import { runMigration } from 'contentful-migration/built/bin/cli'

import { MigrationState } from '../MigrationState'

export class Migration {
  name: string

  constructor(
    public filePath: string,
    private migrationState: MigrationState
  ) {
    this.name = path.basename(filePath, '.js')
  }

  hasRun = async () => {
    return await this.migrationState.hasRun(this.name)
  }

  run = async () => {
    await runMigration({
      filePath: this.filePath,
      accessToken: this.migrationState.managementAccessToken,
      spaceId: this.migrationState.spaceId,
      environment: this.migrationState.environmentName,
      yes: true,
    })
    await this.registerRun()
  }

  private registerRun = async () => {
    return await this.migrationState.registerRun(this.name)
  }
}
