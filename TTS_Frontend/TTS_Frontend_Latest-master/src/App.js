import React, { useEffect, useState } from 'react';
import Axios from './axios.js';
import { withAuthInfo, useRedirectFunctions, useLogoutFunction } from '@propelauth/react';
import './App.css';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import loginBg from './assets/Login-Bg.jpg'


const App = withAuthInfo((props) => {
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');
    const [audioUrl, setAudioUrl] = useState(null); // to store audio blob url
    const logoutFunction = useLogoutFunction();
    const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } = useRedirectFunctions();

    const [languages, setLanguages] = useState([]); // For storing language options
    const [voices, setVoices] = useState([]); // For storing voice options based on the selected language
    const [selectedLanguage, setSelectedLanguage] = useState(''); // For storing selected language
    const [selectedVoice, setSelectedVoice] = useState(''); // For storing selected voice
    const [uploadPdfFile, setUploadPdfFile] = useState(null); // For storing the uploaded file
    const [inputType, setInputType] = useState('text'); // Default input type is text
    const [playbackSpeed, setPlaybackSpeed] = useState(0.75); // Initialize state
    const [speechText, setSpeechText] = useState('');
    const [pitch, setPitch] = useState('');
    const [voiceName, setVoiceName] = useState('');


    const sampleResponse = {
        "status": true,
        "data": [
            {
                "Language": "af-ZA",
                "Voices": "af-ZA-Standard-A"
            },
            {
                "Language": "am-ET",
                "Voices": "am-ET-Standard-A, am-ET-Standard-B, am-ET-Wavenet-A, am-ET-Wavenet-B"
            },
            {
                "Language": "ar-XA",
                "Voices": "ar-XA-Standard-A, ar-XA-Standard-B, ar-XA-Standard-C, ar-XA-Standard-D, ar-XA-Wavenet-A, ar-XA-Wavenet-B, ar-XA-Wavenet-C, ar-XA-Wavenet-D"
            }
        ]
    };


    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                // Simulate API call (replace with actual API call when fixed)
                const response = await Axios.get('/api/text_to_speech/list_languages_voices');

                // const response = sampleResponse; // Use the sample response for now
                if (response.status) {
                    
                    setLanguages(response.data.data); // Set languages from sample data
                }
            } catch (error) {
                console.error("Error fetching languages and voices:", error);
            }
        };

        fetchLanguages();
    }, []);

    
    useEffect(() => {
        console.log(languages)
    }, [languages]);
    const handleLanguageChange = (e) => {
        const selectedLang = e.target.value;
        setSelectedLanguage(selectedLang); // Store the selected language

        // Find the voices for the selected language and split the string by comma
        const languageData = languages.find(lang => lang.Language === selectedLang);
        if (languageData && languageData.Voices) {
            setVoices(languageData.Voices.split(', ')); // Split the voices by comma
        } else {
            setVoices([]); // Clear voices if no language is selected
        }
    };

    const handleConvert = async () => {
        console.log("Convert button clicked");

        try {
            console.log("inside");

            let formData = new FormData();
            let inputData;

            switch (inputType) {
                case 'pdf':
                    if (uploadPdfFile) {
                        formData.append('file', uploadPdfFile);
                        formData.append('input_type', 'pdf');
                        formData.append('language', selectedLanguage);
                        formData.append('voice', selectedVoice);
                        formData.append('playback_speed', playbackSpeed);
                        formData.append('pitch', pitch);
                        // formData.append('voice_name', voiceName);
                    } else {
                        console.error('No PDF file uploaded');
                        return;
                    }
                    break;
                case 'url':
                    inputData = {
                        input_type: 'url',
                        text: url,
                        language: selectedLanguage,
                        voice: selectedVoice,
                        playback_speed: playbackSpeed,
                        pitch: pitch,
                        // voice_name: voiceName
                    };
                    break;
                case 'text':
                    inputData = {
                        input_type: 'text',
                        text: text,
                        language: selectedLanguage,
                        voice: selectedVoice,
                        playback_speed: playbackSpeed,
                        pitch: pitch,
                        // voice_name: voiceName
                    };
                    break;
                default:
                    console.error('Invalid input type');
                    return;
            }

            const payload = inputType === 'pdf' ? formData : inputData;

            const response = await Axios.post('api/text_to_speech/convert_text_to_speech', payload, {
                headers: {
                    "Content-Type": inputType === 'pdf' ? "multipart/form-data" : "application/json",
                }
            });

            console.log(response);
            console.log(response.data);

            const audioUrl = `${process.env.REACT_APP_BACKEND_URL}${response.data.url}`;
            setAudioUrl(audioUrl);

        } catch (error) {
            console.error('Error converting input to speech:', error);
        }
    };




    // const handleConvert = async () => {
    //     console.log("Convert button clicked");

    //     try {
    //         console.log("inside");

    //         let formData = new FormData();
    //         let inputData;

    //         switch (inputType) {
    //             case 'pdf':
    //                 if (uploadPdfFile) {
    //                     formData.append('file', uploadPdfFile);
    //                     formData.append('input_type', 'pdf');
    //                 } else {
    //                     console.error('No PDF file uploaded');
    //                     return;
    //                 }
    //                 break;
    //             case 'url':
    //                 inputData = {
    //                     input_type: 'url',
    //                     text: url,
    //                     language: selectedLanguage,
    //                     voice: selectedVoice
    //                 };
    //                 break;
    //             case 'text':
    //                 inputData = {
    //                     input_type: 'text',
    //                     text: text,
    //                     language: selectedLanguage,
    //                     voice: selectedVoice
    //                 };
    //                 break;
    //             default:
    //                 console.error('Invalid input type');
    //                 return;
    //         }

    //         const payload = inputType === 'pdf' ? formData : inputData;

    //         const response = await Axios.post('api/text_to_speech/convert_text_to_speech', payload, {
    //             headers: {
    //                 "Content-Type": inputType === 'pdf' ? "multipart/form-data" : "application/json",
    //             }
    //         });

    //         console.log(response);
    //         console.log(response.data);

    //         const audioUrl = `${process.env.REACT_APP_BACKEND_URL}${response.url}`;
    //         setAudioUrl(audioUrl);

    //     } catch (error) {
    //         console.error('Error converting input to speech:', error);
    //     }
    // };


    const handleVoiceChange = (e) => {
        setSelectedVoice(e.target.value);
    };

    const handleInputTypeChange = (e) => {
        setInputType(e.target.value);
        setText('');
        setUrl('');
        setUploadPdfFile('')
    };



    return (
        <>
            <nav className="navbar">
                <a href="/" className="navbar-brand">VoiceCraft</a>
                <div className="auth-section">
                    {props.isLoggedIn ? (
                        <div>
                            <p>Hi {props.user.firstName}, Good to see you! </p>
                            <button onClick={() => redirectToAccountPage()}>Account</button>
                            <button onClick={() => logoutFunction(true)}>Logout</button>
                        </div>
                    ) : (
                        <div>
                            <button onClick={() => redirectToLoginPage()}>Login</button>
                            <button onClick={() => redirectToSignupPage()}>Signup</button>
                        </div>
                    )}
                </div>
            </nav>

            <div style={{ width: '100%' }} className='container-wrapper'>

                <div className="container">
                    <h1>Text-to-Speech Converter</h1>

                    <div>
                        <label>Select Input Type: </label>
                        <select value={inputType} onChange={handleInputTypeChange}>
                            <option value="text">Text</option>
                            <option value="url">URL</option>
                            <option value="pdf">PDF</option>
                        </select>
                    </div>

                    {inputType === 'text' && (
                        <div>
                            <span>Enter Text:</span>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter text here..."
                            />
                        </div>
                    )}

                    {inputType === 'url' && (
                        <div>
                            <label>Enter URL:</label>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Enter URL here..."
                            />
                        </div>
                    )}

                    {inputType === 'pdf' && (
                        <div>
                            <label>Enter PDF File:</label>

                            {uploadPdfFile ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span >{uploadPdfFile.name}</span> {/* Display the uploaded file name */}
                                    <IconButton onClick={() => setUploadPdfFile(null)} >
                                        <CloseIcon style={{ color: 'red' }} />
                                    </IconButton>
                                </div>
                            ) : (
                                <input
                                    type="file"
                                    accept=".pdf" // Restrict to PDF files
                                    onChange={(e) => setUploadPdfFile(e.target.files[0])} // Store the actual file in state
                                />
                            )}
                        </div>
                    )}


                    <div>
                        <label>Select Language:</label>
                        <select onChange={handleLanguageChange} value={selectedLanguage}>
                            <option value="">Choose a language</option>
                            {languages.length && languages?.map((lang) => (
                                <option key={lang.Language} value={lang.Language}>
                                    {lang.Language}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Voice Dropdown (only show if a language is selected) */}
                    {selectedLanguage && (
                        <div>
                            <label>Select Voice:</label>
                            <select onChange={handleVoiceChange} value={selectedVoice}>
                                <option value="">Choose a voice</option>
                                {voices.map((voice, index) => (
                                    <option key={index} value={voice}>
                                        {voice}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Playback Speed Dropdown */}
                    <div>
                        <label>Playback Speed:</label>
                        <select
                            value={playbackSpeed}
                            onChange={(e) => setPlaybackSpeed((e.target.value))}
                        >
                            <option value="0.75">0.75</option>
                            <option value="1.00">1.00</option>
                            <option value="1.50">1.50</option>
                            <option value="1.75">1.75</option>
                        </select>
                    </div>

                    {/* Pitch Input Field */}
                    <div>
                        <span>Pitch:</span>
                        <input
                            type="text"
                            value={pitch}
                            onChange={(e) => setPitch(e.target.value)}
                            placeholder="Enter pitch value"
                        />
                    </div>

                    {/* Voice Name Input Field */}
                    {/* <div>
                        <span>Voice Name:</span>
                        <input
                            type="text"
                            value={voiceName}
                            onChange={(e) => setVoiceName(e.target.value)}
                            placeholder="Enter voice name"
                        />
                    </div> */}

                    <button onClick={handleConvert}>Convert to Speech</button>

                    {/* Audio output section */}
                    {audioUrl && (
                        <div>
                            <h2>Speech Output:</h2>
                            <audio controls>
                                <source src={audioUrl} type="audio/mp3" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
});

export default App;
