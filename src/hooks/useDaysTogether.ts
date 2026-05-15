import { differenceInDays } from 'date-fns'
import { RELATIONSHIP_START } from '../types'

export function useDaysTogether(): number {
  return differenceInDays(new Date(), RELATIONSHIP_START)
}
