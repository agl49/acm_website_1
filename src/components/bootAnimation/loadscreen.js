import './loadscreen.scss'

function LoadScreen () {
  return (
  // Have the larger div cover the whole screen
  // and have it fade away after a little bit
    <div className='boot-animation'>
      {/* gif */}

      <iframe src='https://giphy.com/embed/3osxYhj4VNwxHdlE9G' width='480' height='480' frameBorder='0' title='loading gif' />

      {/* text */}
      <h1 className='aesthetic-white-color'>
        Loading Page...
      </h1>
      {/* load bar */}
      <div className='aesthetic-windows-95-loader'>
        <div />
        <div />
        <div />
      </div>
    </div>
  )
}

export default LoadScreen
