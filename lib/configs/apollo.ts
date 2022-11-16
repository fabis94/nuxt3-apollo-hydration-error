import { ApolloLink, InMemoryCache, split } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { createUploadLink } from 'apollo-upload-client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { OperationDefinitionNode, Kind } from 'graphql'
import { CookieRef } from '#app'
import { ApolloConfigResolver } from '../nuxt-modules/apollo/module'


const appVersion = (import.meta.env.SPECKLE_SERVER_VERSION as string) || 'unknown'
const appName = 'frontend-2'

async function createWsClient(params: {
  wsEndpoint: string
}): Promise<SubscriptionClient> {
  const { wsEndpoint } = params

  // WS IN SSR DOESN'T WORK CURRENTLY CAUSE OF SOME NUXT TRANSPILATION WEIRDNESS
  // SO DON'T RUN createWsClient in SSR
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const wsImplementation = process.server ? (await import('ws')).default : undefined
  return new SubscriptionClient(
    wsEndpoint,
    {
      reconnect: true,
      connectionParams: () => {
        return {}
      }
    },
    wsImplementation
  )
}

function createLink(params: {
  httpEndpoint: string
  wsClient?: SubscriptionClient
}): ApolloLink {
  const { httpEndpoint, wsClient } = params

  // Prepare links
  const httpLink = createUploadLink({
    uri: httpEndpoint
  })

  const authLink = setContext(
    (_, { headers }: { headers: Record<string, unknown> }) => {
      return {headers}
    }
  )

  let link = authLink.concat(httpLink)

  if (wsClient) {
    const wsLink = new WebSocketLink(wsClient)
    link = split(
      ({ query }) => {
        const definition = getMainDefinition(query) as OperationDefinitionNode
        const { kind, operation } = definition

        return kind === Kind.OPERATION_DEFINITION && operation === 'subscription'
      },
      wsLink,
      link
    )
  }

  return link
}

const defaultConfigResolver: ApolloConfigResolver = async () => {

  const httpEndpoint = `https://speckle.xyz/graphql`
  const wsEndpoint = httpEndpoint.replace('http', 'ws')

  const wsClient = process.client
    ? await createWsClient({ wsEndpoint })
    : undefined
  const link = createLink({ httpEndpoint, wsClient })

  return {
    cache: new InMemoryCache(),
    link,
    name: appName,
    version: appVersion
  }
}

export default defaultConfigResolver
