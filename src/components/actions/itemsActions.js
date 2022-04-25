import constants from "../constants";

//I think we are exporting an function that just returns a function 
//that assigns the params into the object that is returned
const nextItemAction = (limit, itemsToScroll) => ({
  type: constants.NEXT_ITEM,
  limit,
  itemsToScroll
});

const prevItemAction = (limit, itemsToScroll) => ({
  type: constants.PREV_ITEM,
  limit,
  itemsToScroll
});

export { nextItemAction, prevItemAction };