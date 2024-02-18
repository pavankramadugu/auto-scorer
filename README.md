# AutoGrader UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.7.

## Install

Run `npm run install` to install the project dependencies.

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.


# AutoGrader Server

## Getting Started

### Prerequisites

- Python 3 or higher
- pip

### Installation

Navigate to the project directory:
   ```
cd auto-grader-server
   ```
Create a virtual environment:
   ```
python -m venv grader-env
   ```
Activate the virtual environment:
   - Windows:
     ```
     grader-env\Scripts\activate
     ```
   - macOS/Linux:
     ```
      grader-env/bin/activate
     ```
### Install the required dependencies:
   ```
pip install -r requirements.txt
   ```

### Configuration

Here's the configuration section for your README.md file based on the provided Flask application code:

### Configuration

Before running the application, you need to configure a few components:

1. **Google Service Account Credentials:**
  - Create a service account in the Google Cloud Console and download the JSON credentials file.
  - Rename the file to `creds.json` and place it in the root directory of your Flask application.
  - This file is used to authenticate with Google Sheets API to read and write data to your spreadsheets.

2. **Google Sheets:**
  - Create two Google Sheets named "CSE 598 Lab 1" and "CSE 598 Lab 2" in your Google Drive.
  - Share these sheets with the email address associated with your service account (found in `creds.json`) with editor access.

3. **Go Environment Path:**
  - The application requires a Go environment to execute Go tests. Set the `GO_ENVIRONMENT_PATH` variable in your code to the path where you want to store temporary Go files and execute tests.
  - For example, you can set it to a directory like `/Users/yourusername/go_test_environment`.

4. **Smart Contract Test File:**
  - Ensure that you have a Go test file named `smartcontract_test.go` in your `GO_ENVIRONMENT_PATH` directory. This file will be copied to the user's directory to run tests against the uploaded `smartcontract.go` file.

### Running the Application

After configuring the application, you can start the Flask server by running:

```bash
python -m flask run
```

This will start the server in debug mode, and you can access the endpoints `/save` and `/upload-file` to interact with the application.
