# DevFest 2026

## Development tools

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
