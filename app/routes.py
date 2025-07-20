from flask import render_template, Blueprint

main = Blueprint('main',__name__)


@main.route('/')
def home_page():
    return render_template('home.html')

@main.route('/generator')
def generator_page():
    return render_template('generator.html')

@main.route('/profile')
def profile_page():
    return render_template('profile.html')
