//used in pCarousel component
import React from "react";
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





