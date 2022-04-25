import Card from "../card/card.js";
// import Arrow from "../arrow/arrow.js";
import propTypes from "prop-types";
// import { Swipeable } from "react-swipeable";
import style from "./slider.module.css";
import {useState} from "react";

//Here
//there is a problem with this or the order in which it does things.
function Slider({ data, 
                  childWidth,
                  autoTabIndexVisibleItems,
                  enableSwipe,
                  enableMouseSwipe,
                  preventDefaultTouchmoveEvent,
                  itemsToShow,
                  itemsToScroll,
                  currentItem,
                  itemPosition,
                  itemPadding,
                  onSwiped}) {
  const width = `${childWidth}px`;
  const paddingStyle = `${itemPadding.join("px ")}px`;
  const minVisableItem = currentItem;
  const maxVisableItem = currentItem + itemsToShow;
  const prevItem = minVisableItem - itemsToScroll;
  const nextItem = maxVisableItem + itemsToScroll;
  
  //need to transfer the props item.
  

  if (enableSwipe) {
    return (
      // This usage of swipeable is depreciated it seems.
      // you need to implment it in the current way to work.
      // <Swipeable
      //   style={{
      //     display: "flex",
      //     flexDirection: "row"
      //   }}
      //   stopPropagation
      //   preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
      //   trackMouse={enableMouseSwipe}
      //   onSwiped={onSwiped}
      //   className={style.cardContainer}
      // >
        <div className={style.cardContainer}> 
            {/* <Arrow direction="left" onClick={leftAction}/> */}
  
          
            {data.map( (project, index) => {
              const isVisible = index >= minVisableItem && index < maxVisableItem;
              const isPrevItem = !isVisible && index >= prevItem && index < currentItem; 
              const isNextItem = !isVisible && index < nextItem && index > currentItem; 
              
              let tabIndex = null;
              let compiledAttributes = null;   
  
              if (autoTabIndexVisibleItems) {
                tabIndex = isVisible ? 0 : 1; //What is this used for?
  
                compiledAttributes = { width,
                                       paddingStyle,
                                       isVisible,
                                       isPrevItem,
                                       isNextItem,
                                       tabIndex,
                                       itemPosition };
              } else {
                compiledAttributes = { width,
                                       paddingStyle, 
                                       isVisible,
                                       isPrevItem,
                                       isNextItem,
                                       itemPosition };
              }  
              
              //Next is to edit card
              return <Card info={project} cardStatus={compiledAttributes} />
            })} 
  
            {/* <Arrow direction="right" onClick={rightAction}/> */}
        </div>
      // </Swipeable>
    );
  } else {
    return (
      <div className={style.cardContainer}> 
        {/* <Arrow direction="left" onClick={leftAction}/> */}
  
        {data.map( (project, index) => {
              const isVisible = index >= minVisableItem && index < maxVisableItem;
              const isPrevItem = !isVisible && index >= prevItem && index < currentItem; 
              const isNextItem = !isVisible && index < nextItem && index > currentItem; 
              
              let tabIndex = null;
              let compiledAttributes = null;   
  
              if (autoTabIndexVisibleItems) {
                tabIndex = isVisible ? 0 : 1; //What is this used for?
  
                compiledAttributes = { width,
                                       paddingStyle,
                                       isVisible,
                                       isPrevItem,
                                       isNextItem,
                                       tabIndex,
                                       itemPosition };
              } else {
                compiledAttributes = { width,
                                       paddingStyle, 
                                       isVisible,
                                       isPrevItem,
                                       isNextItem,
                                       itemPosition };
              }  
              
              //Next is to edit card
              return <Card info={project} cardStatus={compiledAttributes} />
            })} 
  
        {/* <Arrow direction="right" onClick={rightAction}/> */}
      </div>
    );
  }
     
}

//debugging
// function Slider() {
//   return "f";
// }

export default Slider;

/*
This is what we had before that was causing the problem.

function Slider({ data, 
                  leftAction,
                  leftProps,
                  rightAction,
                  rightProps,
                  childWidth,
                  autoTabIndexVisibleItems,
                  enableSwipe,
                  enableMouseSwipe,
                  preventDefaultTouchmoveEvent,
                  itemsToShow,
                  itemsToScroll,
                  currentItem,
                  itemPosition,
                  itemPadding,
                  onSwiped}) {
  const width = `${childWidth}px`;
  const paddingStyle = `${itemPadding.join("px ")}px`;
  const minVisableItem = currentItem;
  const maxVisableItem = currentItem + itemsToShow;
  const prevItem = minVisableItem - itemsToScroll;
  const nextItem = maxVisableItem + itemsToScroll;
  
  //need to transfer the props item.
  let toRender = enableSwipe ? (
    <Swipeable
      style={{
        display: "flex",
        flexDirection: "row"
      }}
      stopPropagation
      preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
      trackMouse={enableMouseSwipe}
      onSwiped={onSwiped}
      className={style.cardContainer}
    >
      <div className={style.cardContainer}> 
          <Arrow direction="left" onClick={leftAction}/>

        
          {data.map( (project, index) => {
            const isVisible = index >= minVisableItem && index < maxVisableItem;
            const isPrevItem = !isVisible && index >= prevItem && index < currentItem; 
            const isNextItem = !isVisible && index < nextItem && index > currentItem; 
            
            let tabIndex = null;
            let compiledAttributes = null;   

            if (autoTabIndexVisibleItems) {
              tabIndex = isVisible ? 0 : 1; //What is this used for?

              compiledAttributes = { width,
                                     paddingStyle,
                                     isVisible,
                                     isPrevItem,
                                     isNextItem,
                                     tabIndex,
                                     itemPosition };
            } else {
              compiledAttributes = { width,
                                     paddingStyle, 
                                     isVisible,
                                     isPrevItem,
                                     isNextItem,
                                     itemPosition };
            }  
            
            //Next is to edit card
            return <Card info={project} cardStatus={compiledAttributes} />
          })} 

          <Arrow direction="right" onClick={rightAction}/>
      </div>
    </Swipeable>
  ) : (
    <div className={style.cardContainer}> 
      <Arrow direction="left" onClick={leftAction}/>

      {data.map( (project, index) => {
            const isVisible = index >= minVisableItem && index < maxVisableItem;
            const isPrevItem = !isVisible && index >= prevItem && index < currentItem; 
            const isNextItem = !isVisible && index < nextItem && index > currentItem; 
            
            let tabIndex = null;
            let compiledAttributes = null;   

            if (autoTabIndexVisibleItems) {
              tabIndex = isVisible ? 0 : 1; //What is this used for?

              compiledAttributes = { width,
                                     paddingStyle,
                                     isVisible,
                                     isPrevItem,
                                     isNextItem,
                                     tabIndex,
                                     itemPosition };
            } else {
              compiledAttributes = { width,
                                     paddingStyle, 
                                     isVisible,
                                     isPrevItem,
                                     isNextItem,
                                     itemPosition };
            }  
            
            //Next is to edit card
            return <Card info={project} cardStatus={compiledAttributes} />
          })} 

      <Arrow direction="right" onClick={rightAction}/>
    </div>
  );

  //debugging
  console.log(typeof toRender); 

  return toRender;
}
*/


/*
This is the original from the git we are learning from.

import propTypes from "prop-types";
import { Swipeable } from "react-swipeable";


function Track(props) {
  const width = props.childWidth;
  const paddingStyle = props.itemPadding.join("px "); //<-- Might cause probs as props are immutable
  const minVisableItem = props.currentItem;
  const maxVisableItem = props.currentItem + props.itemToShow;
  const prevItem = minVisableItem - props.itemsToScroll;
  const nextItem = maxVisableItem + props.itemToScroll;

  //Children or the cards of the track
  const originalChildren = React.Children.map(props.children, (child, idx) => {
      //Function to be applied to all children
      //Where does idx come from? Think it means ID for item x
      const isVisable = idx >= minVisableItem && idx < maxVisableItem;
      const isPrevItem = !isVisable && idx >= prevItem && idx < props.currentItem;
      const isNextItem = !isVisable && idx < nextItem && idx > props.currentItem;
      const itemClass = "carouselItem";

      //Child should be component with image and text + style
      const childToRender = props.autoTabIndexVisableItem
        ? React.cloneElement(child, {
            tabIndex: isVisable ? 0 : -1
          })
        : child;
      
      return (
        // form of the child
        <div>
            <div>
                {childToRender}
            </div>
        </div>  
      );  

  });

  const toRender = () => {
      //you can also add style, not sure what
      <Swipeable
        style
        stopPropagation
        preventDefaultTouchmoveEvent={props.preventDefaultTouchmoveEvent}
        trackMouse={props.trackMouse}
        onSwiped={props.onSwiped}
        onSwiping={props.onSwiping}
        className={props.swipClassName}
      >
          {originalChildren}
      </Swipeable>
  }

  return toRender;
}

Track.propTypes = {
    children: propTypes.array.isRequired,
    itemToShow: propTypes.number.isRequired,
    noAutoTabbedItems: propTypes.bool,
    currentItem: propTypes.number.isRequired,
    itemPadding: propTypes.array,
    childWidth: propTypes.number,
    trackMouse: propTypes.bool,
    preventDefaultTouchmoveEvent: propTypes.bool,
    onSwiped: propTypes.func,
    onSwiping: propTypes.func,
};

export default Track;
*/




