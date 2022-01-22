import RenderParagraph from "../renderParagraph/renderParagraph.js";
import style from "./sectionText.module.css";

function SectionText(props) {
    return(
        <div className="aesthetic-windows-95-modal">
            <div className="aesthetic-windows-95-modal-title-bar">
                <div className="aesthetic-windows-95-modal-title-bar-text">
                    {props.title}
                </div>
            
                <div className="aesthetic-windows-95-modal-title-bar-controls">
                    <div className="aesthetic-windows-95-button-title-bar">
                        <button>
                        X
                        </button>
                    </div>
                </div>
            </div>

            <div className="aesthetic-windows-95-modal-content">
                <hr/>
                <div className="aesthetic-windows-95-container-indent">
                    {/* <p>{props.text}</p>     */}
                    <RenderParagraph paragraph={props.text}/>
                </div>

            </div>
        </div>
    );    
    

}

export default SectionText;







