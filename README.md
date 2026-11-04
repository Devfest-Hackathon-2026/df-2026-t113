# DevFest 2026

## Development tools

### Install Node.js and npm

We use Node.js to run frontend development tools and npm to manage frontend
dependencies. Install the LTS version of Node.js from
[nodejs.org](https://nodejs.org/); npm is included. The team should agree on the
same Node.js and npm versions and record them when configuring the project.

Open a new terminal, then verify:

```bash
node --version
npm --version
```

Once the root and frontend manifests are configured as an npm workspace, run
installation commands from the repository root:

- Initial setup or intentional dependency updates: `npm install`. Commit the
  generated root `package-lock.json` together with manifest changes.
- Teammate setup after the lockfile is committed: `npm ci`.

Use npm consistently; do not generate a Bun, Yarn, or pnpm lockfile. See the run instructions below for the configured demo workspace.

### Install uv

We use [uv](https://docs.astral.sh/uv/) to manage Python dependencies and virtual environments.

On macOS with Homebrew:

```bash
brew install uv
```

Alternatively, use the official installer on macOS or Linux:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

On Windows, run in PowerShell:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Open a new terminal after installation, then verify:

```bash
uv --version
```

## Run the mobile demo

This is a local React/TypeScript + FastAPI prototype. It uses fictional sample
content and scripted, source-linked answers. It does **not** use an AI model or
read real notices. Images and PDFs can be previewed locally; their contents are
not sent to the server. Checklist progress is saved in this browser's local storage.

### Install dependencies

From the repository root (Node.js 24 LTS and Python 3.11+):

```bash
npm ci
uv sync --locked --package yasashii-backend
```

### Start both development servers

Terminal 1, from the repository root:

```bash
cd backend
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2, from the repository root:

```bash
npm run dev
```

Open `http://localhost:5173` on your laptop. On a phone connected to the same
Wi-Fi, open the **Network** URL printed by Vite, for example
`http://192.168.1.10:5173`. Do not use `localhost` on the phone: that points to the
phone itself. Vite forwards `/api` to Python, so only port 5173 needs to be reachable.
Allow local network access in your firewall if prompted. Guest Wi-Fi can block
connections between devices. This exposes the development server to your local
network; use a trusted network and do not share confidential notices.

No cloud deployment or public tunnel is created automatically.

### Demo walkthrough

1. Tap **Try the demo** to load the fictional ward-office notice.
2. Switch between English and simple Japanese using the header language button.
3. Review the deadline and required items. Tap **See original** for source text.
4. Open **Your next steps** and check off tasks; progress survives a refresh.
5. Ask about documents, deadlines, or appointments. Unsupported questions explicitly
   report that the answer is not stated. Answers are predefined demo responses.
6. Open **My notices** to resume or remove the sample and reset progress.
7. Try **Add your notice** to preview an image or PDF (up to 8 MB). A clear notice
   explains that uploaded documents cannot be analyzed in this version.

There are no accounts, database, medical recommendations, maps, or real document
processing in this prototype. The sample date is fixed demonstration data, not a
personal deadline. Font files are requested from Google Fonts when available, with
system-font fallbacks.

### Build and serve together

From the root, build the frontend; Vite writes to `backend/app/frontend/`:

```bash
npm run build
```

Then restart Python and open `http://localhost:8000`. FastAPI serves both the UI
and API. No manual copying is required.

To build and run the container manually (Docker must be running):

```bash
docker build -t yasashii-demo .
docker run --rm -p 8080:8080 yasashii-demo
```

Open `http://localhost:8080`. The container honors `PORT` for a future Cloud Run
deployment. No CI/CD workflow is included.

### Local verification

From the repository root:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

From `backend/`:

```bash
uv run black --check app tests
uv run flake8 app tests
uv run pytest
```

Use `npm run format` to format frontend files. Python formatting and linting use
Black and Flake8. The `.flake8` file aligns lint rules with Black's formatting.
