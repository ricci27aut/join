# Join

Join is a browser-based task management application inspired by the Kanban system. It helps teams organize tasks, track their progress, manage contacts, assign priorities, and work with subtasks. Stakeholders can also submit new requests, while team members can sign up and log in.

## Features

- Kanban board with task status columns
- Create, edit, and delete tasks
- Assign contacts, categories, priorities, due dates, and subtasks
- Contact management
- User registration and login
- Dashboard with a task overview
- Stakeholder request form
- Responsive user interface

## Technologies and Techniques

- **HTML5** for the page structure
- **CSS3** for styling, responsive layouts, and animations
- **Vanilla JavaScript (ES6+)** for application logic and DOM manipulation
- **Fetch API** with `async`/`await` for backend communication
- **Firebase Realtime Database** as the data backend
- **REST API operations** for reading, creating, updating, and deleting data
- **Git and GitHub** for version control
- Reusable JavaScript templates for UI components
- Kanban-style task organization and drag-and-drop interactions

No framework, package manager, or build step is required.

## Getting Started

### Prerequisites

Install the following software:

- [Git](https://git-scm.com/)
- A modern web browser
- A local web server, such as the **Live Server** extension for Visual Studio Code or Python's built-in HTTP server

### Clone the Repository

```bash
git clone https://github.com/ricci27aut/join.git
cd join
```

### Run the Project

Opening `index.html` directly may work for some features, but using a local web server is recommended.

#### Option 1: Visual Studio Code Live Server

1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and select **Open with Live Server**.

#### Option 2: Python

Run one of the following commands in the project directory:

```bash
python -m http.server 8000
```

On some systems, use:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Backend Configuration

The application currently uses a Firebase Realtime Database URL configured in `js/data.js`. It can therefore be started without installing additional dependencies.

To use your own backend:

1. Create a Firebase project and enable Realtime Database.
2. Configure suitable Firebase security rules.
3. Replace the `BASE_URL` value in `js/data.js` with your database URL.
4. Import or create the required `users`, `contacts`, and `tasks` collections. The included `firebase.datenabnk.js` file can be used as an example of the expected data structure.

> Never store real passwords or sensitive personal data as plain text. The current authentication implementation is intended for learning and demonstration purposes, not for production use.

## Project Structure

```text
join/
|-- assets/     # Images, icons, fonts, and JavaScript templates
|-- html/       # Application pages
|-- js/         # Application logic and Firebase communication
|-- n8n/        # n8n workflow configuration
|-- styles/     # Page and component styles
|-- index.html  # Application entry point
`-- firebase.datenabnk.js  # Example Firebase data structure
```

## License

This project was created for educational purposes. No license has been specified.
