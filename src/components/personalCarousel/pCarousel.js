//This component is depreciated mainly due to the 
//comments from this site: https://shouldiuseacarousel.com/
//Also because I spent too much damn time on it and the complexity
//of what I was trying to build out weights the benifit I would get
//from using this component.
//--------------------------------------------------------------------
//A lot of the logic for this was extracted from the following:
//https://github.com/sag1v/react-elastic-carousel
//Package had too much logic for what we wanted so this is a simplified version.
//Also, we convert the class componets used to functional components that use hooks as needed.
import React, {Children} from "react";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill";
import Only from "react-only-when";
import Slider from "../slider/slider.js";
import data from "../data.js";
import { activeIndexReducer } from "../reducerItems/items";
import { nextItemAction, prevItemAction } from "../actions/itemsActions";
import consts from "../constants";
import styled from "./pCarousel.module.css";
import Arrow from "../arrow/arrow.js";

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
  
  //When would this every run? Should run when the state changes.
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
  //Hmm lets see if this will work... This won't work
  // window.requestAnimationFrame(() => {
  //   setTransitionMs(transitionMs);
  // });
  setTransitionMs(transitionMs);
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
//Params: nextItemId
//        childAmount
//        activeIndex
//        setSliderPosition
//        sliderContainerWidth
//        childAmount
//        setSliderPosition
//        rest 
function goTo(nextItemId, 
              childAmount,
              activeIndex,
              setSliderPosition,
              sliderContainerWidth,
              setActiveIndex,
              rest) {
  const { itemsToShow } = getDerivedPropsFromBreakPoint(rest);
  const childrenLength = childAmount;
  let safeNextItemId = Math.max(0, nextItemId); // don't allow negative numbers
  const isPrev = activeIndex > safeNextItemId;
  const nextAvailableItem = getNextItemIndex(activeIndex, isPrev, childAmount, rest); 
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
  // let positionEndCb = onNextEnd(activeIndex, childAmount); //Cutting this feature
  if (isPrev) {
    direction = constants.PREV;
    // positionEndCb = onPrevEnd(); // add right props to this
  }
  
  generatePositionUpdater(direction,
                          safeNextItemId,
                          {
                            transitioning: true
                          },
                          setSliderPosition,
                          activeIndex,
                          setActiveIndex,
                          sliderContainerWidth,
                          childAmount,
                          rest); 
  //state updater needs the needed function to update the state.
  //I don't think we need this.
  // pipe(
    //why is pipe needed
    //functions not implemented
    // updateActivePage(),
    // onSliderTransitionEnd(positionEndCb)
  // );
}

//What does fn mean? It just means function.
function onSliderTransitionEnd(fn) {
  //I don't know when this slider property is created
  // in the original. Not sure what exactly it is.
  //slider.addEventListener("transitionend", fn);

  //May be remove...
}

//Used in goTo
//Used in pagitation, and we are not including that so remove.
//Params: activeIndex
//        childAmount
// 
//        rest
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
//fns -> functions
//shouldn't return a function since we don't use react classes
//The reason he uses this I think is because of the setState functions form.
//Since we use hooks, I don't think we need this.
function pipe(...fns) {
  return (x) =>       //total currentVal  initalValue
               fns.reduce((v, f) => f(v), x);
                           //inner reducer function just calls f on v 
}

//Params: direction
//        nextItemId
//        SliderPosition
//        setSliderPosition
//        activeIndex
//        setActiveIndex
//        sliderContainerWidth
//        childAmount
//        setSliderPostion
//        rest
function generatePositionUpdater(direction, 
                                 nextItemId,
                                 sliderPosition,
                                 setSliderPosition,
                                 activeIndex,
                                 setActiveIndex,
                                 sliderContainerWidth,
                                 childAmount,
                                 rest) {
  const childWidth = calculateChildWidth(sliderContainerWidth, childAmount, rest); 
    
  let newSliderPosition = 0;
  const childSize = childWidth;
  if (direction === constants.NEXT) {
    newSliderPosition = 
    sliderPosition - childSize * (nextItemId - activeIndex);
  } else {
    newSliderPosition = 
      sliderPosition + childSize * (activeIndex - nextItemId);
  }

  setSliderPosition(newSliderPosition);
  setActiveIndex(nextItemId);
  // setSliderPosition(0); <-- why this?
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

//Maybe remove, see onNextEnd
function onPrevEnd(props) {
  const { onPrevEnd, onChange } = getDerivedPropsFromBreakPoint(); // add props
  const { activeIndex, activePage } = props;
  const nextItemObj = convertChildToCbObj(activeIndex);
  //removeSliderTansistionHook(onPrevEnd);
  //setTransitioning(false);
  onChange && onChange(nextItemObj, activePage);
  onPrevEnd(nextItemObj, activePage); 
}

//called by goTo
//Hmm, this function main purpose seems ot be executing the
//possible callbacks that are inserted into the function and I
//don't think we need to incorporate that so we can cut these 
//functions. The Og function seem to execute the passed callbeack
//but the function also seems to be intened to return something but
//doesn't... Or it does in a way I don't know. Still, it seems to be
//in the service of doing the callback feature so we don't need to
//worry about it. Maybe remove
//Params: activeIndex
//        childAmount  
// function onNextEnd(activeIndex, childAmount) {
//   // This line basically calls callbacks that we don't need.                                                           
//   // const { onNextEnd, onChange } = getDerivedPropsFromBreakPoint();
  
//   const nextItemObj = convertChildToCbObj(activeIndex, childAmount);
//   //do we need this?
//   //removeSliderTransitionHook(onNextEnd);
//   //We don't have this state var created, what is it used for?
//   //props.setTransitioning(false)
//   //onChange is a passed function but what should it do?
//   onChange && onChange(nextItemObj, activePage);
//   onNextEnd(nextItemObj, activePage);
// }

//Params: index,
//        childAmount
//PROBLEM: currently no way to do this. Do we need to do this?
function convertChildToCbObj(index, childAmount) {
  const { children } = getDerivedPropsFromBreakPoint();
  // support decimal itemsToShow
  const roundedIdx = Math.round(index);
  const child = Children.toArray(children)[roundedIdx];
  return { item: child.props, index: roundedIdx };
}

//We were called from goTo and slidePrev
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
    ? prevItemAction(0, itemsToScroll)                           //imported from other files
    : nextItemAction(limit, itemsToScroll);                      //<-
  const nextItem = activeIndexReducer(currentIndex, nextAction); //<- 
  return nextItem;
}

//Remove since it is used in pagitation that we are not going to use.
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

  //debugging
  console.log("we are running calcRight");                    

  if (isRTL) {
    //debugging
    //Problem this was having is that the following doesn't work:
    //`${isSwiping ? swipedSliderPosition : sliderPosition}px`
    //not sure why it worked in the other code. Might be a styled 
    //component thing.
    //Actually might just be that we never defined some of the props.
    console.log("in isRTL");
    let result = `${isSwiping ? swipedSliderPosition : sliderPosition}px`;
    console.log("this is what result is " + result);

    result = isSwiping ? swipedSliderPosition : sliderPosition;
    console.log("new result is " + result);
    console.log("swipedSliderPosition: " + swipedSliderPosition);
    console.log(typeof swipedSliderPosition);
    console.log("sliderPosition: " + sliderPosition);
    console.log(typeof result);
    if (result === undefined) {
      console.log("result === undefined");
    } else {
      console.log("result is different from undefined.");
    }
    console.log("this is result: " + result);    

    return result + "px";
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

function onNextStart(options, 
                     rest,
                     activeIndex,
                     sliderPosition,
                     setIsSwiped,
                     setSwipedSliderPosition,
                     childAmount,
                     getPrev,
                     sliderContainerWidth,
                     setActiveIndex) {
  //this is for custom functions to run when clicking the button
  // const { onNextStart } = getDerivedPropsFromBreakPoint(rest); 
  const nextItemObj = getNextItemObj(childAmount, activeIndex, getPrev, rest); //did we implment this? No we did not.
  const prevItemObj = convertChildToCbObj(activeIndex);
  // onNextStart(prevItemObj, nextItemObj); 
  slideNext(options,
            rest,
            activeIndex,
            sliderPosition,
            setIsSwiped,
            setSwipedSliderPosition,
            childAmount,
            sliderContainerWidth,
            setActiveIndex);
}

function slideNext(options = {},
                   rest,
                   activeIndex,
                   sliderPosition,
                   setIsSwiped,
                   setSwipedSliderPosition,
                   childAmount,
                   sliderContainerWidth,
                   setActiveIndex) { //here
  const { skipTilt } = options;
  const { enableTilt } = getDerivedPropsFromBreakPoint(rest);
  const nextItem = getNextItemIndex(activeIndex, false);
  if (activeIndex !== nextItem) { 
    goTo(nextItem, 
         childAmount,
         activeIndex,
         sliderPosition,
         sliderContainerWidth,
         setActiveIndex,
         rest); 
  } else if (enableTilt && !skipTilt) {
    tiltMovement(sliderPosition, 20, 150, setIsSwiped, setSwipedSliderPosition); 
  }
}

function onPrevStart(options,
                     rest,
                     activeIndex,
                     setIsSwiped,
                     setSwipedSliderPosition,
                     childAmount,
                     getPrev,
                     setActiveIndex,
                     sliderContainerWidth) {
  //do we need these two things?
  const nextItemObject = getNextItemObj(childAmount, activeIndex, getPrev, rest);
  const prevItemObject = convertChildToCbObj(activeIndex);
  slidePrev(options, 
            rest,
            activeIndex,
            setIsSwiped,
            setSwipedSliderPosition,
            getPrev,
            childAmount,
            sliderContainerWidth,
            setActiveIndex);
}

//Might cause problems...
function getNextItemObj(childAmount, activeIndex, getPrev, rest) {
  const nextItemIndex = getNextItemIndex(activeIndex, getPrev, childAmount, rest);
  //supports decimal itemsToShow
  const roundedIdx = Math.round(nextItemIndex);
  return roundedIdx;
}

function slidePrev(options = {}, 
                   rest,
                   activeIndex,
                   setIsSwiped,
                   setSwipedSliderPosition,
                   getPrev,
                   childAmount,
                   sliderContainerWidth,
                   setActiveIndex) {
  const { skipTilt } = options;
  const { enableTilt } = getDerivedPropsFromBreakPoint(rest);
  const prevItem = getNextItemIndex(activeIndex, getPrev, childAmount, rest);
  if (activeIndex !== prevItem) {
    // this is missing params...
    goTo(prevItem, childAmount, activeIndex, setSwipedSliderPosition, sliderContainerWidth, setActiveIndex, rest);
  } else if (enableTilt && !skipTilt) {
    tiltMovement(0, -20, 150, setIsSwiped, setSwipedSliderPosition);
  }
}

//Hmmm, is this right?
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
      link: "http://github.com/agl49/techsGiving",
      textDescription: "odijfaoijcoidfkldjoicjaoisdjf\n\
                        jldkjfaldskjfoasidfjlskajdfkl\n\
                        dsjdkfjalskdjfkldsjflakjksdjf\n\
                        kjlaskdjflaksjdflkasdjflksjdl\n\
                        jkldsjaflkdsjflksjflksdjflasd\n\
                        jalskdjflaksdjflksadjflaksjdf"
  };

  const testStatus = { width: "100%",
                       paddingStyle: "5px", 
                       isVisible: "true",
                       isPrevItem: "false",
                       isNextItem: "false",
                       itemPosition: 0 };

  const image2 = {
    name: "testName2",
    img: Pathfinder, 
    link: "http://github.com/agl49/"
  };

  
  //End of test input

  //here, for now, lets try to get basic functionality to work.

  //from https://stackoverflow.com/questions/53254017/react-hooks-and-component-lifecycle-equivalent
  const isFirstUpdate = React.useRef(true); 
  const breakPoints = props.breakPoints;

  //filter out props you don't need here...
  //Problem here with below, if placed after [], call will use wrong item.
  
  //debugging
  console.log("passed in props");
  console.log(props);

  const { initialTransitionMs, initialActiveIndex, ...rest } = props; 

  //debugging
  console.log("rest has");
  console.log(rest);

  const {
    style,
    itemsToShow,
    itemsToScroll,
    isRTL,
    easing,
    tiltEasing,
    // children,      //We have conflicting was of accessing the children components (the cards)
    // focusOnSelect, //we have our way of creating them, which we saw from the other tutorial,
    autoTabIndexVisibleItems, //and then there is the children way which is not implemented correctly.
    itemPosition,             //we only need one way so... 
    itemPadding,
    outerSpacing,
    // showArrows,
    // disableArrowsOnEnd,
    onSwiped,
    enableMouseSwipe,
    enableSwipe,
    preventDefaultTouchmoveEvent,
  } = getDerivedPropsFromBreakPoint(rest); 

  //sets initial childrenLength, change this to state?
  const initalChildrenAmount = data.length;
  const [childAmount, setChildAmount] = React.useState(initalChildrenAmount);
  const [sliderPosition, setSliderPosition] = React.useState(0);
  const [swipedSliderPosition, setSwipedSliderPosition] = React.useState(0);
  const [sliderContainerWidth, setSliderContainerWidth] = React.useState(0); 
  const [transitionMs, setTransitionMs] = React.useState(initialTransitionMs);
  const [activeIndex, setActiveIndex] = React.useState(initialActiveIndex);
  const [rootHeight, setRootHeight] = React.useState("100%"); //need to set this to be the size
                                                         //of the container of the card? Seems that once the thing
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
      //This right here pointless?
      const {
        itemsToShow: calculateItemsToShow
      } = getDerivedPropsFromBreakPoint(rest);
      // From repo
      // number of items is reduced (we don't care if number of items is increased)
      // we need to check if our current index is not out of boundaries
      // we need to include itemsToShow so we can fill up the slots
      const lastIndex = childAmount - 1;
      const isOutOfRange = activeIndex + calculateItemsToShow > lastIndex;
      if (isOutOfRange) {
        // we are out of boundaries, go "back" to last item of the last (respect itemsToShow)
        goTo(Math.max(0, childAmount - calculateItemsToShow),
             childAmount,
             activeIndex,
             setSliderPosition,
             sliderContainerWidth,
             setActiveIndex,
             rest);
      }

      prevSliderContainerWidth = sliderContainerWidth;
      prevChildrenLength = childAmount;
    }

    //Here we do the animations if the state has changed.
    //We need to cal this right based off of right parms.
    const itemsToCalValues = { isRTL, 
                               easing,
                               sliderPosition,
                               swipedSliderPosition,
                               sliderContainerWidth,
                               activeIndex,
                               isSwiping: enableSwipe,
                               transitionMs,
                               tiltEasing };

    //Hmm, I think we should move this... Check again what the advantage of this again?
    //Problem here, possible all other ones of this type are not working as well. Check.
    //do we need to do these calculations only once? Cause we currently do that
    //Also, these types only return 0. Make them return something.
    let trans = calcTransition(itemsToCalValues);
    let left = calcLeft(itemsToCalValues);
    let right = calcRight(itemsToCalValues);
    let top = calcTop(itemsToCalValues);

    //debugging
    console.log("right after function");
    console.log(typeof right);
    console.log("this is right " + right);

    document.documentElement.style.setProperty("--calcTransResult", trans); 
    document.documentElement.style.setProperty("--calcLeftResult", left);
    document.documentElement.style.setProperty("--calcRightResult", right);
    document.documentElement.style.setProperty("--calcTopResult", top);  

    //debugging
    let cR = getComputedStyle(document.documentElement).getPropertyValue('calcRightResult');
    console.log(typeof cR);
    console.log("cR is " + cR); //Something wrong with this string.


  }, [breakPoints, childAmount, sliderContainerWidth, sliderPosition, activeIndex]);


  const childWidth = calculateChildWidth(sliderContainerWidth, childAmount, rest);
  // const numOfPages = getNumOfPages(); <-- remove

  let body = getComputedStyle(document.body);
  let dir = toString(body.getPropertyValue("--direction"));
  dir = dir.trim();

  if (isRTL !== dir) {
    document.documentElement.style.setProperty("--direction", "ltr");
  }

  document.documentElement.style.setProperty("--thisHeight", rootHeight);


  const leftArrowProps = { options: enableSwipe, 
                           otherProps: rest,
                           activeIndex,
                           enableSwipe,
                           sliderPosition,
                           childAmount,
                           setSwipedSliderPosition };

  const rightArrowProps = { options: enableSwipe,
                            otherProps: rest,
                            activeIndex,
                            enableSwipe,
                            sliderPosition,
                            childAmount,
                            setSwipedSliderPosition }
                           
  return(
      <div>
        {/* There is a problem with how we formed this. The main idea of the */}
        {/* sliding mean we need to have a window for the cards to show up in but */}
        {/* but currently we don't do that. */}
        
        {/* test card */}
        <Card info={testData} cardStatus={testStatus}/>

        {/* carouselWrapper */}
        <div className={styled.carouselWrapper}>
          {/*styledCarousel  */}
          {/* the arrow option is here, add it? */}
          <div className={styled.styledCarousel}>
            {/*sliderContainer  */}
            {/* arrows here */}
            {/* arrows break one clicked */}
            {/* arrows need to manipulate the slider */}
            {/* False is for options/skipTilt, keeps? */}
            <Arrow direction="left" onClick={() => onPrevStart(false, 
                                                               rest,
                                                               activeIndex,
                                                               setIsSwiped,
                                                               setSwipedSliderPosition,
                                                               childAmount,
                                                               getPrev,
                                                               setActiveIndex,
                                                               sliderContainerWidth)}/>

            <div className={styled.sliderContainer}>
              {/* slider or sliderMode*/}
              <div className={styled.sliderMode}>
                {/* out track */}
                {/* slider component | Need to import more things.*/}
                <Slider data={data} 
                        childWidth={childWidth}
                        autoTabIndexVisibleItems={autoTabIndexVisibleItems}
                        enableSwipe={enableSwipe}
                        enableMouseSwipe={enableMouseSwipe}
                        preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
                        itemsToShow={itemsToShow}
                        itemsToScroll={itemsToScroll}
                        currentItem={activeIndex}
                        itemPosition={itemPosition}
                        itemPadding={itemPadding}
                        onSwiped={onSwiped}
                  >
                </Slider>
              </div>
            </div>
            
            <Arrow direction="right" onClick={() => onNextStart(false,
                                                                rest,
                                                                activeIndex,
                                                                sliderPosition,
                                                                setIsSwiped,
                                                                setSwipedSliderPosition,
                                                                childAmount,
                                                                getPrev,
                                                                sliderContainerWidth,
                                                                setActiveIndex)}/>

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
  // focusOnSelect: false,
  autoTabIndexVisibleItems: true,
  itemsToShow: 1,
  itemsToScroll: 1,
  itemPosition: constants.CENTER,
  itemPadding: [0, 0, 0, 0],
  showArrows: true,
  disableArrowsOnEnd: false,
  outerSpacing: 0,
  onSwiped: null
  //Do we need call backs?
}

//TODO:
//Some of these props have the same name as some of the items in the
//state. How does the other repo handle and utilize this? Should
//we implement that?
PCarousel.propTypes = {
  //Items to render
  //TODO: REMOVE since cards will not be created at time of this props use.
  // children: PropTypes.node.isRequired,

  //The css class for the root element 
  // className: PropTypes.string, //are we going to use this?
  
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
  //Not sure what this is => its for custom arrows
  // renderArrow: PropTypes.func,

  //Position the element relative to it's wrapper (use the consts object) - constants.START | constants.CENTER | constants.END
  itemPosition: PropTypes.oneOf([constants.START, constants.CENTER, constants.END]),

  //A padding for each element
  itemPadding: PropTypes.array,

  //A margin at the beginning and at the end of the carousel 
  outerSpacing: PropTypes.number,

  //swipe, enable or disable
  enableSwipe: PropTypes.bool,

  onSwiped: PropTypes.func,

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



















