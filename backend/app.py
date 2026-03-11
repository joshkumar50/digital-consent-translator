from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
# Explicitly allow all origins and headers for the extension
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# We will stick with this powerful Google model
import requests
import json

app = Flask(__name__)
CORS(app)

# Ollama local API configuration
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2" # Using the locally available llama3.2 model

@app.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.json
    text_to_summarize = data.get('text', '')

    if not text_to_summarize:
        return jsonify({"error": "No text was provided."}), 400

    print(f"DEBUG: Summarizing text using Ollama model: {MODEL_NAME}")

    def generate():
        try:
            # Prompt for summarization
            prompt = f"Please summarize the following digital consent text concisely and clearly, highlighting the most important points for a user:\n\n{text_to_summarize}"
            
            payload = {
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": True # Enable streaming
            }
            
            response = requests.post(OLLAMA_URL, json=payload, stream=True, timeout=60)
            response.raise_for_status()

            for line in response.iter_lines():
                if line:
                    chunk = json.loads(line)
                    if 'response' in chunk:
                        yield chunk['response']
                    if chunk.get('done'):
                        break

        except requests.exceptions.RequestException as e:
            print(f"An error occurred with the Ollama API call: {e}")
            yield f"Error: Could not connect to Ollama. Please ensure it is running locally."
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            yield f"An unexpected server error occurred."

    return app.response_class(generate(), mimetype='text/plain')

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)