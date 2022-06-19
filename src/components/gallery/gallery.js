import Card from '../card/card.js'
import style from './gallery.module.css'

function Gallery ({ projects }) {
  return (
    <div className={style.projectContainer}>

      {projects.map((project, index) => {
        return <Card info={project} index={index} />
      })}

    </div>

  )
}

export default Gallery
