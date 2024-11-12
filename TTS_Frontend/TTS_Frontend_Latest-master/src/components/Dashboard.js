// import React, { useState } from 'react';
// import axios from 'axios';
// import './Dashboard.css';
// import NavBar from './NavBar';
// import FileSaver from 'file-saver';  // Add this package for saving files
// config.dotenv()

// const Dashboard = ({ onLogout }) => {
//     const [textInput, setTextInput] = useState('');
//     const [urlInput, setUrlInput] = useState('');
//     const [language, setLanguage] = useState('en'); // Default language set to English
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const handleTextToSpeech = async () => {
//         console.log("Convert button clicked");
//         setError('');
//         setLoading(true);
//         try {
            
//             console.log("inside")
//             let inputData = inputType === 'url' ? url : 'text';

//             try {
//                 const response = await Axios.post('api/text_to_speech/convert_text_to_speech', {
//                     input_type: inputData,
//                     text: text
//                 },{
        
//                     headers: {
//                         "Content-Type": "application/json"
//                     }
//                     // withCredentials: true
//                 });
            
//             // API call to backend
//             // const response = await axios.post('https://d999-2620-101-f000-7c0-00-1-793c.ngrok-free.app/', {
//             //     input_type: inputData,
//             //     text: text
//             // }, {
//             //     responseType: 'application/JSON' // Important to set responseType to 'blob' to handle audio files
//             // });

//             console.log(response)

//             // Create a URL for the received audio file
//             // const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
//             const audioUrl = response.url //URL.createObjectURL(audioBlob);
//             setAudioUrl(audioUrl); // Set the audio URL for the audio element
//         } catch (err) {
//             setError('Failed to convert text to speech. Please try again.');
//             console.error(err);
//         }
//         setLoading(false);
    
//     };
    

//     return (
//         <div className="dashboard-wrapper">
//             <NavBar onLogout={onLogout} />
//             <div className="dashboard-container container">
//                 <div className="header">
//                     <h2>Text to Speech Converter</h2>
//                 </div>
//                 {error && <p className="error-message">{error}</p>}
//                 <div className="input-group">
//                     <label htmlFor="textInput">Enter Text:</label>
//                     <textarea
//                         id="textInput"
//                         value={textInput}
//                         onChange={(e) => setTextInput(e.target.value)}
//                         placeholder="Enter text here..."
//                     />
//                 </div>
//                 <div className="input-group">
//                     <label htmlFor="urlInput">Or Enter URL:</label>
//                     <input
//                         type="text"
//                         id="urlInput"
//                         value={urlInput}
//                         onChange={(e) => setUrlInput(e.target.value)}
//                         placeholder="https://example.com"
//                     />
//                 </div>

//                 {/* Language Selection Dropdown */}
//                 <div className="input-group">
//                     <label>Select Language: </label>
//                     <select value={language} onChange={(e) => setLanguage(e.target.value)}>
//                         <option value="en">English</option>
//                         <option value="es">Spanish</option>
//                         <option value="fr">French</option>
//                         <option value="de">German</option>
//                         <option value="zh">Chinese</option>
//                     </select>
//                 </div>

//                 <button onClick={handleTextToSpeech} disabled={loading}>
//                     {loading ? 'Converting...' : 'Convert to Speech'}
//                 </button>
//             </div>
//         </div>
//     );
// };
// }

// export default Dashboard;

import React, { useState } from 'react';
import Axios from 'axios';
import NavBar from './NavBar'; // Adjust the import according to your project structure

const Dashboard = ({ onLogout }) => {
    const [textInput, setTextInput] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [language, setLanguage] = useState('en'); // Default language set to English
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [audioUrl, setAudioUrl] = useState(''); // Added state for audio URL

    const handleTextToSpeech = async () => {
        console.log("Convert button clicked");
        setError('');
        setLoading(true);
        try {
            console.log("inside");
            let inputData = urlInput ? urlInput : textInput; // Assuming you meant this logic

            try {
                const response = await Axios.post('api/text_to_speech/convert_text_to_speech', {
                    input_type: urlInput ? 'url' : 'text', // Assuming this logic
                    text: inputData,
                }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                console.log(response);

                // Create a URL for the received audio file
                const audioUrl = response.data.audioUrl; // Assuming this is where you get the URL from
                setAudioUrl(audioUrl); // Set the audio URL for the audio element
            } catch (err) {
                setError('Failed to convert text to speech. Please try again.');
                console.error(err);
            }
        } catch (err) {
            console.error('Error in outer try:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-wrapper">
            <NavBar onLogout={onLogout} />
            <div className="dashboard-container container">
                <div className="header">
                    <h2>Text to Speech Converter</h2>
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="input-group">
                    <label htmlFor="textInput">Enter Text:</label>
                    <textarea
                        id="textInput"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Enter text here..."
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="urlInput">Or Enter URL:</label>
                    <input
                        type="text"
                        id="urlInput"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com"
                    />
                </div>

                {/* Language Selection Dropdown */}
                <div className="input-group">
                    <label>Select Language: </label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                    </select>
                </div>

                <button onClick={handleTextToSpeech} disabled={loading}>
                    {loading ? 'Converting...' : 'Convert to Speech'}
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
