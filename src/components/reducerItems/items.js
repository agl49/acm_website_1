import constants from "../constants";


//what does this do?
//Seems to basically make sure that the next item 
//does not violate the limit based off of which case it is.
export const activeIndexReducer = (state, action) => {
  const { limit, itemsToScroll, type } = action;
  switch (type) {
    case constants.NEXT_ITEM: {
      let optimisticNextItem = state + itemsToScroll;
      const nextItem = limit >= optimisticNextItem ? optimisticNextItem : limit;
      return nextItem; 
    }  

    case constants.PREV_ITEM: {
      let optimisticPrevItem = state - itemsToScroll;
      const prevItem = optimisticPrevItem >= limit ? optimisticPrevItem : limit;
      return prevItem;
    }

    default:
      return state;
  }
}; 



