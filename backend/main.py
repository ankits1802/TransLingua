from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import firebase_admin
from firebase_admin import credentials, auth
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Initialize FastAPI app
app = FastAPI(title="Translingua API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Firebase init
try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

# Security
security = HTTPBearer()

# Models
class TranslationRequest(BaseModel):
    source_language: str
    target_language: str
    source_sentence: str

class TranslationResponse(BaseModel):
    translated_text: str

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Load model and tokenizer
MODEL_PATH = "model.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

try:
    # Assuming the model is a pretrained model saved via `model.save_pretrained()`
    model = AutoModelForSeq2SeqLM.from_pretrained("./", local_files_only=True)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    
    tokenizer = AutoTokenizer.from_pretrained("./", local_files_only=True)
except Exception as e:
    raise RuntimeError(f"Failed to load model or tokenizer: {e}")

@app.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    try:
        prompt = f"translate {request.source_language} to {request.target_language}: {request.source_sentence}"

        inputs = tokenizer(prompt, return_tensors="pt").to(DEVICE)
        with torch.no_grad():
            output = model.generate(**inputs, max_length=256)
        translated_text = tokenizer.decode(output[0], skip_special_tokens=True)

        return {"translated_text": translated_text}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

@app.get("/languages")
async def get_languages():
    return {
        "languages": [
            "English", "Spanish", "French", "German", "Italian", "Portuguese", 
            "Russian", "Japanese", "Korean", "Chinese", "Arabic", "Hindi", 
            "Dutch", "Swedish", "Greek", "Turkish", "Polish", "Vietnamese", 
            "Thai", "Indonesian"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
