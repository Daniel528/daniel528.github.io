// sass --watch style.scss style.css
// browser-sync start --server --files ./*, ./css/*.css

const APP_STATE = {
  HOME:'home',
  DESIGN:'design',
  DEV:'dev',
  ABOUT:'about'
}

function playAnimation(animations, callBack) {
    const animationsPlayed = animations.map( x => false);
    const hasFinished = (i) => {
      animationsPlayed[i] = true;
      if(!animationsPlayed.includes(false)){
        animations.map( x => x.ele.classList.remove(x.clazz));
        if (callBack) callBack();
      }
    }
    for (let i = 0; i < animations.length; i++) {
      const a = animations[i];
      const animate = (e) => {
        e.stopPropagation();
        a.ele.removeEventListener('animationend', animate);
        hasFinished(i);
      }
      a.ele.addEventListener('animationend', animate);
      a.ele.classList.add(a.clazz)
    }
}

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      nav:APP_STATE.DEV,
      navOpen: false,
      isMobile: document.body.clientWidth <= 1024
    }
    this.handleNavClick = this.handleNavClick.bind(this);
    this.handleNavToggle = this.handleNavToggle.bind(this);
  }

  componentDidMount(){
    window.addEventListener('resize', () => {
      if(this.state.isMobile != document.body.clientWidth <= 1024){
        this.setState({
          isMobile: document.body.clientWidth <= 1024
        })
      }
    })
  }

  handleNavClick(e, newAppState){
    e.preventDefault();
    const stateChange = { nav : newAppState }

    if(this.state.isMobile && this.state.navOpen){
      stateChange.navOpen = false;
    }

    const callBack = () => this.setState(stateChange)

    if(this.state.nav == APP_STATE.HOME){
      // from home to main content pages
      const toCheck = [APP_STATE.ABOUT, APP_STATE.DESIGN, APP_STATE.DEV]
      const animations = [];
      for (let i = 0; i < toCheck.length; i++) {
        const e = toCheck[i];
        if(e != newAppState){
          animations.push({
            ele:document.querySelector('.nav-' + e),
            clazz:'fadeOutHome'
          })
        } else {
          animations.push({
            ele:document.querySelector('.nav-' + e),
            clazz:'hangForASecond'
          })
        }
      }
      playAnimation(
        [{
          ele:document.querySelector('#name-plate'),
          clazz:'fadeOutHome'
        },
        ...animations],
        callBack)
    } else if(stateChange.nav != APP_STATE.HOME) {
      // from content pages
      playAnimation(
        [
          {
            ele:document.querySelector('.active'),
            clazz: 'pseudoSpinAway'
          },
          {
            ele: document.querySelector('#primary-content'),
            clazz:'fadeOutLong'
          }
        ],
        callBack)
    } else {
      // content page to home
      
      playAnimation(
        [
          {
            ele:document.querySelector('.content'),
            clazz:'fadeOutLong'
          },
          {
            ele:document.querySelector('#root'),
            clazz:'peace'
          }
        ],
        callBack
      );  
    }

 
    
  }

  handleNavToggle(e){
    e.preventDefault();
    this.setState({
      navOpen: !this.state.navOpen
    }) 
  }

  render(){
    if(this.state.nav == APP_STATE.HOME){
      return(
        <div className="home"
        id="animate-home">
          <div id="name-plate">
            <h1>Daniel Fraser</h1>
            <h2>Front End Developer & Designer</h2>
            <div className="circle-animation">
              <div className="front"></div>
              <div className="spin"></div>
              <div className="back">
                <div className="left"></div>
                <div className="right"></div>
              </div>
            </div>
          </div>
          <div>
            <button 
              className="nav-design"
              onClick={(e) => this.handleNavClick(e, APP_STATE.DESIGN)}>
                Design
            </button>
            <button 
              className="nav-dev"
              onClick={(e) => this.handleNavClick(e, APP_STATE.DEV)}>
                Dev
            </button>
            <button 
              className="nav-about"
              onClick={(e) => this.handleNavClick(e, APP_STATE.ABOUT)}>
                About
            </button>
          </div>
        </div>
      )
    } else {
      var content;
      switch(this.state.nav){
        case APP_STATE.DESIGN:
          content = <Design />;
          break;
        case APP_STATE.DEV:
          content = <Dev />;
          break;
        case APP_STATE.ABOUT:
          content = <AboutMe />
          break;
        default:
          content = <p>Failed to render. Let me know if this happened pls.</p>
      }

      var burgerMenu = null;
      var burgerClass = '';
      if(this.state.isMobile) {
        burgerMenu =  <BurgerMenu 
        open={this.state.navOpen}
        handleNavToggle={this.handleNavToggle}/>
        burgerClass = this.state.navOpen ? 'nav-open' : 'nav-closed'
      }



      return (
        <div className={"content " + burgerClass}>
          {burgerMenu}
          <NavBar 
          handleNavClick={this.handleNavClick}
          navState={this.state.nav} />
          {content}
        </div>
        )
    }
  }
}

const BurgerMenu = ({open, handleNavToggle}) => {
  return(
    <div className={"burger-menu " + (open ? 'burger-open' : 'burger-closed')} 
      onClick={handleNavToggle}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

const NavBar = ({handleNavClick, navState}) => {

  const handleEmailCopy = (e) => {
    e.preventDefault();
    e.clipboardData.setData('text/plain','danielfraser1205@gmail.com');
  }

  return(
    <nav>
        <div className={"nav-container"}>
          <button 
          className="nav-home"
          onClick={(e) => handleNavClick(e, APP_STATE.HOME)}>
            Daniel Fraser
          </button>
          <button 
          className={`nav-design ${navState == APP_STATE.DESIGN ? 'active' : ''}`}
          onClick={(e) => handleNavClick(e, APP_STATE.DESIGN)}>
            Design
          </button>
          <button 
          className={`nav-dev ${navState == APP_STATE.DEV ? 'active' : ''}`}
          onClick={(e) => handleNavClick(e, APP_STATE.DEV)}>
            Dev
          </button>
          <button 
          className={`nav-about ${navState == APP_STATE.ABOUT ? 'active' : ''}`}
          onClick={(e) => handleNavClick(e, APP_STATE.ABOUT)}>
            About
          </button>
          <div className="socials">
          <a href="https://github.com/Daniel528"
          target="_blank"
          role="button">
            <img src="./resources/github.svg" />          
          </a>
          <a href="https://www.instagram.com/daniel_fraser528/?hl=en"
          target="_blank"
          role="button">
            <img src="./resources/instagram.svg"/>
          </a>
          <a href="https://au.linkedin.com/in/daniel-fraser-a2b814125"
          role="button"
          target="_blank">
            <img src="./resources/linkedin.svg"/>
          </a>
          </div>
          <a role="button"
          href="./resources/resume.pdf"
          target="_blank"
          className='open-resume'>
            Open Resume
          </a>
          <a href="mailto:danielfraser1205@gmail.com"
          role="button" >
            <img className="email"
            id="email-image"
            onCopy={handleEmailCopy}
            src={document.body.clientWidth >= 1024 ?
             "./resources/email-font.svg" : "./resources/email-outline.svg"}/>          
          </a>
        </div>
      </nav>
  )
}

const Design = () => {
  return(
    <div className="design" id="primary-content">
      <h1>Product/UX Design</h1>
      <h2>Work Breakdown - Micromelon</h2>
      <p>
      Micromelon builds robots for classrooms to learn programming with a focus on providing an experience that best serves the teachers. Before starting at Micromelon I had done work in teaching programming & robotics in schools and saw the issues with other solutions used in schools and was passionate about designing a better solution for teachers. 
      <br/><br/>
      My role included user research through discussion with teachers & students. Ideating product features that fit the needs of users based on acquired research. Creating visual designs & prototypes of these ideas with Adobe XD. Validating designs & research through user testing with teachers.
      </p>
      <h3>At Micromelon I worked on</h3>
      <ul className="key-contributions">
        <li>Primarily the product, designing  & developing the software used by teachers and students to control robots.</li>
        <li>End-to end-execution from insight and concept to product delivery.</li>
        <li>Designing the structure and delivery methods of digital and physical lesson plans to schools.</li>
        <li>Company website, digital & physical marketing materials.</li>
      </ul>
      <Video 
      id='playground'
        videoSrc="./resources/playground.mp4"
        caption="Micromelon coding environment used to program robots and manage projects." />
      <Video 
      id='dashboard'
        videoSrc="./resources/dashboard.mp4"
        caption="The teaching dashboard used by teachers to manage their school and classes." />
      <h2>Micromelon Challenges & Process</h2>
      <p>
      Healthy design requires critique and testing. Testing for software used in classrooms is a difficult procedure. Typical lab style user testing that has a user step through a set of tasks in a controlled environment under the watchful eye of a test coordinator who is recording notes is a great method of finding issues with a design. Lab user testing doesn't do a good job of capturing the atmosphere of a classroom at 2:30pm with 25 unsettled kids that a teacher might need to deal with when using classroom software. For my designs to be quality I saw it as a necessity for my work to be tested in an actual classroom. 
      </p>
      <h3>Introducting the 10 week design cycle</h3>
      <p>
        Micromelon offers 10 week courses for schools where we teach a 1 hour session to a class each week. I used these courses for a simple 1 week design/dev sprint. The process is as followed
      </p>
      <div className="numbered-list">
        <p className="number">1</p><p>
        During class session take notes on work patterns from teacher, issues students had, issues teachers had etc.
        </p>
        <p className="number">2</p><p>
        After session, organize notes and draw insights from common trends or issues faced.
        </p>
        <p className="number">3</p><p>
        Prioritize insights and start compiling potential fixes.
        </p>
        <p className="number">4</p><p>
        Create quick design prototype, test internally and revise design. 
        </p>
        <p className="number">5</p><p>
          Build the design in-time for the next weeks workshop. 
        </p>
        <p className="number">6</p><p>
        Treat the next workshop as a testing session, take notes on how effective design is and make changes if necessary.
        </p>
        <p className="number">7</p><p>Repeat</p>
      </div>
      <h3>Process Takeaways</h3>
      <p>
      This cycle allows for extremely rapid development and a clear defined healthy feedback and critique loop with actual users. What's better is that each 10 week cycle can be devoted to a specific function around the application with intense detail applied or more broadly and an exploratory device to find and solve many smaller issues
      </p>
      <p className="more-examples">
        For more work examples send me an 
        <a href="mailto:danielfraser1205@gmail.com"
        role="button">
          <span> email </span>
        </a>
        with what you are curious about.
      </p>
    </div>
  )
}

const Video = ({ videoSrc, id, caption }) => {
  const [isFull, setIsFull] = React.useState(false);

  React.useEffect(() => {
    const listenForScroll = () => {
      minimize()
      setIsFull(false)
      document.querySelector('#root').removeEventListener('scroll', listenForScroll)
    };
    if(isFull){
      document.querySelector('#root').addEventListener('scroll', listenForScroll)
    }
  })

  const maximize = () => {
    const video = document.querySelector('#' + id);
    const videoSize = video.getBoundingClientRect();
    const vidContainer = document.querySelector('#container' + id);
    video.classList.add('video-fullscreen');
    vidContainer.style.width = videoSize.width + 'px';
    vidContainer.style.height = videoSize.height + 'px';
    video.style.width = videoSize.width + 'px';
    video.style.left = videoSize.left + 'px';
    video.style.top = videoSize.top + 'px';
    setTimeout(() => {
      video.style.transition = "all 0.5s";
      var xMovement = (document.body.clientWidth/2 - (video.offsetWidth/2+videoSize.left));
      var yMovement = (document.body.clientHeight/2 - (video.offsetHeight/2+videoSize.top));
      const generateScaleAmount = () => {
        var i = 50;
        var amount = (document.body.clientHeight - i)/video.offsetHeight;
        while (video.offsetWidth*amount > document.body.clientWidth){
          i = i + 50;
          amount = (document.body.clientHeight - i)/video.offsetHeight
        }
        return amount;
      }
      var scaleAmount = generateScaleAmount();
      video.style.transform = 'translateX('+xMovement+'px) translateY('+yMovement+'px) scale('+scaleAmount+')'
    }, 0)  
     
  }
  const minimize = () => {
    // document.querySelector('#container' + id).style = 'width:100%;height:fit-content;';
    document.querySelector('#' + id).style = 'transition: all 0.5s ease 0s; position: initial;'
  }


  const handleClick = () => {
  
    if(!isFull){
      maximize()
    } else {
      minimize()
    }
  
    setIsFull(!isFull)
  }

  const conditionalStyle = {
    minHeight: '500px'
  }



  return(
    <div>
      <div className={isFull ? 'video-container fullscreen' : 'video-container'} 
          id={'container' + id}
          style={isFull ? conditionalStyle : null}>
            <video
            id={id}
            className={isFull ? 'video-fullscreen' : 'video-minimized'}
            onClick={handleClick}
            autoPlay
            loop
            muted
            src={videoSrc} 
            />
        </div>
      <p className="caption">{caption}</p>
    </div>
    
  )
}

const Dev = () => {
  return(
    <div className="dev" id="primary-content">
      <h1>Front End Development</h1>
      <p>
      I'm a front end web developer. I work most confidently with building interfaces. Although working with browser compatibility, breakpoints and the DOM can be frustrating I enjoy writing clean and efficient CSS and JavaScript. I enjoy bringing to life difficult animations and displays that require more thinking than a simple grid of elements. Even though I feel confident with JavaScript I enjoy learning more and more about positive software patterns to help me write code that reads easily and executes smoothly with consideration of limits like browser load times. 
      </p>
      <div className="col-2">
        <div>
          <h3>Confident Skills</h3>
          <ul>
            <li>HTML</li>
            <li>CSS/SCSS/LESS</li>
            <li>Bootstrap</li>
            <li>Javascript</li>
            <li>ReactJS</li>
            <li>jQuery</li>
          </ul>
        </div>
        <div>
          <h3>Some Experience With</h3>
          <ul>
            <li>PHP</li>
            <li>VueJS</li>
            <li>NodeJS</li>
            <li>Java</li>
            <li>C#</li>
            <li>Python</li>
          </ul>
        </div>
      </div>
      <h2>Work Breakdown - Micromelon</h2>
      <p>
      Micromelon software is an electron application. The front-end is mostly constructed with ReactJS and the backend is written in NodeJS communicating with a Postgress database. I worked on the front end of the application writing primarily in ReactJS and vanilla JS. On top of this I wrote all CSS/HTML.
      </p>
      <h3>Key Contributions</h3>
      <ul className="key-contributions">
        <li>Designed and developed of interaction animations with native CSS animations.</li>
        <li>Worked on both the main and renderer processes of the electron app.</li>
        <li>Helped manage and propagate data effectively through the ReactJS components for synchronous communication between teacher & student applications.</li>
      </ul>
      <p className="more-examples">
        For more work examples send me an 
        <a href="mailto:danielfraser1205@gmail.com"
        role="button">
          <span> email </span>
        </a>
        with what you are curious about.
      </p>
    </div>
  )
}

const AboutMe = () => {
  return(
    <div className="about" id="primary-content">
      <h1>More About Me</h1>
      <p>
      So you are probably here because I applied for a job you are offering. I’ll keep this brief then, I am literally the best person ever in the entire world. Birds sing and trees sway faster in a very small but measurable way when I approach. Well not really, the birds part is a lie but the trees thing is real, trust me.
      <br /><br />
      Professional stuff aside, I enjoy lots of other cool stuff. I like computer things in general, playing games and watching shows. I also make awesome burgers, like amazing burgers. I enjoy my comedy a lot, I do improv comedy with friends every week. Also, love playing for fun sports and cool beach trips. I feel like I’m super typical.....
      <br /><br />
      Ok I have a joke for you. Why are there no Nurofen in the jungle?
      <br /><br />
      Parrots-eat-em-all. Get it, it sounds like paracetamol. Not to brag but I'm pretty funny with a radical style (my mum's words) and can even do a kick flip, as long as it's on grass so I don’t hurt myself when if I fall.
      </p>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);