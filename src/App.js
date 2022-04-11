import Test from "./components/test/test.jsx";
import {Helmet} from "react-helmet";
import LoadScreen from "./components/bootAnimation/loadscreen.js";
import SectionTitle from "./components/sectionTitle/sectionTitle.js";
import SectionText from "./components/sectionText/sectionText.js";
import Container from "./components/container/container.js";
import React, { useState, useEffect } from "react";
import PCarousel from "./components/personalCarousel/pCarousel.js";
import Logo from "./components/logo/logo.js";

//importing assets
import logo from "./images/ACM(transperent).png";

// This version with the loading screen works with what we want to do 
// but we are not sure if its the best way to implement a static loading
// screen. Maybe for a projec this small, it's the best way...
// One modification will to make the gif native as part of the website.
function App() {
    let introBlurb = {
        title : "ACM?",
        text : "This is a long string to test the functionality of this component. Long string this is a long string with no line breaks in the editor. Test test test.\n \
                Main it sucks writting this by hand, I hope I can figure this out. Now we'll see if the tage works\n\
                I hope it does. More text. More text. Test jklasdjf ksjdofi jkdjfo kjoifjasdfkljo oiasdfjk oaidfj oisadjf lk oasidjf adsk jnie inco snoe fir jf mcosi fmiejf f\n \
                sdaf kjfoasdijf lkjdfoaijke kdn cijw fow jijd aoie nnbvu wjkd ociw jdk wofk nkje icnf ownkd fic kasjie jfkc i \n\
                \n\
                more text after a space",
                
    }
    
    const cardBreakPoints = [
      { width: 1, itemsToShow: 1},
      { width: 550, itemsToShow: 2, itemsToScroll: 2 },
      { width: 850, itemsToShow: 3 },
      { width: 1150, itemsToShow: 4, itemsToScroll: 2 },
      { width: 1450, itemsToShow: 5 },
      { width: 1750, itemsToShow: 6} 
    ];

    return (
        <div>
            <LoadScreen></LoadScreen>
            <Helmet>
                <style>{"body { background: linear-gradient(#c774e8, #94d0ff) }"}</style>\
                <style>{"body { background-repeat: no-repeat }"}</style>
                <style>{"body { background-attachment: fixed }"}</style>
            </Helmet>
            
            <Container>
                {/* Glitch effect seems to only work for 13 characters */}
                <SectionTitle titleName="T e x a s S t a t e"/>
                <SectionTitle titleName="A C M" glitch="true"/>
                <SectionTitle titleName="C h a p t e r" imagePath={logo}/>

                {/* Our logo testing area */}

                <Logo/> 

                {/* Testing */}
                {/* <div>
                    <p>Random Text</p>
                    <Test/>
                </div> */}

                <SectionText title={introBlurb.title} text={introBlurb.text}/>

                <SectionTitle titleName="G a l l a r y"/>      

                {/* This should take in props to determine breakpoints and such */}
                {/* Also should pass a lot of other specific parms */}
                <PCarousel breakPoints={cardBreakPoints}/>

            </Container> 
         
            <Test/>
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
