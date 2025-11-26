import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from google.genai import types

# 1. Load the environment variable (your API key)
# This requires the key to be set either in a .env file or exported in the terminal.
load_dotenv()

# --- SERVER SETUP ---
app = Flask(__name__)
# CORS is essential! It allows your frontend (on its port) to talk to this backend (on port 5000).
CORS(app) 

# Initialize Gemini Client securely using the key from the environment
try:
    # The client automatically looks for the GEMINI_API_KEY environment variable
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
except Exception as e:
    # If the key is not set, the client will fail to initialize
    print("FATAL ERROR: Gemini client could not be initialized. Is GEMINI_API_KEY set?")
    print(f"Error details: {e}")
    client = None

# --- AI CONFIGURATION (The JobZilla Persona) ---
SYSTEM_INSTRUCTION = (
    "You are the JobZilla Career Assistant, an expert in OJT and permanent employment matching for the local market. "
    "Your primary goal is to guide users to relevant job listings, OJT requirements, and career advice. "
    "Maintain a professional, encouraging, and helpful tone. "
    "If the user asks for jobs, always ask for their preferred field and location. Do not invent job listings."
)

@app.route('/api/chat', methods=['POST'])
def chat():
    # Check if the AI client is available
    if not client:
        return jsonify({'text': "Server error: AI client not available."}), 500

    data = request.json
    user_message = data.get('message', '')

    # Create a simple configuration for the model
    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_INSTRUCTION
    )
    
    # Use generate_content for a single-turn request, which is fine for basic chat
    try:
        response = client.generate_content(
            model="gemini-2.5-flash",
            contents=user_message,
            config=config
        )
        
        # Return the AI's response to Deep Chat in the expected JSON format
        return jsonify({'text': response.text})
    except Exception as e:
        print(f"Gemini API Communication Error: {e}")
        return jsonify({'text': "Sorry, I'm experiencing an API error. Please try again."}), 500

if __name__ == '__main__':
    # Run the server on the specified port. (http://127.0.0.1:5000)
    app.run(port=5000, debug=True)