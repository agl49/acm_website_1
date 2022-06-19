import RenderParagraph from '../renderParagraph/renderParagraph'
import style from './card.module.css'

function Card ({ info, index }) {
  // Currently don't use all of the items in prop. Keep?

  return (
  // originally everything was in side a div

    <div className={`${style.modifiedAestheticWindows95Container} ${index}`}>
      <div>
        <a href={info.link}>
          <img className={style.imagePart} src={info.img} alt={info.name} />
        </a>

        <div>
          {/* What was I trying to add here? */}
        </div>
        <div className={style.miniTitleBar}>
          <div className='aesthetic-windows-95-modal-title-bar-text'>
            {info.name}
          </div>
        </div>

        <div className={`${style.cardText} ${'aesthetic-windows-95-container-indent'}`}>
          <RenderParagraph paragraph={info.textDescription} />
        </div>
      </div>
    </div>
  )
}

export default Card
