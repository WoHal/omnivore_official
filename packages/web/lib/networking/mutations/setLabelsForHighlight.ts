import { gql } from 'graphql-request'
import { Label, labelFragment } from '../fragments/labelFragment'
import { gqlFetcher } from '../networkHelpers'

export type SetLabelsForHighlightResult = {
  setLabelsForHighlight: SetLabelsForHighlight
  errorCodes?: unknown[]
}

type SetLabelsForHighlight = {
  labels: Label[]
}

export async function setLabelsForHighlight(
  highlightId: string,
  labelIds: string[]
): Promise<Label[] | undefined> {
  const mutation = gql`
    mutation SetLabelsForHighlight($input: SetLabelsForHighlightInput!) {
      setLabelsForHighlight(input: $input) {
        ... on SetLabelsSuccess {
          labels {
            ...LabelFields
          }
        }
        ... on SetLabelsError {
          errorCodes
        }
      }
    }
    ${labelFragment}
  `

  try {
    const data = (await gqlFetcher(mutation, {
      input: { highlightId, labelIds },
    })) as SetLabelsForHighlightResult
    return data.errorCodes ? undefined : data.setLabelsForHighlight.labels
  } catch (error) {
    console.log('setLabelsForHighlightInput error', error)
    return undefined
  }
}
