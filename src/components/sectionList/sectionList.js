import style from "./sectionList.module.css";

function SectionList(props) {
  
  const gifs = ["https://giphy.com/embed/YbS3KkZSFGUkB4XO1X",
                "https://giphy.com/embed/vc0vReKfhmsYSzS9ua",
                "https://giphy.com/embed/THut4Lktwdgz5p1TbD",
                "https://giphy.com/embed/MQTF1uW0GTZoVsseXx",
                "https://giphy.com/embed/QvMybzkScTcqHJiZx0",
                "https://giphy.com/embed/apXXWPioVOUtPVpPmM",
                "https://giphy.com/embed/3ohhwJlKHGchQUtvBS", 
                "https://giphy.com/embed/l3q2Cy90VMhfoA9BC",
                "https://giphy.com/embed/xTiTnxpQ3ghPiB2Hp6",
                "https://giphy.com/embed/7b8jdNUoFBdcoILjjv",
                "https://giphy.com/embed/3o85xC8sdW7vmG6bRe",
                "https://giphy.com/embed/U4ExkAvRpVQGB0NMe0", 
                "https://giphy.com/embed/lbcLMX9B6sTsGjUmS3",
                "https://giphy.com/embed/eVSqI3mZYfaDIXYsnS",
                "https://giphy.com/embed/26FPOFusQUOKpnXTG", 
                "https://giphy.com/embed/1oF1KAEYvmXBMo6uTS",
                "https://giphy.com/embed/UQ25FULQkgfwALbzpR",
                "https://giphy.com/embed/QpVUMRUJGokfqXyfa1",
                "https://giphy.com/embed/sRFEa8lbeC7zbcIZZR",
                "https://giphy.com/embed/l3q2XB76CaWPggiNW",
                "https://giphy.com/embed/l41YvpiA9uMWw5AMU",
                "https://giphy.com/embed/xT4uQF7h39mlsF5czK",
                "https://giphy.com/embed/AEzxJYSBlDbfW",
                "https://giphy.com/embed/B9xA6CAKrXjeU",
                "https://giphy.com/embed/l0OWhLikgS4sOha7e",
                "https://giphy.com/embed/8P4SOF8D1tZfOzNAPu"];

  let oneSelected = Math.floor(Math.random() * gifs.length);

  return (
    <div className="aesthetic-windows-95-modal">
      <div className="aesthetic-windows-95-modal-title-bar">
        <div className="aesthetic-windows-95-modal-title-bar-text">
          {props.titleName}
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

        <div className={style.vrtContainer}>
          <div className={style.responsiveGif}>
            <iframe className={style.iframeCss}
                    src={gifs[oneSelected]} 
                    frameBorder="0"
                    allowFullScreen>
            </iframe>
          </div>
          <hr className={style.lineBreak}/> 
          <div className={style.skills}>
            {props.skills.map( (theSkill, index) => {
              return (
                <label className={`${"aesthetic-windows-95-checkbox"}`}>{theSkill}
                  <input type="checkbox" checked/>
                  <span className="aesthetic-windows-95-checkmark"></span>
                </label>
              )
            })}
          </div> 
        </div> 

      </div>

    </div>
  );
}

export default SectionList;