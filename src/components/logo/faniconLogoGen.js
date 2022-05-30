import style from "./logo.module.css";

function FaniLogo(props) {
  
  return (
    <div className={style.logoContainer}>
      <svg height="180" width="500" viewBox="0 5 300 120">
          <circle cx="150" cy="62" r="52" fill="black"/>
           
          <path d="M 150, 20
                   L 110, 90
                   L 190, 90
                   Z
          " className={style.faniconVersion}/>

          <path d="M 150, 36
                   L 126, 78
                   L 174, 78
                   Z
          " className={style.faniconVersion}/>

          <path d="M 150, 52
                   L 142, 66
                   L 158, 66
                   Z
          " className={style.faniconVersion}/>

      </svg>
    </div>
  );
}

export default FaniLogo;