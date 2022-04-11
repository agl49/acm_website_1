import { NEXT_ITEM, PREV_ITEM } from "../constants";

//I think we are exporting an function that just returns a function 
//that assigns the params into the object that is returned
export const nextItemAction = (limit, itemsToScroll) => ({
  type: NEXT_ITEM,
  limit,
  itemsToScroll
});

export const prevItemACtion = (limit, itemsToScroll) => ({
  type: PREV_ITEM,
  limit,
  itemsToScroll
});

