//A lot of the logic for this was extracted from the following:
//https://github.com/sag1v/react-elastic-carousel
//Package had too much logic for what we wanted so this is a simplified version.
//Also, we convert the class componets used to functional components that use hooks as needed.
import React, {Children} from "react";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill";
import Only from "react-only-when";
import Slider from "../slider/slider.js";
import data from "./carouselData.js";
import { activeIndexReducer } from "../reducerItems/items";
import { nextItemAction, prevItemAction } from "../actions/itemsActions";
import consts from "../constants";
import styled from "./pCarousel.module.css";

//following import for debugging
import Card from "../card/card.js";

import Webpage from "../../images/webpage.png";
import Pathfinder from "../../images/pathFinding.png";
import constants from "../constants";

// onContainerResize
// Params/Props: sliderContainerWidth,
//               prevSliderContainerWidth,
//               transitionMs,
//               setTransitionMs,
//               activeIndex,
//               setActiveIndex 
//               childAmount
//               sliderPosition,
//               setSliderPosition,
//               rest 
function onContainerResize(sliderContainerWidth,
                           prevSliderContainerWidth,
                           setSliderContainerWidth,
                           transitionMs, 
                           setTransitionMs,
                           activeIndex,
                           setActiveIndex,
                           childAmount,
                           sliderPosition, //May not need
                           setSliderPosition,
                           rest) {
  // const { width: newSliderContainerWidth } = sliderContainerNode.contentRect;
  const newSliderContainerWidth = sliderContainerWidth;

  const outerSpacing = getDerivedPropsFromBreakPoint(rest); 

  const containerWidth = newSliderContainerWidth - outerSpacing * 2;
  
  //When would this every run?
  //I don't understand why this will not always run in the original
  //code. It seemed like it would run all the time since it will
  //compare the state to itsel, not the old one. Either I am missing
  //something or this is a harmless glitch in the og code. Our version
  //is adujsted for what I think the intent was.
  if (prevSliderContainerWidth === newSliderContainerWidth) {
    //if width doesn't need to change, return
    return;
  }

  setSliderContainerWidth(containerWidth);
  setTransitionMs(0);

  const {
    // onResize, May need? Naw, we'll cut this feature.
    itemsToShow
    //children //PROBLEM: Children may not be there when this code runs.
  } = getDerivedPropsFromBreakPoint(rest);

  const childrenLength = childAmount || 1; //Works?

  const maxItemsToShow = Math.min(childrenLength, itemsToShow);
  const endLimit = childrenLength - maxItemsToShow;

  if (activeIndex > endLimit) {
    setActiveIndex(endLimit);
  }

  updateSliderPosition(activeIndex,
                       setActiveIndex,
                       transitionMs,
                       setTransitionMs,
                       childAmount,
                       sliderContainerWidth,
                       setSliderPosition,
                       rest);                
}

//params: childHeight
//        setChildHeight <-- didn't seem to need so removed
//        activeIndex
//        setActiveIndex
//        transitionMs
//        setTransitionMs
//        childAmount
//        sliderContainerWidth
//        setSliderPosition
//        rest
function updateSliderPosition(activeIndex,
                              setActiveIndex,
                              transitionMs,
                              setTransitionMs,
                              childAmount,
                              sliderContainerWidth,
                              setSliderPosition,
                              rest) {
  const { itemsToShow } = getDerivedPropsFromBreakPoint(rest);

  const childWidth = calculateChildWidth(sliderContainerWidth, 
                                         childAmount, 
                                         rest); 
  const hiddenSlots = childAmount - itemsToShow;
  let moveBy = activeIndex * -1;
  const emptySlots = itemsToShow - (childAmount - activeIndex);
  if (emptySlots > 0 && hiddenSlots > 0) {
    moveBy = emptySlots + activeIndex * -1;
  }
  let sliderPosition = childWidth * moveBy;
  const newActiveIndex = emptySlots > 0 ? activeIndex - emptySlots : activeIndex;

  //From OG code
  //go back from 0 ms to whatever is set by the user
  //We were at 0ms because we wanted to disable animation on resize
  //see https://github.com/sag1v/react-elastic-carousel/issues/94
  //Issue seems closed...
  //Hmm lets see if this will work...
  windows.requestAnimationFrame(() => {
    setTransitionMs(transitionMs);
  });
  setActiveIndex(newActiveIndex < 0 ? 0 : newActiveIndex);
  setSliderPosition(sliderPosition);
}

//rest:  sliderContainerWidth,
//       setSliderContainerWidth,
//       breakPoints,
//       otherProps <--props passed into pCarousel itself
function getDerivedPropsFromBreakPoint(rest) {
  const { breakPoints, sliderContainerWidth, setSliderContainerWidth, ...restOfProps } = rest;

  // default breakpoint from individual props
  let currentBreakPoint;

  // if breakpoints were added as props override the individual props

  if (breakPoints && breakPoints.length > 0) {
    currentBreakPoint = breakPoints
      .slice()  // no mutations
      .reverse() // so we can find last match
      .find(bp => bp.width <= sliderContainerWidth); //Not exactly sure how this sytax works
      
    if (!currentBreakPoint) {
      /*  Comment from repo
          in case we don't have a lower width than sliderContainerWdith
          this mostly happens in initilization when sliderContainerWidth is 0
      */
      currentBreakPoint = breakPoints[0];
    }
  }
  // merge direct props with current breakpoint props
  return { ...restOfProps, ...currentBreakPoint };
}

//This needs to pass both props and state and state functions
//Here
//Params: nextItemId
//        childAmount
//        activeIndex
//        rest 
function goTo(nextItemId, childAmount, activeIndex, rest) {
  const { itemsToShow } = getDerivedPropsFromBreakPoint(rest);
  const childrenLength = childAmount;
  let safeNextItemId = Math.max(0, nextItemId); // don't allow negative numbers
  const isPrev = activeIndex > safeNextItemId;
  const nextAvailableItem = getNextItemIndex(activeIndex, isPrev, childAmount, rest); //right? 
  const noChange = nextAvailableItem === activeIndex; //bool
  const outOfBoundary = safeNextItemId + itemsToShow >= childrenLength;
  if (noChange) {
    return;
  } 
  if (outOfBoundary) {
    // Either go to last index (respect itemsToShow) or 0 index if we can't fill the slider
    safeNextItemId = Math.max(0, childrenLength - itemsToShow);
  }
  let direction = constants.NEXT;
  //                           need to pass stuff in here
  let positionEndCb = onNextEnd(); //<-- function
  if (isPrev) {
    direction = constants.PREV;
    positionEndCb = onPrevEnd(); // add right props to this
  }
  const stateUpdater = generatePositionUpdater(
    direction,
    safeNextItemId,
    {
      transitioning: true
    }
  ); 
  //call stateUpdeater?
  //state updater needs the needed function to update the state.
  //then we run
  pipe(
    //why is pipe needed
    //functions not implemented
    updateActivePage(),
    onSliderTransitionEnd(positionEndCb)
  );
}

//What does fn mean?
function onSliderTransitionEnd(fn) {
  //I don't know when this slider property is created
  // in the original. Not sure what exactly it is.
  //slider.addEventListener("transitionend", fn);
}

function updateActivePage(props) {
  //this function updates the state
  const { itemsToShow, children } = getDerivedPropsFromBreakPoint(); //pass the right props
  const { activeIndex, activePage } = props;
  const numOfPages = getNumOfPages();
  //We know before hand how many cards we have so we don't need to use this
  //method of getting how many children we need. Should we keep it this way or
  //change it?
  const childrenLength = Children.toArray(childrenLength).length;
  const inRangeItemsToShow = Math.min(childrenLength, itemsToShow);
  //watch out from 0 (so we won't divide by zero)
  const safeItemsToShow = Math.max(inRangeItemsToShow, 1);
  const newActivePage = Math.ceil(activeIndex / safeItemsToShow);
  const inRangeActivePageIndex = Math.min(numOfPages - 1, newActivePage);
  if (activePage !== inRangeActivePageIndex) {
    //This here is the state that needs to change since in the
    //original it is the modified state that is returned so pass in
    //the needed function to change the state here and use it.
    return { activePage: inRangeActivePageIndex };
  }
}

//What exactly does this do?
function pipe(...fns) {
  return (x) => fns.reduce((v, f) => f(v), x);
}

function generatePositionUpdater(direction, 
                                 nextItemId,
                                 rest) {
  //not sure why it is like this
  (state) => {
    const { sliderPosition, childHeight, activeIndex } = state;
    const childWidth = calculateChildWidth(); //<-- function
    
    let newSliderPosition = 0;
    const childSize = childWidth;
    if (direction === constants.NEXT) {
      newSliderPosition = 
        sliderPosition - childSize * (nextItemId - activeIndex);
    } else {
      newSliderPosition = 
        sliderPosition + childSize * (activeIndex - nextItemId);
    }

    return {
      sliderPosition: newSliderPosition,
      activeIndex: nextItemId,
      swipedSliderPosition: 0,
      isSwiping: false,
      ...rest
    };
  };
}

//Params: sliderContainerWidth
//        childAmount
//        rest
function calculateChildWidth(sliderContainerWidth, childAmount, rest) {
  // const { sliderContainerWidth } = props;
  const {
    itemsToShow,
    showEmptySlots
  } = getDerivedPropsFromBreakPoint(rest);

  /*
  From repo; remove or reword or reference og before publish
  based on slider container's width, get num of items to show
  and calculate child's width (and update it in state)
  */
  const childrenLength = childAmount || 1;

  let childWidth = 0;

  //again from repo
  //When "showEmptySlots" is false
  //We use Math.min because we don't want to make the child smaller
  //if the number of children is smaller than itemsToShow.
  //(Because we do not want "empty slots")
  childWidth = sliderContainerWidth / 
    (showEmptySlots ? itemsToShow : Math.min(childrenLength, itemsToShow));
  return childWidth;
}

function onPrevEnd(props) {
  const { onPrevEnd, onChange } = getDerivedPropsFromBreakPoint(); // add props
  const { activeIndex, activePage } = props;
  const nextItemObj = convertChildToCbObj(activeIndex);
  //removeSliderTansistionHook(onPrevEnd);
  //setTransitioning(false);
  onChange && onChange(nextItemObj, activePage);
  onPrevEnd(nextItemObj, activePage); 
}

function onNextEnd(props) {
  //                                                            add the need props here
  const { onNextEnd, onChange } = getDerivedPropsFromBreakPoint();
  const { activeIndex, activePage } = props;
  const nextItemObj = convertChildToCbObj(activeIndex);
  //do we need this?
  //removeSliderTransitionHook(onNextEnd);
  //We don't have this state var created, what is it used for?
  //props.setTransitioning(false)
  //onChange is a passed function but what should it do?
  onChange && onChange(nextItemObj, activePage);
  onNextEnd(nextItemObj, activePage);
}

function convertChildToCbObj(index) {
  const { children } = getDerivedPropsFromBreakPoint();
  // support decimal itemsToShow
  const roundedIdx = Math.round(index);
  const child = Children.toArray(children)[roundedIdx];
  return { item: child.props, index: roundedIdx };
}

//TODO, not just here but add back itemsToScroll
//We were called from goTo
//Params: currentIndex
//        getPrev
//        childAmount
//        rest
function getNextItemIndex(currentIndex, getPrev, childAmount, rest) {
  const { itemsToShow, itemsToScroll } = getDerivedPropsFromBreakPoint(rest);
  const childrenLength = childAmount || 1;
  const notEnoughItemsToShow = itemsToShow > childrenLength;
  let limit = getPrev ? 0 : childrenLength - itemsToShow;
  
  if (notEnoughItemsToShow) {
    limit = 0; // basically don't move it 
  }
  const nextAction = getPrev 
    ? prevItemAction(0, itemsToScroll)                           //imported from itemsActions
    : nextItemAction(limit, itemsToScroll);                      //<-
  const nextItem = activeIndexReducer(currentIndex, nextAction); //<- 
  return nextItem;
}

function getNumOfPages() {
  const { children, itemsToShow } = getDerivedPropsFromBreakPoint(); //add the right props here
  const childrenLength = Children.toArray(children).length;
  const safeItemsToShow = Math.max(itemsToShow, 1);
  const numOfPages = Math.ceil(childrenLength / safeItemsToShow);
  return numOfPages || 1;
}

//This style is ugly, find a better way. Or see how standardjs changes it
function calcLeft( {isRTL,
                    isSwiping,
                    swipedSliderPosition,
                    sliderPosition} ) {
  if (isRTL) {
    return "auto";
  } else {
    return `${isSwiping ? swipedSliderPosition : sliderPosition }px`;
  }
}

function calcRight( {isRTL,
                     isSwiping,
                     swipedSliderPosition,
                     sliderPosition} ) {
  if (isRTL) {
    return `${isSwiping ? swipedSliderPosition : sliderPosition}px`;
  } else {
    return "auto";
  }
}

function calcTop( {isSwiping,
                   swipedSliderPosition,
                   sliderPosition} ) {
  return `${isSwiping ? swipedSliderPosition : sliderPosition}px`;
}

function calcTransition( {isSwiping, 
                          transitionMs,
                          easing,
                          tiltEasing} ) {
  const duration = isSwiping ? 0 : transitionMs;
  const effectiveEasing = isSwiping ? tiltEasing : easing;
  return `all ${duration}ms ${effectiveEasing}`;
}

function onNextStart(options, otherProps, activeIndex, sliderPosition, setIsSwiped, setSwipedSliderPosition) {
  //this is for custom functions to run when clicking the button
  const { onNextStart } = getDerivedPropsFromBreakPoint(otherProps); //is this implemented right
  const nextItemObj = getNextItemObj(); //did we implment this?
  const prevItemObj = convertChildToCbObj(activeIndex);
  onNextStart(prevItemObj, nextItemObj); 
  slideNext(options, otherProps, activeIndex, sliderPosition, setIsSwiped, setSwipedSliderPosition);
}

function slideNext(options = {}, otherProps, activeIndex, sliderPosition, setIsSwiped, setSwipedSliderPosition) {
  const { skipTilt } = options;
  const { enableTilt } = getDerivedPropsFromBreakPoint(otherProps);
  const nextItem = getNextItemIndex(activeIndex, false);
  if (activeIndex !== nextItem) { 
    goTo(nextItem); //Add the right params
  } else if (enableTilt && !skipTilt) {
    tiltMovement(sliderPosition, 20, 150, setIsSwiped, setSwipedSliderPosition); 
  }
}

function onPrevStart(options, otherProps, activeIndex, setIsSwiped, setSwipedSliderPosition) {
  //we going to include this feature?
  const { onPrevStart } = getDerivedPropsFromBreakPoint(otherProps);
  const nextItemObject = getNdexItemObj(true);
  const prevItemObject = convertChildToCbObj(activeIndex);
  onPrevStart(prevItemObject, nextItemObject);
  slidePrev(options, setIsSwiped, setSwipedSliderPosition);
}

function slidePrev(options = {}, otherProps, activeIndex, setIsSwiped, setSwipedSliderPosition) {
  const { skipTilt } = options;
  const { enableTilt } = getDerivedPropsFromBreakPoint(otherProps);
  const prevItem = getNextItemIndex(activeIndex, true);
  if (activeIndex !== prevItem) {
    goTo(prevItem);
  } else if (enableTilt && !skipTilt) {
    tiltMovement(0, -20, 150, setIsSwiped, setSwipedSliderPosition);
  }
}

function tiltMovement(position, distance = 20, duration = 150, setIsSwiped, setSwipedSliderPosition) {
  setIsSwiped(true);
  setSwipedSliderPosition(position - distance);
  setTimeout(() => {
    setIsSwiped(false);
    setSwipedSliderPosition(0);
  }, duration);
}

//You need to test this componet on different input data. Also, you should change how
//we inject the data into this componet for future reuse.
function PCarousel(props) {
  //Test input to test out card look 
  // test input invalid
  const testData = {
      name: "testName",
      img: Webpage, 
      link: "http://github.com/agl49/techsGiving"
  };

  const image2 = {
    name: "testName2",
    img: Pathfinder, 
    link: "http://github.com/agl49/"
  };

  const testDescription = "odijfaoijcoidfkldjoicjaoisdjf\n\
                           jldkjfaldskjfoasidfjlskajdfkl\n\
                           dsjdkfjalskdjfkldsjflakjksdjf\n\
                           kjlaskdjflaksjdflkasdjflksjdl\n\
                           jkldsjaflkdsjflksjflksdjflasd\n\
                           jalskdjflaksdjflksadjflaksjdf";
  //End of test input

  //from https://stackoverflow.com/questions/53254017/react-hooks-and-component-lifecycle-equivalent
  const isFirstUpdate = React.useRef(true); 
  const breakPoints = props.breakPoints;

  //filter out props you don't need here...
  //Problem here with below, if placed after [], call will use wrong item.
  const { initialTransitionMs, initialActiveIndex, ...rest } = props; 

  //sets initial childrenLength, change this to state?
  const initalChildrenAmount = data.length;
  const [childAmount, setChildAmount] = React.useState(initalChildrenAmount);
  const [sliderPosition, setSliderPosition] = React.useState(0);
  const [swipedSliderPosition, setSwipedSliderPosition] = React.useState(0);
  const [sliderContainerWidth, setSliderContainerWidth] = React.useState(0); 
  const [transitionMs, setTransitionMs] = React.useState(initialTransitionMs);
  const [activeIndex, setActiveIndex] = React.useState(initialActiveIndex);
  const [rootHeight, setRootHeight] = React.useState("100%"); //need to set this to be the size
                                                         //of the card. seems that once the thing
                                                         //is made, we can call .contentRect on it
  const prevChildrenLength = childAmount;
  const prevSliderContainerWidth = sliderContainerWidth;
  
  React.useEffect(() => {                                
    if (isFirstUpdate.current) {
      isFirstUpdate.current = false;
      return;
    }

    onContainerResize(sliderContainerWidth,
                      prevSliderContainerWidth,
                      setSliderContainerWidth,
                      transitionMs, 
                      setTransitionMs,
                      activeIndex,
                      setActiveIndex,
                      childAmount,
                      sliderPosition,
                      setSliderPosition,
                      rest);    

    if (prevChildrenLength !== childAmount) {
      const {
        itemsToShow: calculateItemsToShow
      } = getDerivedPropsFromBreakPoint(rest);
      // From repo
      // number of items is reduced (we don't care if number of items is increased)
      // we need to check if our current index is not out of boundaries
      // we need to include itemsToShow so we can fill up the slots
      const lastIndex = currentChildrenLength - 1;
      const isOutOfRange = activeIndex + calculateItemsToShow > lastIndex;
      if (isOutOfRange) {
        // we are out of boundaries, go "back" to last item of the last (respect itemsToShow)
        goTo(Math.max(0, currentChildrenLength - calculateItemsToShow),
             childAmount,
             activeIndex,
             rest);
      }

      prevSliderContainerWidth = sliderContainerWidth;
      prevChildrenLength = childAmount;
    }
  }, [breakPoints, childAmount, itemsToScroll, itemsToShow, sliderContainerWidth]);

  const {
    className,
    style,
    itemsToShow,
    itemsToScroll,
    isRTL,
    easing,
    tiltEasing,
    children,      //We have conflicting was of accessing the children components (the cards)
    focusOnSelect, //we have our way of creating them, which we saw from the other tutorial,
    autoTabIndexVisibleItems, //and then there is the children way which is not implemented correctly.
    itemPosition,             //we only need one way so... 
    itemPadding,
    outerSpacing,
    showArrows,
    disableArrowsOnEnd,
    preventDefaultTouchmoveEvent,
    renderArrow,
  } = getDerivedPropsFromBreakPoint(rest); 

  const childWidth = calculateChildWidth(); //pass the right props
  const numOfPages = getNumOfPages(); //need this? 

  let body = getComputedStyle(document.body);
  let dir = string(body.getPropertyValue("--direction"));
  dir = dir.trim();

  if (isRTL !== dir) {
    document.documentElement.style.setProperty("--direction", "ltr");
  }

  document.documentElement.style.setProperty("--thisHeight", rootHeight);

  const itemsToCalValues = { isRTL,
                             easing,
                             sliderPosition,
                             swipedSliderPosition,
                             isSwiping,
                             transitionMs,
                             tiltEasing };

  document.documentElement.style.setProperty("--calcTransResult", calcTransition(itemsToCalValues)); 
  document.documentElement.style.setProperty("--calcLeftResult", calcLeft(itemsToCalValues));
  document.documentElement.style.setProperty("--calcRightResult", calcRight(itemsToCalValues));
  document.documentElement.style.setProperty("--calcTopResult", calcTop(itemsToCalValues));  

  //Option seems useless and I can't figure out where it is used or set.
  const leftArrowProps = { options: isSwiping, 
                           otherProps:  rest,
                           activeIndex,
                           setIsSwiped,
                           setSwipedSliderPosition };

  const rightArrowProps = { options: isSwiping,
                            otherProps: rest,
                            activeIndex,
                            sliderPosition,
                            setIsSwiped,
                            setSwipedSliderPosition }
                           

  return(
      <div>
        {/* To determine if we need these, and the function above, we need to do */}
        {/* a little bit of studying... may needed to implment something like
            initResizeObserver... maybe not... */}
        {/* carouselWrapper */}
        <div className={styled.carouselWrapper}>
          {/*styledCarousel  */}
          {/* the arrow option is here, add it? */}
          <div className={styled.styledCarousel}>
            {/*sliderContainer  */}
            <div className={styled.sliderContainer}>
              {/* slider or sliderMode*/}
              <div className={styled.sliderMode}>
                {/* out track */}
                {/* slider component | Need to import more things.*/}
                <Slider data={data} 
                        leftArrowFunc={onPrevStart}
                        leftProps={leftArrowProps}
                        rightArrowFunc={onNextStart}
                        rightProps={rightArrowProps}
                        childWidth={childWidth}
                        autoTabIndexVisibleItems={autoTabIndexVisibleItems}
                        enableSwipe={enableSwipe}
                        enableMouseSwipe={enableMouseSwipe}
                        preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
                        itemsToShow={itemsToShow}
                        itemsToScroll={itemsToScroll}
                        currentItem={currentItem}
                        itemPosition={itemPosition}
                        itemPadding={itemPadding}
                        onSwiped={onSwiped}
                        onSwiping={onSwiping}
                        >
                </Slider>
              </div>
            </div>
          </div>
        </div>    

          {/* debugging and testing part */}
          {/* following is invlaid */}
          {/* <Card data={testData} description={testDescription}/> */}
          {/* <Card data={image2} description={testDescription}/>  */}
          {/* end of test part */}
      </div>
  );

}

//Not sure if we need all these props
PCarousel.defaultProps = {
  style: {},
  isRTL: false,
  initialFirstItem: 0,
  initialActiveIndex: 0,
  easing: "easing",
  tiltEasing: "easing",
  preventDefaultTouchmoveEvent: false,
  focusOnSelect: false,
  autoTabIndexVisibleItems: true,
  itemsToShow: 1,
  itemsToScroll: 1,
  itemPosition: constants.CENTER,
  itemPadding: [0, 0, 0, 0],
  outerSpacing: 0
  //Do we need call backs?
}

//TODO:
//Some of these props have the same name as some of the items in the
//state. How does the other repo handle and utilize this? Should
//we implement that?
PCarousel.propTypes = {
  //Items to render
  //TODO: REMOVE since cards will not be created at time of this props use.
  children: PropTypes.node.isRequired,

  //The css class for the root element 
  className: PropTypes.string, //are we going to use this?
  
  //the style object for the root element
  style: PropTypes.object,

  //is flip right to left
  isRTL: PropTypes.bool,

  //Animation speed
  initialTransitionMs: PropTypes.number,

  //transition easing pattern
  easing: PropTypes.string,

  //transition easing pattern for tilt
  tiltEasing: PropTypes.string,

  //The bumb animation when reaching the last item
  enableTilt: PropTypes.bool,

  //Number of visible items
  itemsToShow: PropTypes.number,

  //items to scroll
  itemsToScroll: PropTypes.number,

  //Collection of objects with a width, itemsToShow and itemsToScroll
  breakPoints: PropTypes.arrayOf(
    PropTypes.shape({
      width: PropTypes.number.isRequired,
      itemsToShow: PropTypes.number,
      itemsToScroll: PropTypes.number
    })
  ),

  //The initial active index when the component mounts
  //I think, its like what is supposed to be the first card.
  initialActiveIndex: PropTypes.number,
  
  //show arrow buttons
  showArrows: PropTypes.bool,

  //Show empty slots when children.length < itemsToshow 
  showEmptySlots: PropTypes.bool,

  //disables the arrow button when there are no more items
  disableArrowsOnEnd: PropTypes.bool,

  //Automatically inject `tabIndex: 0` to visable items
  autoTabIndexVisibleItems: PropTypes.bool,

  //A render prop for the arrow component
  //- ({type, onClick}) => <div onClick={onClick}>{type === 'prev' ? '<-' : '->'}</div>
  //Not sure what this is
  renderArrow: PropTypes.func,

  //Position the element relative to it's wrapper (use the consts object) - constants.START | constants.CENTER | constants.END
  itemPosition: PropTypes.oneOf([constants.START, constants.CENTER, constants.END]),

  //A padding for each element
  itemPadding: PropTypes.array,

  //A margin at the beginning and at the end of the carousel 
  outerSpacing: PropTypes.number,

  //swipe, enable or disable
  enableSwipe: PropTypes.bool,

  //Enable or disbale mouse swipe
  enableSwipe: PropTypes.bool,

  //Prevent page scroll on touchmove
  //Use this to stop the browser from scrolling 
  //while the user swipes. More details at:
  //https://github.com/FormidableLabs/react-swipeable#preventdefaulttouchmoveevent-details
  preventDefaultTouchmoveEvent: PropTypes.bool,

  //call backs here if you need them
  //onResize - a call back that can be injected in the original
  //           repo that you can insert into the component to run
  //           when a card needs to be resized for one reason or another. 
};



export default PCarousel;



















