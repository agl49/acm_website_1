import style from "./emailForm.module.css";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { useState, useEffect } from "react";

//utilized info from this blog
//https://placidowang.medium.com/how-to-add-an-email-form-to-your-react-website-for-free-using-emailjs-and-react-hook-form-7267d6365291
//info is a little outdate so we just applied the idea

function EmailForm() {
  const redMessageColor = "aesthetic-pepsi-red-color";
  const blueMessageColor = "aesthetic-pepsi-blue-color";

  const { register, handleSubmit, watch, errors } = useForm();
  const [statusMessage, setStatusMessage] = useState("Message");
  const [messageSent, setMessageSent] = useState(false);
  
  //Random number generater also seems to be broken, run tests
  //on that as well.
  //3 problems:
  //  can't change css var or get it to execute
  //  className update won't re-render -> fixed
  //  contact number won't generate random numbers properly -> canceled

  const testSubmit = (data) => {
    const form = document.querySelector("#contactForm");

    console.log(data);

    console.log("Test send");

    let randomNum = Math.floor(Math.random() * 10);

    console.log("randomNum: " + randomNum);

    if (randomNum >= 5) {
      // message was a success
      setMessageSent(true); //Color doesn't change but class name does
      setStatusMessage("Message Sent");  //same re-render problem... Seems like I am 
                                         //just not understanding somthing
      
      // this stuff doesn't work here either                                   
      // document.documentElement.style.setProperty("--messageVisability", "visible");
      // setTimeout(() => {
      //   document.documentElement.style.setProperty("--messageVisability", "hidden");
      // }, 5000);
      form.reset();
    } else {
      // message was unable to send
      setMessageSent(false);    
      setStatusMessage("Failed to Send");
      // document.documentElement.style.setProperty("--messageVisability", "visible");
      // setTimeout(() => {
      //   document.documentElement.style.setProperty("--messageVisability", "hidden");
      // }, 5000);
      form.reset();
    }
  }

  const onSubmit = (data) => {
    const form = document.querySelector("#contactForm");
    
    console.log(data);

    emailjs.send("contact_form", "template_44bzea7", data, "MhUewi79r9N_APk3-")
      .then(function(response) {
        console.log("SUCCESS!", response.status, response.text);
        
        setStatusMessage("Message Sent");
        // messageColor = blueMessageColor;
        //error with these things here... maybe doesn't work cause its not in rerender hook...
        //Have this instead change a state which then is evaluated in the useEffect hook
        document.documentElement.style.setProperty("--messageVisability", "visible");
        setTimeout(() => {
          document.documentElement.style.setProperty("--messageVisability", "hidden");
        }, 5000);

        form.reset();
      }, function(error) {
        console.log("FAILED...", error);

        setStatusMessage("Failed to Send");
        // messageColor = redMessageColor;
        document.documentElement.style.setProperty("--messageVisability", "visible");
        setTimeout(() => {
          document.documentElement.style.setProperty("--messageVisability","hidden");
        }, 5000);

        form.reset();
      });
  }

  useEffect(() => {
    //Seems to be a problem with this
    console.log("use effect was run");

    console.log("getting --messageVisability value")
    console.log(typeof document.getElementById("999"));
    console.log(document.getElementById("999"));
    const theValue = getComputedStyle(document.getElementById("999")).getPropertyValue("--messageVisability");
    console.log(theValue);
    console.log(typeof theValue);

    //Thi sort a works but it doesn't change the css but instead add the style to the
    //html element and that overrides the css. Is that how it is supposed to go?
    //We're overcomplicating things. Lets just find an implementation that works, wheather it
    //uses css variables or not.

    document.getElementById("999").style.setProperty("visibility", "visible");

    console.log("after attempt to change value");
    console.log(theValue);
    console.log(typeof theValue);

    // setTimeout(() => {
    //   document.documentElement.style.setProperty("--messageVisability", "hidden");
    // }, 5000);
  }, [statusMessage]);

  return (
      
    <div className={style.overArchingDiv}>
      <form id="contactForm" className={style.containerFormatting} onSubmit={ handleSubmit(testSubmit) }>
        <input className={`${"aesthetic-windows-95-text-input"} ${style.inputWidth}`} 
               type="text"
               name="user_name"
               placeholder="Name" 
               required
               {...register("user_name")} />
        <br/>
        <input className={`${"aesthetic-windows-95-text-input"} ${style.inputWidth}`} 
               type="email"
               name="user_email" 
               placeholder="Email"
               required 
               {...register("user_email")} />
        <br/>
        <div className="margin-top">
          <textarea className={`${"aesthetic-windows-95-text-input"} ${style.textInputWidth}`} 
                    name="message" 
                    placeholder="Message"
                    required
                    {...register("message")} />
        </div>
        <br/>

        {/* button to send */}
        <div className="aesthetic-windows-95-button">
          <button>
              Send
          </button>  
        </div>

        <p id="999" className={`${messageSent ? blueMessageColor : redMessageColor} ${style.statusVisability}`}>{statusMessage}</p> 

         {/*testing message  */}
        <p className={`${messageSent ? blueMessageColor : redMessageColor}`}>{statusMessage}</p> 
      </form>
    </div>
  );
}

export default EmailForm;