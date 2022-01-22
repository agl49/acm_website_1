import style from "./sectionTitle.module.css";

function SectionTitle(props) {
    const glitchEffect = "aesthetic-effect-text-glitch";
    let effectApplied = "aesthetic-white-color";

    //   bool
    if (props.glitch) {
        effectApplied = glitchEffect;
    }

    //debugging
    // console.log(effectApplied);

    if (props.imagePath === undefined) {
        return (
            <div>
                <h1 className={effectApplied} data-glitch={props.titleName}>
                    {props.titleName}
                </h1>
            </div>
        );
    }
    else {
        return (
            <div>
                {/* Problem here with keeping the effect going while centered */}
                {/* works well while in container, maybe try cool colors now? */}
                <h1 className={effectApplied} data-glitch={props.titleName}>
                    {props.titleName}
                </h1>
                <img src={props.imagePath} als="ACM" className={style.standardImage} />
            </div>
        );
    }
}

export default SectionTitle;










