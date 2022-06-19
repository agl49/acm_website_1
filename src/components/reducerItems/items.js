import constants from '../constants'

// Note: not used

// what does this do?
// Seems to basically make sure that the next item
// does not violate the limit based off of which case it is.
export const activeIndexReducer = (state, action) => {
  const { limit, itemsToScroll, type } = action
  switch (type) {
    case constants.NEXT_ITEM: {
      const optimisticNextItem = state + itemsToScroll
      const nextItem = limit >= optimisticNextItem ? optimisticNextItem : limit
      return nextItem
    }

    case constants.PREV_ITEM: {
      const optimisticPrevItem = state - itemsToScroll
      const prevItem = optimisticPrevItem >= limit ? optimisticPrevItem : limit
      return prevItem
    }

    default:
      return state
  }
}
