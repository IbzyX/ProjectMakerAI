from flask import Flask
import openai
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)

    openai.api_key = os.getenv("OPENAI_API_KEY")

    from .routes import main
    #from app.routes import main 
    app.register_blueprint(main)

    return app