# Translingua: Breaking Language Barriers with AI

Translingua is a powerful language translation application that leverages AI to facilitate seamless communication across different languages. With support for 20 languages, speech-to-text functionality, and text-to-speech capabilities, Translingua provides an intuitive and interactive platform for users to translate text in real-time.

## Features

- **Real-time translation** between 20 different languages including English, Spanish, French, German, Japanese, Chinese, and more
- **Secure authentication** with email/password and Google sign-in options
- **Speech-to-text** functionality for hands-free translation
- **Text-to-speech** capability to hear correct pronunciations
- **Interactive chat interface** that tracks conversation history
- **Language facts** displayed during translation processing
- **Responsive design** with smooth animations and transitions
- **Language switching** with a single click

## Demo Video

[![Translingua in Action](https://img.youtube.com/vi/d8oOQxDo4_M/0.jpg)](https://youtu.be/d8oOQxDo4_M)

## Technology Stack

### Frontend
- React.js
- Firebase Authentication
- SpeechRecognition API
- Web Speech API
- CSS-in-JS styling

### Backend
- FastAPI
- PyTorch
- Firebase Admin SDK

## Prerequisites

Before setting up the project, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- Python (v3.8 or higher)
- pip

## Setup Instructions

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/translingua.git
   cd translingua/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install fastapi uvicorn torch firebase-admin
   ```

4. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Generate a service account key and save it as `serviceAccountKey.json` in the backend directory

5. Prepare your custom PyTorch model:
   - Place your trained PyTorch model file in the backend directory as `model.pth`
   - Ensure your model is compatible with the input/output format expected by the application

6. If you're using a custom tokenizer, make sure it's available in the backend directory

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Firebase configuration:
   - Create a file named `src/firebase.js` with your Firebase configuration:
   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   ```

## Running the Application

### Running the Backend

1. From the backend directory with your virtual environment activated:
   ```bash
   uvicorn main:app --reload
   ```
   The backend server will start at http://localhost:8000

2. You can access the API documentation at http://localhost:8000/docs

### Running the Frontend

1. From the frontend directory:
   ```bash
   npm start
   # or
   yarn start
   ```
   The frontend development server will start at http://localhost:3000

## Working with Custom PyTorch Model

The application is configured to work with a custom PyTorch model saved as `model.pth`. Here's how the model is loaded in the backend:

```python
MODEL_PATH = "model.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

try:
    # Load the model architecture (this should match your model's architecture)
    model = YourModelClass()  # Replace with your model's class
    
    # Load the saved weights
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    
    # Initialize your tokenizer if needed
    tokenizer = YourTokenizer()  # Replace with your tokenizer
except Exception as e:
    raise RuntimeError(f"Failed to load model or tokenizer: {e}")
```

You'll need to modify the `main.py` file to match your specific model architecture and tokenizer. The current implementation assumes a sequence-to-sequence translation model.

## API Endpoints

- `POST /translate`: Translates text between specified languages
  ```json
  {
    "source_language": "English",
    "target_language": "Spanish",
    "source_sentence": "Hello, how are you?"
  }
  ```

- `GET /languages`: Returns a list of supported languages

## Project Structure

```
translingua/
├── backend/
│   ├── main.py                  # FastAPI application
│   ├── model.pth                # Your custom PyTorch model
│   └── serviceAccountKey.json   # Firebase service account key
│
└── frontend/
    ├── public/
    │   └── languages.png        # App logo
    ├── src/
    │   ├── components/
    │   │   ├── Login.js         # Login component
    │   │   └── Signup.js        # Signup component
    │   ├── Translate.js         # Main translation interface
    │   ├── firebase.js          # Firebase configuration
    │   └── ...
    └── ...
```

## Authentication Flow

1. Users can sign up with email/password or sign in with Google
2. Upon successful authentication, users are redirected to the translation interface
3. All API requests include the Firebase ID token for authentication
4. The backend verifies the token before processing requests

## Translation Process

1. User selects source and target languages
2. User enters text or uses speech-to-text functionality
3. The input is sent to the backend API
4. The backend processes the translation using the custom PyTorch model
5. The translated text is returned and displayed in the chat interface
6. Users can play the translated text using text-to-speech

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [PyTorch](https://pytorch.org/) for the machine learning framework
- [Firebase](https://firebase.google.com/) for authentication services
- [FastAPI](https://fastapi.tiangolo.com/) for the high-performance backend framework
- [React](https://reactjs.org/) for the frontend library