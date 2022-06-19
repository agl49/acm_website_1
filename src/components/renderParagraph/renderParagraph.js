import React from 'react'
import style from './renderParagraph.module.css'

// Referenced:
// https://codereview.stackexchange.com/questions/211462/rendering-plain-text-with-paragraphs-and-line-breaks-as-html

function RenderParagraph (props) {
  const [firstLine, ...rest] = props.paragraph.split('\n')

  return (
    <p className={style.paragraph}>
      {firstLine}
      {rest.map(line => (
        // using a react.fragment
        <>
          <br />
          {line}
        </>
      ))}
    </p>

  )
}

export default RenderParagraph
