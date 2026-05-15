import { differenceInDays } from 'date-fns'
import { RELATIONSHIP_START } from '../types'

export function useDaysTogether(): number {
  const result = differenceInDays(new Date(), RELATIONSHIP_START)
  console.log('days:', result, 'start:', RELATIONSHIP_START, 'now:', new Date())
  return result
}