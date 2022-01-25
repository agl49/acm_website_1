//this component is used in pCarousel.js
import React from "react";
import propTypes from "prop-types";

//image 
import trangle from "../../images/triangle-svgrepo-com.svg";

const directionalIcon = {
    left: "<",
    right: ">"
}

function Arrow(props) {
  const arrows = {...props.icons};
  
  //code to consider which direction the arrow is, this will swap the 
  //css to flip the image when needed. 

  return(
    //He just uses special ascii chars
    //
    <button>
        <img src={trangle} alt="arrow"/>
    </button>   
  );
}


export default Arrow;


