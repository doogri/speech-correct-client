import React from 'react';
import './App.css';

let mediaRecorder: MediaRecorder;
      


function App() {


  const [isRecording, setIsRecording] = React.useState(false);

  function startRecording(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const chunks: Blob[] = [];
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.addEventListener('dataavailable', (event) => {
          chunks.push(event.data);
        });
        mediaRecorder.addEventListener('stop', () => {
          setIsRecording(false); // Set isRecording to false when recording stops
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioFile);
          localStorage.setItem('audioUrl', audioUrl);
        });
        setIsRecording(true); // Set isRecording to true when recording starts
        mediaRecorder.start();
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  }

  // Add a conditional class to the button based on the isRecording state
  const recordingButtonClass = isRecording ? 'recording' : '';

  

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
        <button onClick={startRecording} className={recordingButtonClass}>
          {isRecording ? 'Recording...' : 'Start Recording'}
        </button>
        
        <button onClick={stopRecording}>Stop Recording</button>
        <button onClick={playRecording}>Play Recording</button>
      </header>
    </div>
  );
}

export default App;
