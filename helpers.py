import json
import os 

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
USERS_FILE = os.path.join(BASE_DIR, 'users.json')

def load_users():
    if not os.path.exists(USERS_FILE):
        return{}
    with open(USERS_FILE, 'r') as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)