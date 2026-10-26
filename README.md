# PomodorKanaban
A pomodoro timer with a kanban task list.

The app includes configurable work and break timers, along with a drag-and-drop
task board.

## Local deployment

The project is a static HTML, CSS, and JavaScript application. It has no build
step or package dependencies.

1. Clone the repository and enter its directory:

   ```bash
   git clone https://github.com/sagrusea/PomodorKanaban.git
   cd PomodorKanaban
   ```

2. Start a local web server from the repository root. For example, with
   Python:

   ```bash
   python -m http.server 8000
   ```

   On systems where Python is invoked as `python3`, use:

   ```bash
   python3 -m http.server 8000
   ```

3. Open [http://localhost:8000](http://localhost:8000) in a browser.

To stop the local server, return to the terminal running it and press
`Ctrl+C`. The app loads its fonts from Google Fonts, so an internet connection
is needed for those fonts; the timer and task board otherwise run locally.

### Using VS Code

Alternatively, open the repository in VS Code and use a static-server
extension such as **Live Server** to open `index.html`. The extension will
reload the page when files change.
