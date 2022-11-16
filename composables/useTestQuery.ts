import { useQuery } from '@vue/apollo-composable'
import {gql} from '@apollo/client/core'

export const testQuery = gql`
  query test {
    _
  }
`

export default function () {
  const { result } = useQuery(testQuery)

  const apiResult = computed(() =>
    result.value ? result.value._ : undefined
  )

  return { apiResult  }
}