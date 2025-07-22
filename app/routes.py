from flask import render_template, Blueprint, request, jsonify

main = Blueprint('main',__name__)


@main.route('/')
def home_page():
    return render_template('home.html')

@main.route('/generator')
def generator_page():
    return render_template('generator.html')

@main.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    idea = data.get('idea', '')
    result = f"Generated for: {idea}"
    file_id = "test-id"
    return jsonify({'output': result, 'file_id': file_id})

@main.route('/profile')
def profile_page():
    return render_template('profile.html')
