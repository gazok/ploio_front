import React, { useState } from 'react';
import { Button, Card, Checkbox, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Dropdown, Input, Label, Link, Option, ProgressBar, Slider, Textarea, makeStyles, shorthands, tokens, useId } from '@fluentui/react-components';
import { PersonRegular, LockClosedRegular, ArrowLeftRegular, ArrowRightRegular, ArrowForwardDownPersonRegular } from '@fluentui/react-icons'
import { useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import '../css/Home.css';

const useStyles = makeStyles({
  section: {
    width: "fit-content",
    position: "absolute",
    top:"50%",
    left: "50%",
    transform: "translate(-40%, -45%)",
  },
  dropdown: {
    maxWidth: "30px",
  }
});

export const HomePage1: React.FC = () => {
  const styles = useStyles();

  const [ home1, setHome1 ] = useState(true);
  const [ home2, setHome2 ] = useState(false);
  const [ home3, setHome3 ] = useState(false);
  const [ home4, setHome4 ] = useState(false);
  
  const switchTo2 = () => {
    setHome1(false);
    setHome2(true);
    setHome3(false);
    setHome4(false);
  }

  const switchTo3= () => {
    setHome1(false);
    setHome2(false);
    setHome3(true);
    setHome4(false);
  }

  const switchTo4 = () => {
    setHome1(false);
    setHome2(false);
    setHome3(false);
    setHome4(true);
  }

  const switchReset = () => {
    setHome1(true);
    setHome2(false);
    setHome3(false);
    setHome4(false);
  }

  return (
    <div className="content">
        <div className={styles.section}>
            <Card className='homepage-card'>
                {home1 && (
                    <div className='homepage-cardfield'>
                        <h1>About πλοίο</h1> <br></br>
                        <b>Perfect Container Monitoring Platform</b> <br></br>
                         <br></br><br></br><br></br><br></br>
                        <b>Visualize packets in your Infrastructure</b> <br></br>
                         <br></br><br></br><br></br><br></br>
                        <b>Import modules anything what you want</b> <br></br>
                         <br></br><br></br><br></br><br></br>
                        <b>Open Source</b> <br></br>
                         <br></br><br></br><br></br><br></br>

                        <div className='homepage-button1'>
                            <Button appearance='primary' icon={<ArrowRightRegular />} iconPosition="after" onClick={switchTo2}>Next</Button>
                        </div>
                    </div>
                )}
                {home2 && (
                    <div className='homepage-cardfield'>
                        <h1>Visualize packets in your Infrastructure</h1> <br></br><br></br>
                        You can monitor your application operating environment via visualized packets. <br></br>
                        Every container's networking is visualized and you can easily monitor it. <br></br>
                        <br></br>

                        <div className='homepage-animation1'>
                            <div className='homepage-animation1-dummybox'></div>
                            <div className='homepage-animation1-box1'>Pod2</div>
                            <div className='homepage-animation1-box2-initial'>Server</div>
                            <div className='homepage-animation1-box2'>Server</div>
                            <div className='homepage-animation1-box3'>Pod1</div>

                            <div className='homepage-animation1-packet1-1'></div>
                            <div className='homepage-animation1-packet1-2'></div>
                            <div className='homepage-animation1-packet1-3'></div>
                            <div className='homepage-animation1-packet1-4'></div>
                            <div className='homepage-animation1-packet1-5'>E</div>
                            <div className='homepage-animation1-packet1-6'>E</div>

                            <div className='homepage-animation1-packet2-1'></div>
                            <div className='homepage-animation1-packet2-2'></div>
                            <div className='homepage-animation1-packet2-3'></div>
                            <div className='homepage-animation1-packet2-4'></div>
                            <div className='homepage-animation1-packet2-5'></div>
                            <div className='homepage-animation1-packet2-6'></div>

                            <div className='homepage-animation1-packet3-1'></div>
                            <div className='homepage-animation1-packet3-2'></div>
                            <div className='homepage-animation1-packet3-3'></div>
                            <div className='homepage-animation1-packet3-4'></div>
                            <div className='homepage-animation1-packet3-5'></div>
                            <div className='homepage-animation1-packet3-6'></div>
                        </div>
                        <br></br>

                        <div className='homepage-button'>
                            <Button appearance='secondary' icon={<ArrowLeftRegular />} iconPosition="before" onClick={switchReset}>Back</Button>
                            <Button appearance='primary' icon={<ArrowRightRegular />} iconPosition="after" onClick={switchTo3}>Next</Button>
                        </div>
                    </div>
                )}
                {home3 && (
                    <div className='homepage-cardfield'>
                        <h1>Import modules anything what you want</h1> <br></br><br></br>
                        Add any modules what you want <br></br>
                        It could be IDS modules, log modules, etc ...
                        <br></br>

                        <div className='homepage-animation2'>
                            <div className='homepage-animation2-box1'>M1</div>
                            <div className='homepage-animation2-box2'>M2</div>
                            <div className='homepage-animation2-box3'>M3</div>

                            <div className='homepage-animation2-packet1-1'></div>
                            <div className='homepage-animation2-packet1-2'></div>
                            <div className='homepage-animation2-packet1-3'></div>
                            <div className='homepage-animation2-packet1-4'></div>
                            <div className='homepage-animation2-packet1-5'></div>
                            <div className='homepage-animation2-packet1-6'></div>
                            <div className='homepage-animation2-packet1-7'></div>
                            <div className='homepage-animation2-packet1-8'></div>
                            <div className='homepage-animation2-packet1-9'></div>
                            <div className='homepage-animation2-packet1-10'></div>
                            <div className='homepage-animation2-packet1-11'></div>
                            <div className='homepage-animation2-packet1-12'></div>
                            <div className='homepage-animation2-packet1-13'></div>
                            <div className='homepage-animation2-packet1-14'></div>
                            <div className='homepage-animation2-packet1-15'></div>
                            <div className='homepage-animation2-packet1-16'></div>
                            <div className='homepage-animation2-packet1-17'></div>
                            <div className='homepage-animation2-packet1-18'></div>
                            <div className='homepage-animation2-packet1-19'></div>
                            <div className='homepage-animation2-packet1-20'></div>
                        </div>
                        <br></br>

                        <div className='homepage-button'>
                            <Button appearance='secondary' icon={<ArrowLeftRegular />} iconPosition="before" onClick={switchTo2}>Back</Button>
                            <Button appearance='primary' icon={<ArrowRightRegular />} iconPosition="after" onClick={switchTo4}>Next</Button>
                        </div>
                    </div>
                )}
                {home4 && (
                    <div className='homepage-cardfield'>
                        <h1>Open Source</h1> <br></br><br></br>
                        Free to use <br></br>
                        Anyone can become contributor <br></br>
                        Following our API, you could become a module programmer for πλοίο <br></br>
                        <br></br>

                        <div className='homepage-button'>
                            <Button appearance='secondary' icon={<ArrowLeftRegular />} iconPosition="before" onClick={switchTo3}>Back</Button>
                            <Button appearance='primary' icon={<ArrowRightRegular />} iconPosition="after" onClick={switchReset}>Done</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    </div>
  );
}