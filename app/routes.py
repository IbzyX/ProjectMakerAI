from flask import render_template, Blueprint, request, jsonify
import openai 

main = Blueprint('main',__name__)


@main.route('/')
def home_page():
    return render_template('home.html')

@main.route('/profile')
def profile_page():
    return render_template('profile.html')

@main.route('/generator')
def generator_page():
    return render_template('generator.html')


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


