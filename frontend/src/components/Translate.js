import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Language facts database
const languageFacts = {
  'English': [
    'English has borrowed words from over 350 languages.',
    'The most common letter in English is "e".',
    '"I am" is the shortest complete sentence in English.',
    'Every syllable in English must have a vowel sound.',
    'More English words begin with "s" than any other letter.'
  ],
  'Spanish': [
    'Spanish is the official language of 20 countries.',
    '75% of Spanish vocabulary is from Latin.',
    'Spanish is the world\'s second-most spoken native language.',
    'Spanish nouns have two genders.',
    'Spanish is a "verb-framed" language.'
  ],
  'French': [
    'French has changed more from Latin than other Romance languages.',
    'French has verb forms for three moods.',
    'French is known for its precise grammar.',
    'French is spoken on five continents.',
    'French was the language of diplomacy for centuries.'
  ],
  'German': [
    'German has three genders: masculine, feminine, neuter.',
    'German is the native language of 90+ million people.',
    'German is an inflected language with four cases.',
    'Written German is uniform across Germany, Austria, Switzerland.',
    'German shares roots with English and Dutch.'
  ],
  'Italian': [
    'Italian is known for its melodic rhythm.',
    'The Italian alphabet has 21 letters.',
    'Italian is the official language of music.',
    'Italian became official in 1861.',
    'Italian is spoken by 85 million people worldwide.'
  ],
  'Portuguese': [
    'Portuguese is the most spoken language in the Southern Hemisphere.',
    'Portuguese is official in 7 countries.',
    'Portuguese evolved from Vulgar Latin.',
    'It has about 250 million native speakers.',
    'Brazil is the largest Portuguese-speaking country.'
  ],
  'Russian': [
    'Russian is the most widely spoken Slavic language.',
    'Russian uses the Cyrillic alphabet.',
    'Russian has three gender classes for nouns.',
    'Russian is spoken by 258 million people worldwide.',
    'Modern Russian is based on the Moscow dialect.'
  ],
  'Japanese': [
    'Japanese can be written vertically or horizontally.',
    'Japanese has no plurals; context matters.',
    'Months in Japanese are numbered, not named.',
    'Japanese is spoken by 125 million people.',
    'Japanese uses three scripts: Kanji, Hiragana, Katakana.'
  ],
  'Korean': [
    'Hangul, the Korean alphabet, was invented in the 15th century.',
    'Korean is a language isolate.',
    'Korean has no grammatical gender.',
    'Korean is spoken by 77 million people.',
    'Hangul has 14 consonants and 10 vowels.'
  ],
  'Chinese': [
    'Mandarin has the most native speakers worldwide.',
    'Chinese uses thousands of characters.',
    'Mandarin is a tonal language.',
    'Chinese characters represent syllables.',
    'Chinese is one of the UN official languages.'
  ],
  'Arabic': [
    'Arabic is spoken by 380 million people.',
    'Arabic is written right to left.',
    'Arabic has influenced many European languages.',
    'Arabic is the liturgical language of Islam.',
    'Arabic has 28 letters.'
  ],
  'Hindi': [
    'Hindi is written in Devanagari script.',
    'Hindi is the fourth most spoken language in the world.',
    'Hindi originated from Sanskrit.',
    'Hindi is spoken by 600 million people.',
    'Hindi is one of India\'s official languages.'
  ],
  'Dutch': [
    'Dutch is spoken by 24 million people.',
    'Dutch shares words with English and German.',
    'The first written Dutch dates to the 12th century.',
    'Dutch is often confused with German ("Deutsch").',
    'Dutch has many loanwords from French and English.'
  ],
  'Swedish': [
    'Swedish is spoken by 10 million people.',
    'Swedish has a singsong rhythm.',
    'Swedish nouns have two genders.',
    'Swedish is a North Germanic language.',
    'Swedish has many loanwords from German and French.'
  ],
  'Greek': [
    'Greek has the longest documented history of any Indo-European language.',
    'Greek alphabet was the first to include vowels.',
    'Greek is one of the official EU languages.',
    'Greek has contributed many words to English.',
    'Modern Greek derives from Ancient Greek.'
  ],
  'Turkish': [
    'Turkish uses the Latin alphabet.',
    'Turkish is an agglutinative language.',
    'Turkish has vowel harmony.',
    'Turkish has no grammatical gender.',
    'Turkish word order is subject-object-verb.'
  ],
  'Polish': [
    'Polish uses the Latin alphabet with diacritics.',
    'Polish is the second most spoken Slavic language.',
    'Polish has seven grammatical cases.',
    'Polish has three genders.',
    'Polish has influenced vocabulary in Eastern Europe.'
  ],
  'Vietnamese': [
    'Vietnamese is a tonal language.',
    'Vietnamese uses the Latin alphabet with diacritics.',
    'Vietnamese has no grammatical gender.',
    'Vietnamese is spoken by 86 million people.',
    'Vietnamese has many loanwords from Chinese and French.'
  ],
  'Thai': [
    'Thai is a tonal language with five tones.',
    'Thai script is derived from Khmer.',
    'Thai has no verb conjugations.',
    'Thai is spoken by 69 million people.',
    'Thai has a complex system of pronouns.'
  ],
  'Indonesian': [
    'Indonesian is a standardized dialect of Malay.',
    'Indonesian uses the Latin alphabet.',
    'Indonesian has no grammatical gender.',
    'Indonesian is spoken by 43 million people as a first language.',
    'Indonesian is considered easy for English speakers to learn.'
  ]
};

// Loading overlay component - separate from chat
const LoadingOverlay = ({ isLoading, targetLanguage, currentFact }) => {
  if (!isLoading) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      pointerEvents: 'none'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        animation: 'fadeIn 0.3s'
      }}>
        <div style={{
          width: 60,
          height: 60,
          marginBottom: 20,
          position: 'relative'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #4285f4',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
        
        <div style={{
          maxWidth: '400px',
          textAlign: 'center',
          animation: 'fadeIn 0.5s',
          padding: '15px 20px',
          background: 'white',
          borderRadius: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            fontSize: 14,
            color: '#4285f4',
            fontWeight: 600,
            marginBottom: 8
          }}>
            {targetLanguage} Fact
          </div>
          <p style={{
            margin: 0,
            fontSize: 15,
            color: '#333',
            lineHeight: 1.5
          }}>
            {currentFact}
          </p>
        </div>
      </div>
    </div>
  );
};

const logoUrl = process.env.PUBLIC_URL + '/languages.png';

export default function Translate() {
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [sourceSentence, setSourceSentence] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [currentFact, setCurrentFact] = useState('');
  const factIntervalRef = useRef(null);
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch languages on mount
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      if (!user) navigate('/login');
    });
    fetchLanguages();
    return () => unsub();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (transcript) setSourceSentence(transcript);
  }, [transcript]);

  // Rotating facts during loading
  useEffect(() => {
    if (loading && targetLanguage) {
      const facts = languageFacts[targetLanguage] || [];
      setCurrentFact(facts[0] || '');
      setFactIndex(0);
      if (factIntervalRef.current) clearInterval(factIntervalRef.current);
      factIntervalRef.current = setInterval(() => {
        setFactIndex(prev => {
          const idx = facts.length ? (prev + 1) % facts.length : 0;
          setCurrentFact(facts[idx] || '');
          return idx;
        });
      }, 8000);
    } else if (factIntervalRef.current) {
      clearInterval(factIntervalRef.current);
    }
    return () => { if (factIntervalRef.current) clearInterval(factIntervalRef.current); };
    // eslint-disable-next-line
  }, [loading, targetLanguage]);

  async function fetchLanguages() {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('http://localhost:8000/languages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch languages');
      const data = await response.json();
      setLanguages(data.languages);
    } catch (error) {
      setError('Failed to load languages: ' + error.message);
    }
  }

  async function handleTranslate() {
    if (!sourceSentence.trim()) {
      setError('Please enter text to translate');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('http://localhost:8000/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          source_language: sourceLanguage,
          target_language: targetLanguage,
          source_sentence: sourceSentence
        })
      });
      if (!response.ok) throw new Error('Translation failed');
      const data = await response.json();
      setTranslatedText(data.translated_text);
      setMessages([
        ...messages,
        { type: 'user', text: sourceSentence, language: sourceLanguage },
        { type: 'bot', text: data.translated_text, language: targetLanguage }
      ]);
      setSourceSentence('');
      resetTranscript();
    } catch (error) {
      setError('Translation error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  function startListening() {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
    setListening(true);
  }

  function stopListening() {
    SpeechRecognition.stopListening();
    setListening(false);
  }

  function speakText(text) {
    if (!text) return;
    const utterance = new window.SpeechSynthesisUtterance(text);
    const langMap = {
      'English': 'en-US', 'Spanish': 'es-ES', 'French': 'fr-FR', 'German': 'de-DE',
      'Italian': 'it-IT', 'Portuguese': 'pt-PT', 'Russian': 'ru-RU', 'Japanese': 'ja-JP',
      'Korean': 'ko-KR', 'Chinese': 'zh-CN', 'Arabic': 'ar-SA', 'Hindi': 'hi-IN',
      'Dutch': 'nl-NL', 'Swedish': 'sv-SE', 'Greek': 'el-GR', 'Turkish': 'tr-TR',
      'Polish': 'pl-PL', 'Vietnamese': 'vi-VN', 'Thai': 'th-TH', 'Indonesian': 'id-ID'
    };
    utterance.lang = langMap[targetLanguage] || 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  async function handleLogout() {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      setError('Logout failed: ' + error.message);
    }
  }

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser doesn't support speech recognition.</p>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg,#f8fafc 0%,#e3eafc 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* NAVBAR */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={logoUrl} alt="Languages" style={{ height: 38, width: 38, borderRadius: '50%' }} />
          <span style={{
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: '1.5px',
            color: '#2a2a2a',
            fontFamily: 'Segoe UI, sans-serif'
          }}>
            Translingua
          </span>
        </div>
        <button
  onClick={handleLogout}
  style={{
    background: '#f1f3f4',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 500,
    fontSize: 16,
    padding: '8px 20px',
    marginLeft: 'auto',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }}
  onMouseOver={e => e.currentTarget.style.background = '#e0e7ef'}
  onMouseOut={e => e.currentTarget.style.background = '#f1f3f4'}
>
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
  Logout
</button>

      </nav>

      {/* MAIN CONTENT */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 900,
        margin: '0 auto',
        width: '100%',
        padding: '28px 12px 0 12px'
      }}>
        {/* Language selection */}
        <div style={{
          display: 'flex',
          gap: 16,
          marginBottom: 18,
          alignItems: 'center'
        }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 500, fontSize: 14, color: '#555', marginBottom: 6, display: 'block' }}>
              Source Language
            </label>
            <select
            value={sourceLanguage}
            onChange={e => setSourceLanguage(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              paddingRight: '30px', // Increased right padding for the icon
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 16,
              background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              appearance: 'none', // Removes default browser arrow
              WebkitAppearance: 'none', // For Safari
              MozAppearance: 'none', // For Firefox
              backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23555\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '16px'
            }}
            disabled={loading}
          >
            {languages.map(lang => (
              <option key={`source-${lang}`} value={lang}>{lang}</option>
            ))}
          </select>

          </div>
          <button
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: '#ffffff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)', margin: '0 8px'
            }}
            onClick={() => {
              setSourceLanguage(targetLanguage);
              setTargetLanguage(sourceLanguage);
            }}
            disabled={loading}
          >
            <svg width="22" height="22" stroke="#4285f4" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 1l4 4-4 4"></path>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
              <path d="M7 23l-4-4 4-4"></path>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            </svg>
          </button>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 500, fontSize: 14, color: '#555', marginBottom: 6, display: 'block' }}>
              Target Language
            </label>
            <select
              value={targetLanguage}
              onChange={e => setTargetLanguage(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                paddingRight: '30px', // Increased right padding for the icon
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: 16,
                background: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                appearance: 'none', // Removes default browser arrow
                WebkitAppearance: 'none', // For Safari
                MozAppearance: 'none', // For Firefox
                backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'%23555\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '16px'
              }}
              disabled={loading}
            >
              {languages.map(lang => (
                <option key={`target-${lang}`} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CHAT CONTAINER - with backdrop blur effect when loading */}
        <div style={{ position: 'relative' }}>
          <div
            ref={chatContainerRef}
            style={{
              position: 'relative',
              background: 'white',
              borderRadius: 14,
              boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
              padding: '20px',
              marginBottom: 18,
              minHeight: 320,
              height: 400,
              maxHeight: 400,
              overflowY: loading ? 'hidden' : 'auto',
              overscrollBehavior: 'contain',
              transition: 'all 0.3s'
            }}
          >
            {messages.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#888',
                textAlign: 'center',
                padding: '20px'
              }}>
                <div style={{
                  width: 70, height: 70, borderRadius: '50%',
                  background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 15
                }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </div>
                <p style={{ fontSize: 16, marginBottom: 10 }}>Start translating by typing a message below</p>
                <p style={{ fontSize: 14, color: '#aaa' }}>Your translations will appear here</p>
              </div>
            ) : (
              <>
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: 15,
                      animation: message.type === 'user' ? 'slideInRight 0.3s' : 'slideInLeft 0.3s'
                    }}
                  >
                    {message.type === 'bot' && (
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: '#f0f4ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      </div>
                    )}
                    <div style={{
                      background: message.type === 'user' ? '#e3f2fd' : '#f8f9fa',
                      padding: '12px 16px',
                      borderRadius: message.type === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                      maxWidth: '70%',
                      position: 'relative',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{
                        fontSize: 12, color: '#888', marginBottom: 5, fontWeight: 500
                      }}>
                        {message.language}
                      </div>
                      <div style={{ fontSize: 15, lineHeight: 1.5 }}>{message.text}</div>
                      {message.type === 'bot' && (
                        <button
                          onClick={() => speakText(message.text)}
                          style={{
                            background: 'transparent', border: 'none', color: '#4285f4',
                            cursor: 'pointer', padding: '5px 0 0 0', marginTop: 5, fontSize: 14,
                            display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s'
                          }}
                          onMouseOver={e => e.currentTarget.style.color = '#3367d6'}
                          onMouseOut={e => e.currentTarget.style.color = '#4285f4'}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                          Speak
                        </button>
                      )}
                    </div>
                    {message.type === 'user' && (
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: '#e3f2fd',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 10
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Chat overlay - only blurs the chat content when loading */}
          {loading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: 14,
              zIndex: 5
            }}></div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            color: 'white',
            background: '#f44336',
            padding: '10px 15px',
            borderRadius: 8,
            marginBottom: 15,
            textAlign: 'center',
            animation: 'shakeError 0.5s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}

        {/* Input Area */}
        <div style={{
          display: 'flex',
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          padding: '15px',
          marginBottom: 12,
          alignItems: 'flex-end'
        }}>
          <textarea
            value={sourceSentence}
            onChange={e => setSourceSentence(e.target.value)}
            placeholder="Type your text here..."
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              fontSize: 16,
              minHeight: 24,
              maxHeight: 120,
              resize: 'none',
              outline: 'none',
              background: 'transparent',
              scrollbarGutter: 'stable'
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTranslate();
              }
            }}
            disabled={loading}
          />
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 10,
            paddingLeft: 10
          }}>
            <button
              onClick={listening ? stopListening : startListening}
              disabled={loading}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: listening ? '#f44336' : '#f1f3f4',
                color: listening ? 'white' : '#5f6368',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {listening ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              )}
            </button>
            <button
              onClick={handleTranslate}
              disabled={loading || !sourceSentence.trim()}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: loading || !sourceSentence.trim() ? '#f1f3f4' : '#4285f4',
                color: loading || !sourceSentence.trim() ? '#9aa0a6' : 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: loading || !sourceSentence.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {loading ? (
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading overlay with facts - completely separate from chat container */}
      <LoadingOverlay 
        isLoading={loading} 
        targetLanguage={targetLanguage} 
        currentFact={currentFact} 
      />

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shakeError {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
