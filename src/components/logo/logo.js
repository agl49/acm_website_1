import react from "react";
import style from "./logo.module.css";

// React component version of our logo. 

//TODOs:
//clean up these files from all the extra stuff you
//have here

function Logo(props) {
    
    // L225 200
    return(
        <div className={style.logoContainer}>            
            
            {/* org height = 120 width = 300 */}
            <svg height="150" width="400" viewBox="0 5 300 120" >
                
                <defs>
                    <linearGradient id="grad">
                        <stop offset="0%" stop-color="#f5be07"/>
                        <stop offset="25%" stop-color="#ff7c33"/>
                        <stop offset="50%" stop-color="#ff1875"/>
                        <stop offset="75%" stop-color="#3f00c1"/>
                        <stop offset="100%" stop-color="#40A4FF"/>
                    </linearGradient>
                </defs>
                
                <circle cx="150" cy="62" r="52" fill="black"/>

                <path d="M 150, 20 
                         L 110, 90 
                         L 190, 90 
                         Z
                " className={style.redlineOne}/>
                
                {/* reduced by 1/2 */}
                {/* <path d="M 150, 40
                         L 130, 70
                         L 170, 70
                         Z  
                " className={style.redlineTwo}/> */}

                {/* testline */}
                {/* <line x1="150" x2="150" y1="60" y2="20" stroke="red" stroke-width="1px"/> */}

                <path d="M 150, 28
                         L 118, 84
                         L 182, 84
                         Z  
                " className={style.redlineOne}/>

                <path d="M 150, 36
                         L 126, 78
                         L 174, 78
                         Z  
                " className={style.redlineOne}/>

                <path d="M 150, 44
                         L 134, 72
                         L 166, 72
                         Z  
                " className={style.redlineOne}/>

                <path d="M 150, 52
                         L 142, 66
                         L 158, 66
                         Z  
                " className={style.redlineOne}/> 

                {/* <path d="M 150, 60
                         L 150, 60
                         L 150, 60
                         Z  
                " className={style.redlineOne}/>  */}

                {/* <path d="M 150, 0
                         L 110, 90
                         L 190, 90
                         Z    
                " className={style.redlineTwo}/> */}

            </svg>

            {/* <div className={style.glowyContainer}>
                <span className={style.glowy}></span>
            </div> */}

        </div>
    );
}


export default Logo;