import Webpage from '../images/webpage.png'
import Pathfinder from '../images/pathFinding.png'
import Unity from '../images/unity-logo-2.png'
import ConnectFour from '../images/connectFourGame.png'

const data = [
  {
    name: 'Search Demonstrator',
    img: Pathfinder,
    link: 'https://github.com/agl49/searchAlgs',
    textDescription: 'This is a pathfinding algorithm \n\
                          visualizer. I made this program\n\
                          while in college during one of\n\
                          winter breaks. Written in python,\n\
                          it deomstrates some basic path\n\
                          finding algorithms.\n'
  },
  {
    name: 'Top Down Shooter',
    img: Unity,
    link: 'https://github.com/agl49/topDownShooter',
    textDescription: 'This is a 2d game I made with a \n\
                          team for a class in university. \n\
                          We went into the project with \n\
                          zero knowledge regarding game \n\
                          development and had to learn as \n\
                          we implemented the game. \n'
  },
  {
    name: 'Connect Four AI',
    img: ConnectFour,
    link: 'https://github.com/agl49/ConnectFourGame',
    textDescription: "This is another project I completed\n\
                          in university with a team. \n\
                          It's simply an implementation of\n\
                          the min-max-AB algorithm to play\n\
                          connect 4. As you can see its a \n\
                          terminal program.\n"
  },
  {
    name: 'TechsGiving Website',
    img: Webpage,
    link: 'https://github.com/agl49/techsGiving',
    textDescription: 'This was a static website I \n\
                          put together to advertise an \n\
                          event that failed to materialize.\n\
                          It was made using jekyll towards \n\
                          the end of a summer break.\n'
  }
]

export default data
