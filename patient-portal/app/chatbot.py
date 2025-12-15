# chatbot.py

# from fastapi import FastAPI
# from pydantic import BaseModel
# import os
# from dotenv import load_dotenv
# from openai import OpenAI

# # Load environment variables
# load_dotenv()

# # Create client using environment variable
# client = OpenAI(api_key=os.getenv("OPEN_API_KEY"))

# # FastAPI app
# app = FastAPI()

# class Message(BaseModel):
#     message: str

# @app.post("/chat")
# async def chat_endpoint(message: Message):
#     user_message = message.message

#     if not user_message:
#         return {"response": "Please enter a message."}

#     try:
#         # Correct usage with OpenAI v1 client
#         response = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": "You are a helpful medical assistant."},
#                 {"role": "user", "content": user_message}
#             ]
#         )

#         reply = response.choices[0].message.content
#         return {"response": reply}

#     except Exception as e:
#         return {"response": f"Error: {str(e)}"}










# app/chatbot.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from openai import OpenAI
import jwt
from datetime import datetime

load_dotenv()

# Create OpenAI client using API key from .env
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

class Message(BaseModel):
    message: str
    token: str  # Add token field to the message model

@app.post("/chat")
async def chat_endpoint(message: Message):
    user_message = message.message
    token = message.token

    if not user_message:
        return {"response": "Please enter a message."}

    try:
        # Decode the JWT token to get user info
        decoded_token = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        user_tokens = decoded_token.get("tokens", 0)

        if user_tokens <= 0:
            return {"response": "Not enough tokens. Please purchase more tokens to continue using the chatbot."}

        # Deduct one token for the chat
        decoded_token["tokens"] = user_tokens - 1
        new_token = jwt.encode(decoded_token, os.getenv("JWT_SECRET"), algorithm="HS256")

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful medical assistant."},
                {"role": "user", "content": user_message}
            ]
        )
        reply = response.choices[0].message.content
        return {"response": reply, "newToken": new_token}

    except jwt.ExpiredSignatureError:
        return {"response": "Session expired. Please log in again."}
    except jwt.InvalidTokenError:
        return {"response": "Invalid token. Please log in again."}
    except Exception as e:
        return {"response": f"Error: {str(e)}"}