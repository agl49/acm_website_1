import style from "./emailForm.module.css";


function EmailForm() {
  
  return (
      
    <div className={style.overArchingDiv}>
      <form id="contactForm" className={style.containerFormatting}>
        <input className={`${"aesthetic-windows-95-text-input"} ${style.inputWidth}`} type="text" name="user_name" placeholder="Name"/>
        <br/>
        <input className={`${"aesthetic-windows-95-text-input"} ${style.inputWidth}`} type="email" name="user_email" placeholder="Email"/>
        <br/>
        <div className="margin-top">
          <textarea className={`${"aesthetic-windows-95-text-input"} ${style.textInputWidth}`} name="message" placeholder="Message"/>
        </div>
        <br/>
        {/* button to send */}
        <div className="aesthetic-windows-95-button">
          <button>
              Send
          </button>  
        </div>
      </form>
    </div>
  );
}

export default EmailForm;