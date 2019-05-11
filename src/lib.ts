import { Migrations } from './models/migrations'
import mkMigrationState from './models/MigrationState'

const DEFAULT_DIRECTORY = 'migrations'

interface Options {
  contentManagementToken: string
  environment: string
  spaceId: string
  migrationsDirectory?: void | string
}

const runMigrations = async ({
  contentManagementToken,
  environment,
  spaceId,
  migrationsDirectory = DEFAULT_DIRECTORY,
}: Options) => {
  const migrationState = await mkMigrationState({
    managementAccessToken: contentManagementToken,
    environment,
    spaceId,
  })

  const migrations = new Migrations({ migrationsDirectory }, migrationState)

  return await migrations.run()
}

export default runMigrations
