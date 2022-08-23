import { Helmet } from 'react-helmet'
import LoadScreen from './components/bootAnimation/loadscreen.js'
import SectionTitle from './components/sectionTitle/sectionTitle.js'
import SectionText from './components/sectionText/sectionText.js'
import Container from './components/container/container.js'
import React, { useState, useEffect } from 'react'
import Gallery from './components/gallery/gallery.js'
import data from './components/data.js'
import Logo from './components/logo/logo.js'
import './App.css'
import SectionList from './components/sectionList/sectionList.js'
import EmailForm from './components/emailForm/emailForm.js'
import NavBar from './components/navBar/navBar.js'

// Used for debugging or creating the fanicon
import FaniLogo from './components/logo/faniconLogoGen.js'
import Test from './components/test/test.jsx'

// This version with the loading screen works with what we want to do
// but we are not sure if its the best way to implement a static loading
// screen. Maybe for a projec this small, it's the best way...
// One modification will to make the gif native as part of the website.

//Check out https://robbowen.digital/wrote-about/css-blend-mode-shaders/?utm_source=tldrnewsletter

function App () {
  const introBlurb = {
    title: 'About Me',
    text: "I'm a junior software engineer currently employed by Optum in their technical development program.\n \
                I have a wide range of interests and am constantly working on something.\n\
                For now, I only have my university and inital first project to show off \n\
                but I'll add more as I gain more experience.\n\
                Check out my projects and contact below.\n"

  }

  const cssTheme = {
    title: 'About Css theme',
    text: 'Like the theme I use? Check out the A button on the start bar to check out the source.\n'
  }

  const mySkills = ['Frontend', 'Backend', 'GameDev', 'Ai and Machine learning']

  return (
    <div>
      <LoadScreen />
      <Helmet>
        <style>{'body { background: linear-gradient(#123DFF, #E11C2D) }'}</style>\
        <style>{'body { background-repeat: no-repeat }'}</style>
        <style>{'body { background-attachment: fixed }'}</style>
      </Helmet>

      <Container>
        <Logo />

        <SectionTitle titleName='A D R I A N' textStyle='aesthetic-black-color' />
        <SectionTitle titleName='L O P E Z' textStyle='aesthetic-black-color' />
        <SectionTitle titleName='SOFTWARE DEVELOPER' textStyle='aesthetic-pepsi-blue-color' />

        <SectionText title={introBlurb.title} text={introBlurb.text} />

        <SectionTitle titleName='I N T R E S T S' />

        <SectionList titleName='Items' skills={mySkills} />

        <SectionTitle titleName='P R O J E C T S' />

        <Gallery projects={data} />

        <SectionTitle titleName='C O N T A C T' />

        <EmailForm />

        <SectionTitle titleName='CSS THEME' textStyle='aesthetic-pepsi-red-color' />

        <SectionText title={cssTheme.title} text={cssTheme.text} />

        <NavBar />

      </Container>

    </div>
  )
}

export default App
