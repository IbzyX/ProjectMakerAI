# AI Project Maker

[Live demo](https://projectmakerai.onrender.com/)

**Note:** The app may take a few seconds to load after being idle due to hosting platform cold starts. Thanks for your patience!

**Test Account:**

email: `test@test`

Password: `test`

Feel free to use this to explore the app without signing up.

---

## Overview

AI Project Maker is a web application designed to accelerate the project initialization phase by leveraging AI to automatically generate project scaffolding and documentation based on user input. The app aims to reduce the time developers spend on boilerplate setup, enabling faster prototyping and iteration.

This project showcases skills in full-stack development, AI integration, backend API design, and database management using a modern and scalable Python Flask stack.

---

## Key Features

- **AI-powered project generation:** Users submit project ideas or requirements, and the system uses the AI model GPT-3.5 Turbo to generate project structures.
- **Real-time output display:** AI-generated content is displayed immediately on the page for easy review.
- **Downloadable project files:** Users can download generated results as a PDF for easy access and browser viewing.
- **User authentication:** Secure signup and login functionality to save user-specific project histories.
- **Project history management:** *This feature is currently under development and will allow authenticated users to view, revisit, and download past generated projects.*
- **Database integration:** PostgreSQL with SQLAlchemy ORM manages users and project data persistently.
- **Required input**
  - project title
  - concept idea for the project 
- **AI output includes key features such as:**
  - Project scope and insight 
  - Requirements
  - Market research
  - Flagged inputs for unrealistic or vague prompts
  - Timeline *(timeline generation is also a work in progress)*

---

## Technology Stack

- **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-Login
- **AI Integration:** OpenAI API (GPT-3.5-Turbo)
- **Frontend:** HTML5, CSS3, JavaScript (Fetch API for asynchronous calls)
- **Database:** PostgreSQL
- **Development Tools:** Python-dotenv for environment variables, Flask-Migrate for database migrations
- **Version Control:** Git

---

## Architecture and Design

- **Modular Flask app:** Organized with Blueprints for clean route and logic separation.
- **RESTful API endpoints:** Backend exposes JSON APIs to handle AI generation and file downloads.
- **Asynchronous frontend interaction:** Fetch API enables smooth user experience with no page reloads.
- **Security:** User passwords are hashed and sessions managed securely.
- **Temporary file management:** Generated AI outputs are saved temporarily on the server for downloading.

---

## Getting Started

### Prerequisites

- Python 3.7+
- PostgreSQL database
- OpenAI API

### Installation

1. Clone the repository:
    
    ```bash
    git clone <https://github.com/yourusername/yourrepo.git>
    ```

---

## Coming Soon

The following features are currently in development and will be available in future releases:

- Complete **Project History Management** allowing users to easily access and manage their past AI-generated projects.
- Continue **Prompt** to further detail response.
- Enhanced **Gantt Timeline Generation** for detailed project scheduling and milestone tracking.
- Improved **Flagging System** for better detection and feedback on unrealistic or vague project inputs.
- new **AI feature** for helping with the concept idea 

Stay tuned for updates!
