from flask import render_template, Blueprint, request, jsonify, redirect, flash, session, url_for
from flask_login import login_user, logout_user, login_required, current_user
from app import db
from app.models import User
import openai

main = Blueprint('main', __name__)


@main.route('/')
def home_page():
    return render_template('home.html')


@main.route('/settings')
def settings_page():
    return render_template('settings.html')


@main.route('/history')
def history_page():
    return render_template('history.html')


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
        team = data.get("team_size", "")
        timespan = data.get("time_span", "")

        # Construct the prompt for the AI
        prompt = f"""
        You are an expert AI product analyst.

        Given the following project information, generate a comprehensive project plan. Format your response in clear Markdown. Include all of the following sections and ensure each is populated with realistic and useful information:

        ### 1. Project Scope
        - What this app does
        - Who it's for
        - The main problem it solves

        ### 2. Required Tasks
        - Break down tasks by role or area: Frontend, Backend, AI/NLP, DevOps
        - Use bullet points
        - Be specific about technical implementations

        ### 3. Market Research
        - List 3 similar products (name, website, short description)
        - For each, list: What they do well, Gaps/opportunities

        ### 4. Requirements
        - Tech stack
        - Roles needed
        - Tools or APIs

        ### 5. Timeline Estimate
        - Raw JSON array of objects:
        [
            {{
                "id": "Task 1",
                "name": "Design",
                "start": "2025-08-01",
                "end": "2025-08-07",
                "progress": 20
            }}
        ]

        ### 6. Flags
        - Note anything missing or unrealistic from the user's input
        - E.g., unclear team size, too short timeline, vague features

        ---

        User Input:

        **Title**: {title}

        **Description**: {description}

        **Key Features**: {features}

        **Team Size**: {team}

        **Time Span**: {timespan}

        Respond in clear markdown format, with headings and bullet points.
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.7
        )

        output_text = response.choices[0].message["content"]

        # Helper to extract markdown sections by heading name
        def extract_section(name):
            start = output_text.lower().find(name.lower())
            if start == -1:
                return ""
            end = output_text.find("\n\n", start)
            return output_text[start:end].strip() if end != -1 else output_text[start:].strip()

        # Special extractor for the gantt JSON array
        import re, json
        gantt_section = extract_section("Timeline Estimate")
        match = re.search(r'\[\s*{[\s\S]*}\s*\]', gantt_section)
        if match:
            try:
                gantt_data = json.loads(match.group(0))
            except json.JSONDecodeError:
                gantt_data = []
        else:
            gantt_data = []

        print("Gantt section raw: ", gantt_section)
        print("Gantt parsed data:", gantt_data)
        return jsonify({
            "output": {
                "scope": extract_section("Project Scope"),
                "tasks": extract_section("Required Tasks"),
                "research": extract_section("Market Research"),
                "requirements": extract_section("Requirements"),
                "gantt": gantt_data,  # Now an actual array, not markdown
                "flags": extract_section("Flags"),
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

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        flash("User already exists.", "error")
        return redirect(url_for('main.profile_page') + '#login')

    new_user = User(email=email, username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    flash("Signup successful! You can now log in.", "success")
    return redirect(url_for('main.profile_page') + '#login')


# --- Profile : LOGIN ---
@main.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        login_user(user)
        flash("Logged in successfully.", "success")
        return redirect(url_for('main.generator_page'))

    flash("Invalid email or password.", "error")
    return redirect(url_for('main.profile_page') + '#login')


# --- Logout ---
@main.route('/logout')
def logout():
    logout_user()
    flash("You have been logged out.", "logout")
    return redirect(url_for('main.home_page'))
