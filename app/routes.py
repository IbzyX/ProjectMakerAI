from flask import render_template, Blueprint, request, jsonify, redirect, flash, session, url_for
from helpers import load_users, save_users, login_required 
import openai 

main = Blueprint('main',__name__)


@main.route('/')
def home_page():
    return render_template('home.html')





@main.route('/generator')
@login_required
def generator_page():
    return render_template('generator.html')

# --- AI GENERATION ---
@main.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json(force=True)
        print("Received:", data)

        # Extract user input
        title = data.get("title", "")
        description = data.get("description", "")
        features = data.get("features", "")
        team = data.get("team", "")
        timespan = data.get("timespan", "")

        # Construct the prompt
        prompt = f"""
        You are an AI project assistant. Based on the following input, generate:

        1. Project Scope
        2. Required Tasks
        3. Market Research summary
        4. Requirements
        5. Gantt Chart timeline
        6. Input flags for unrealistic or missing details

        Input:
        Title: {title}
        Description: {description}
        Key Features: {features}
        Team Size: {team}
        Time Span: {timespan}
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.7
        )

        output_text = response.choices[0].message["content"]

        # Optional: split response into sections
        def extract_section(name):
            start = output_text.lower().find(name.lower())
            if start == -1:
                return ""
            end = output_text.find("\n\n", start)
            return output_text[start:end].strip() if end != -1 else output_text[start:].strip()

        return jsonify({
            "output": {
                "scope": extract_section("Project Scope"),
                "tasks": extract_section("Required Tasks"),
                "research": extract_section("Market Research"),
                "requirements": extract_section("Requirements"),
                "gantt": extract_section("Gantt Chart"),
                "flags": extract_section("Input flags"),
            }
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500





@main.route('/profile')
def profile_page():
    return render_template('profile.html')

# --- Profile : SIGNUP ---
@main.route('/signup', methods=['POST'])
def signup():
    email = request.form.get('email')
    password = request.form.get('password')
    username = request.form.get('username')

    users = load_users()

    if email in users:
        flash("User already exists.")
        return redirect(url_for('main.profile_page') + '#login')

    users[email] = {
         'username': username,
         'password': password
        }
    save_users(users)

    flash("Signup successful! You can now log in.")
    return redirect(url_for('main.profile_page'))



# --- Profile : LOGIN ---
@main.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    users = load_users()
    if email in users and users[email]['password'] == password:
        session['user'] = email
        flash("Logged in successfully.")
        return redirect(url_for('main.generator_page'))

    flash("Invalid email or password.")
    return redirect(url_for('main.profile_page'))

# --- Logout ---
@main.route('/logout')
def logout():
    session.pop('user', None)
    flash("You have been logged out.")
    return redirect(url_for('main.home_page'))