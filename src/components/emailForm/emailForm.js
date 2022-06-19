import style from './emailForm.module.css'
import { useForm } from 'react-hook-form'
import emailjs from '@emailjs/browser'
import { useState, useEffect } from 'react'

// utilized info from this blog
// https://placidowang.medium.com/how-to-add-an-email-form-to-your-react-website-for-free-using-emailjs-and-react-hook-form-7267d6365291
// info is a little outdate so we just applied the idea

function EmailForm () {
  const redMessageColor = 'aesthetic-pepsi-red-color'
  const blueMessageColor = 'aesthetic-pepsi-blue-color'

  const { register, handleSubmit, watch, errors } = useForm()
  const [statusMessage, setStatusMessage] = useState('Message')
  const [messageSent, setMessageSent] = useState(false)

  // This was used for debugging
  const testSubmit = (data) => {
    const form = document.querySelector('#contactForm')

    console.log(data)

    console.log('Test send')

    const randomNum = Math.floor(Math.random() * 10)

    console.log('randomNum: ' + randomNum)

    if (randomNum >= 5) {
      // message was a success
      setMessageSent(true) // Color doesn't change but class name does
      setStatusMessage('Message Sent')
      form.reset()
    } else {
      // message was unable to send
      setMessageSent(false)
      setStatusMessage('Failed to Send')
      form.reset()
    }
  }

  const onSubmit = (data) => {
    const form = document.querySelector('#contactForm')

    console.log(data)

    emailjs.send('contact_form', 'template_44bzea7', data, 'MhUewi79r9N_APk3-')
      .then(function (response) {
        console.log('SUCCESS!', response.status, response.text)

        setMessageSent(true)
        setStatusMessage('Message Sent')
        form.reset()
      }, function (error) {
        console.log('FAILED...', error)

        setMessageSent(false)
        setStatusMessage('Failed to Send')
        form.reset()
      })
  }

  useEffect(() => {
    document.getElementById('999').style.setProperty('visibility', 'visible')

    setTimeout(() => {
      document.getElementById('999').style.setProperty('visibility', 'hidden')
    }, 5000)
  })

  return (

    <div className={style.overArchingDiv}>
      <form id='contactForm' className={style.containerFormatting} onSubmit={handleSubmit(onSubmit)}>
        <input
          className={`${'aesthetic-windows-95-text-input'} ${style.inputWidth}`}
          type='text'
          name='user_name'
          placeholder='Name'
          required
          {...register('user_name')}
        />
        <br />
        <input
          className={`${'aesthetic-windows-95-text-input'} ${style.inputWidth}`}
          type='email'
          name='user_email'
          placeholder='Email'
          required
          {...register('user_email')}
        />
        <br />
        <div className='margin-top'>
          <textarea
            className={`${'aesthetic-windows-95-text-input'} ${style.textInputWidth}`}
            name='message'
            placeholder='Message'
            required
            {...register('message')}
          />
        </div>
        <br />

        {/* button to send */}
        <div className='aesthetic-windows-95-button'>
          <button>
            Send
          </button>
        </div>

        <p id='999' className={`${messageSent ? blueMessageColor : redMessageColor} ${style.statusVisability}`}>{statusMessage}</p>
      </form>
    </div>
  )
}

export default EmailForm
