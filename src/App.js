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

