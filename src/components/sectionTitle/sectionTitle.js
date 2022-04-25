import style from "./sectionTitle.module.css";

function SectionTitle(props) {
    // "aesthetic-white-color";
    let effectApplied = props.textStyle;


    // Make this also display black titles

    if (props.imagePath === undefined) {
        return (
            <div>
                <h1 className={effectApplied}>
                    {props.titleName}
                </h1>

                {/* debugging */}
                {/* problem still occurs */}
                {/* <h1 className={effectApplied} data-glitch="L O P E Z">
                    L O P E Z
                </h1> */}
            </div>
            
        );
    }
    else {
        return (
            <div>
                {/* Problem here with keeping the effect going while centered */}
                {/* works well while in container, maybe try cool colors now? */}
                <h1 className={effectApplied}>
                    {props.titleName}
                </h1>
                <img src={props.imagePath} als={props.imageAls} className={style.standardImage} />
            </div>
        );
    }
}

export default SectionTitle;










