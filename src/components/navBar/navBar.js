import Myfani from "../../images/fakeFanicon.png";
import style from "./navBar.module.css";

// add the fanicon to the start button
function NavBar() {
  return (
      <div>
          <div className={`${style.taskbarSpacing} ${"aesthetic-windows-95-taskbar"}`}>
            <div className="aesthetic-windows-95-taskbar-start">
              <button className={style.buttonLayout}>
                  <img src={Myfani}
                       alt="my start image"
                       className={style.startImage}>
                  </img>
                  Start
              </button>
            </div>
            
            <div className="aesthetic-windows-95-button">
              <a className={style.buttonSize} href="https://github.com/agl49"> 
                <button>
                  <svg width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 22.0268V19.1568C16.0375 18.68 15.9731 18.2006 15.811 17.7506C15.6489 17.3006 15.3929 16.8902 15.06 16.5468C18.2 16.1968 21.5 15.0068 21.5 9.54679C21.4997 8.15062 20.9627 6.80799 20 5.79679C20.4558 4.5753 20.4236 3.22514 19.91 2.02679C19.91 2.02679 18.73 1.67679 16 3.50679C13.708 2.88561 11.292 2.88561 8.99999 3.50679C6.26999 1.67679 5.08999 2.02679 5.08999 2.02679C4.57636 3.22514 4.54413 4.5753 4.99999 5.79679C4.03011 6.81549 3.49251 8.17026 3.49999 9.57679C3.49999 14.9968 6.79998 16.1868 9.93998 16.5768C9.61098 16.9168 9.35725 17.3222 9.19529 17.7667C9.03334 18.2112 8.96679 18.6849 8.99999 19.1568V22.0268" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 20.0267C6 20.9999 3.5 20.0267 2 17.0267" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                
                </button>
              </a>   
            </div>

            <div className="aesthetic-windows-95-button">
              <a className={style.buttonSize} href="https://www.linkedin.com/in/adrian-lopez-230029140/">
                <button>
                  <svg width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 17V13.5V10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M11 17V13.75M11 10V13.75M11 13.75C11 10 17 10 17 13.75V17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 7.01L7.01 6.99889" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </a>
            </div>

            <div className="aesthetic-windows-95-taskbar-services">
              📶🔈🔔 
            </div>

          </div>
      </div>
  );
}

export default NavBar;