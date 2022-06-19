// this component is used in pCarousel.js
import React from 'react'
import propTypes from 'prop-types'
import style from './arrow.module.css'

// image
import trangle from '../../images/triangle-svgrepo-com.svg'

const directionalIcon = {
  left: style.leftArrow,
  right: style.rightArrow
}

// TODO: Make this actually look like a button that is presed

function Arrow (props) {
  const direction = props.direction
  const action = props.onClick

  // code to consider which direction the arrow is, this will swap the
  // css to flip the image when needed.

  return (
    <button onClick={action} className={style.arrowStyle}>
      <img src={trangle} alt='arrow' className={directionalIcon[direction]} />
    </button>
  )
}

export default Arrow
