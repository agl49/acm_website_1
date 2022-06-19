import style from './sectionTitle.module.css'

function SectionTitle (props) {
  const effectApplied = props.textStyle

  if (props.imagePath === undefined) {
    return (
      <div>
        <h1 className={effectApplied}>
          {props.titleName}
        </h1>
      </div>

    )
  } else {
    return (
      <div>
        <h1 className={effectApplied}>
          {props.titleName}
        </h1>
        <img src={props.imagePath} als={props.imageAls} className={style.standardImage} />
      </div>
    )
  }
}

export default SectionTitle
