import { createClient } from 'contentful-management'

interface Options {
  managementAccessToken: string
  environment: string
  spaceId: string
}

const STATE_CONTENT_TYPE = 'continuousDeliveryState'

type Environment = any
type ManagementClient = any
type StateEntry = any
type Space = any

export class MigrationState {
  client: ManagementClient
  environment: Environment
  space: Space
  environmentName: string
  managementAccessToken: string
  spaceId: string
  defaultLocale: string
  private stateEntries: Array<StateEntry> = []

  constructor(options: Options) {
    this.client = createClient({
      accessToken: options.managementAccessToken,
      environemntId: options.environment,
    })

    this.managementAccessToken = options.managementAccessToken
    this.spaceId = options.spaceId
    this.environmentName = options.environment
    this.defaultLocale = 'en-US'
  }

  initialize = async () => {
    this.space = await this.client.getSpace(this.spaceId)
    this.environment = await this.space.getEnvironment(this.environmentName)

    const { items: locales } = await this.environment.getLocales()
    const defaultLocale = locales.find((locale: { default: boolean }) => locale.default)
    if (defaultLocale) {
      this.defaultLocale = defaultLocale.code
    }

    if (await this.hasContentType()) {
      const { items } = await this.environment.getEntries({
        content_type: STATE_CONTENT_TYPE
      })
      this.stateEntries = items
    } else {
      await this.createState()
    }
  }

  hasRun = (name: string) => {
    const migration = this.stateEntries.find((entry) => {
      const entryName =
        entry.fields.name[this.defaultLocale] ||
        entry.fields.name
      return entryName === name
    })

    return migration
  }

  registerRun = async (name: string) => {
    const entry = await this.environment.createEntry(STATE_CONTENT_TYPE, {
      fields: { name: { [this.defaultLocale]: name } },
    })
    await entry.publish()
  }

  private hasContentType = async () => {
    try {
      await this.environment.getContentType(STATE_CONTENT_TYPE)
      return true
    } catch(e) {
      return false
    }
  }

  private createState = async () => {
    const contentType = await this.environment.createContentTypeWithId(
      STATE_CONTENT_TYPE,
      migrationStateContentType
    )
    await contentType.publish()
  }
}

const migrationStateContentType = {
  name: 'Continuous Migration State Entity',
  displayField: 'name',
  fields: [{
    id: 'name',
    name: 'Migration Name',
    required: true,
    type: 'Symbol',
  }],
}

const mkMigrationState = async (options: Options): Promise<MigrationState> => {
  const migrationState = new MigrationState(options)
  await migrationState.initialize()
  return migrationState
}

export default mkMigrationState
