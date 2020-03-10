import React, { Component } from 'react';
import './App.css';

// initializaing Speech Recognition
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
recognition.continuous = true; 
recognition.interimResults = true;
recognition.lang = 'en-US';


class App extends Component {
  constructor() {
    super()
    this.state = {
      listening: false // initial value so that event will not listen at the start of the program
    }
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
  }

  // toggles listening state between true(on) and false (off)
  toggleListen() {
    this.setState({
      listening: !this.state.listening
    }, this.handleListen)
  }

  //handle speech recognition stuff here
  handleListen() {
    // Use conditionals to switch between states
    // if listening state is true (button clicked for the first time), start speech recognition
    // else stop speech recognition (button clicked second time to stop listening for event)
    if (this.state.listening) {
      recognition.start()
      recognition.onend = () => {
        console.log("...continue listening...")
        recognition.start()
      }
  } else {
    recognition.stop()
    recognition.onend = () => {
      console.log("Stopped listening per click")
    }
  }
  recognition.onstart = () => {
    console.log("Listening!")
  }

  // collects the trascripts here (mostly taken from the documentation)
  let finalTranscript = ''
    recognition.onresult = event => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }
      document.getElementById('interim').innerHTML = interimTranscript
      document.getElementById('final').innerHTML = finalTranscript
    }
    const transcriptArr = finalTranscript.split(' ')
    const stopCmd = transcriptArr.slice(-3, -1)
    console.log('stopCmd', stopCmd)

    if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening'){
      recognition.stop()
      recognition.onend = () => {
        console.log('Stopped listening per command')
        const finalText = transcriptArr.slice(0, -3).join(' ')
        document.getElementById('final').innerHTML = finalText
      }
    }
  
  recognition.onerror = event => {
    console.log("Error occurred in recognition: " + event.error)
  }

}

  // change button states here
  render() {
    return (
      <div className = "container">
        <h1>Speech Note Pad</h1>
        <button className='microphone-btn' onClick={this.toggleListen}><span>Record</span></button>
        <div id='interim'></div>
        <div id='final'></div>
      </div>
    )
  }

}

export default App

// button 
// <!DOCTYPE html>
// <html>
// <head>
// <style>
// .button {
//   display: in-line block;
//   border-radius: 4px;
//   background-color: #f4511e;
//   border: none;
//   color: #FFFFFF;
//   text-align: center;
//   font-size: 28px;
//   padding: 20px;
//   width: 200px;
//   transition: all 0.5s;
//   cursor: pointer;
//   margin: 5px;
//   outline: none;
//   box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
// }

// .button span {
//   cursor: pointer;
//   display: inline-block;
//   position: relative;
//   transition: 0.5s;
// }

// .button span:after {
//   content: '\00bb';
//   position: absolute;
//   opacity: 0;
//   top: 0;
//   right: -20px;
//   transition: 0.5s;
// }

// .button:hover span {
//   padding-right: 25px;
// }

// .button:hover span:after {
//   opacity: 1;
//   right: 0;
// }
// .button:active {
//   background-color: #3e8e41;
//   box-shadow: 0 5px #666;
//   transform: translateY(4px);
// }
// </style>
// </head>
// <body>

// <button class="button" style="vertical-align:middle"><span>Record</span></button>

// </body>
// </html>
