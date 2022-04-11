import RenderParagraph from "../renderParagraph/renderParagraph";
import style from "./card.module.css";

// This component shouldn't really require any state in itself.
function Card({ info, cardPosition, cardStatus }) {
  

  //Currently don't use all of the items in prop. Keep?

  document.documentElement.style.setProperty("--paddingToUse", cardStatus.paddingStyle);
  document.documentElement.style.setProperty("--currentWidth", cardStatus.width);
  document.documentElement.style.setProperty("--itemPosition", cardStatus.itemPosition); 

  return(
    // originally everything was in side a div
    
    <div className={`${style.modifiedAestheticWindows95Container} ${cardOptions.get(cardPosition)}`}>
      <a href={info.link}>
        <img className={info.imagePart} src={info.img} alt={info.name} />
      </a>
  
      <div>
        {/* What was I trying to add here?*/}
      </div>
      <div className={style.miniTitleBar}> 
        <div className="aesthetic-windows-95-modal-title-bar-text">
          {info.name}
        </div>
      </div>

      <div className={`${style.cardText} ${"aesthetic-windows-95-container-indent"}`}>
          {/* debugging */}
          {/* console.log("props.textDescription " + props.textDecription) */}

          <RenderParagraph paragraph={info.textDescription}/>
      </div>
    </div>
    
  );

}

export default Card;
















