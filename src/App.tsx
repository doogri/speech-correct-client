import React from 'react';
import logo from './logo.svg';
import './App.css';

let mediaRecorder: MediaRecorder;
      


function App() {
  

  function startRecording(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const chunks: Blob[] = [];
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.addEventListener('dataavailable', (event) => {
          chunks.push(event.data);
        });
        mediaRecorder.addEventListener('stop', () => {
         
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          console.log(`number of chunks: ${chunks.length}`);
          
            //const audioUrl = URL.createObjectURL(audioBlob);
            // const link = document.createElement('a');
            // link.href = audioUrl;
            // link.download = 'recording.webm';
            // link.click();

            // Store the audio blob locally
            const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioFile);
            localStorage.setItem('audioUrl', audioUrl);
        });
        mediaRecorder.start();
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  }

  function stopRecording(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    mediaRecorder.stop();
  }

  function playRecording(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    const audioUrl = localStorage.getItem('audioUrl');
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();

      // Send the audio blob to the server
      const audioBlob = new Blob([audioUrl], { type: 'audio/webm' }); 
      
      fetch('/upload-audio', {
        method: 'POST',
        body: audioBlob,
        headers: {
          'Content-Type': 'audio/webm'
        }
      })
        .then(response => {
          // Handle the response from the server
          console.log('Audio uploaded successfully');
        })
        .catch(error => {
          console.error('Error uploading audio:', error);
        });
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={startRecording}>Start Recording</button>
        
        
        <button onClick={stopRecording}>Stop Recording</button>
        <button onClick={playRecording}>Play Recording</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
