from flask import Flask
from .routes import main 

def create_app():
    app = Flask(__name__)

    #from app.routes import main 
    app.register_blueprint(main)

    return app