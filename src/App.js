import Test from "./components/test/test.jsx";
import {Helmet} from "react-helmet";
import LoadScreen from "./components/bootAnimation/loadscreen.js";
import SectionTitle from "./components/sectionTitle/sectionTitle.js";
import SectionText from "./components/sectionText/sectionText.js";
import Container from "./components/container/container.js";
import React, { useState, useEffect } from "react";
import Gallery from "./components/gallery/gallery.js";
import data from "./components/data.js";
import Logo from "./components/logo/logo.js";
import "./App.css";
import SectionList from "./components/sectionList/sectionList.js";
import EmailForm from "./components/emailForm/emailForm.js";
import NavBar from "./components/navBar/navBar.js";
import FaniLogo from "./components/logo/faniconLogoGen.js";

//importing assets
import logo from "./images/ACM(transperent).png";

// This version with the loading screen works with what we want to do 
// but we are not sure if its the best way to implement a static loading
// screen. Maybe for a projec this small, it's the best way...
// One modification will to make the gif native as part of the website.
function App() {
    let introBlurb = {
        title : "About Me",
        text : "This is a long string to test the functionality of this component. Long string this is a long string with no line breaks in the editor. Test test test.\n \
                Main it sucks writting this by hand, I hope I can figure this out. Now we'll see if the tage works\n\
                I hope it does. More text. More text. Test jklasdjf ksjdofi jkdjfo kjoifjasdfkljo oiasdfjk oaidfj oisadjf lk oasidjf adsk jnie inco snoe fir jf mcosi fmiejf f\n \
                sdaf kjfoasdijf lkjdfoaijke kdn cijw fow jijd aoie nnbvu wjkd ociw jdk wofk nkje icnf ownkd fic kasjie jfkc i \n\
                more text after a space\n\
                we are adding more text to see if it grows properly\n\
                kjdflasjdl fkjslkjfl kjflkjsdfljlk jfdjfsjldfjkksldjfl ksdjflkjdsfk\n\
                sjdklfjl ksdjflksdjflksdjflkajl fjlksdfjlj fkjflkdjfllkdjflsj",
                
    }

    const mySkills = ["Frontend", "Backend", "GameDev", "Ai and Machine learning"];

    return (
        <div>
            <LoadScreen></LoadScreen>
            <Helmet>
                <style>{"body { background: linear-gradient(#c774e8, #94d0ff) }"}</style>\
                <style>{"body { background-repeat: no-repeat }"}</style>
                <style>{"body { background-attachment: fixed }"}</style>
            </Helmet>
            
            <Container>
                <Logo/> 
                
                <FaniLogo/>

                {/* Glitch effect seems to only work for 13 characters */}
                <SectionTitle titleName="A D R I A N" textStyle="aesthetic-black-color"/>
                <SectionTitle titleName="L O P E Z" textStyle="aesthetic-black-color"/>
                <SectionTitle titleName="SOFTWARE DEVELOPER" textStyle="aesthetic-pepsi-blue-color"/>

                <SectionText title={introBlurb.title} text={introBlurb.text}/>

                <SectionTitle titleName="I N T R E S T S"/>

                <SectionList titleName="Items" skills={mySkills}/>

                <SectionTitle titleName="P R O J E C T S"/>      

                <Gallery projects={data}/>

                <SectionTitle titleName="C O N T A C T"/>  

                {/* Testing this part */}
                <EmailForm/>

                <NavBar/>   

            </Container> 
         
        </div>
    );
}





// function App() {
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         setTimeout(() => setLoading(false), 7000)
//     }, []);
  
//     return (
//         <div>
//             {loading === false ? (
//                 <div>
//                     <Helmet>
//                         <style>{"body { background: linear-gradient(#c774e8, #94d0ff) }"}</style>\
//                         <style>{"body { background-repeat: no-repeat }"}</style>
//                         <style>{"body { background-attachment: fixed }"}</style>
//                     </Helmet>

//                     <p>Random Text</p>
          
         
//                     <Test/>
//                 </div>
//             ) : (
//                 <LoadScreen></LoadScreen>
//             ) }
//         </div>
//     );
// }

export default App;
