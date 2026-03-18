# Local Development Guide - Potato Disease Classification

This guide provides the exact steps to set up and run the Potato Disease Classification project on your local machine.

## Prerequisites

- **Python 3.8+**
- **Node.js (v14+)** & **npm**
- **Git**

---

## 1. Backend Setup (FastAPI)

The backend handles the machine learning model prediction using TensorFlow and FastAPI.

1. **Navigate to the API directory:**

   ```bash
   cd api
   ```

2. **Create and activate a virtual environment:**

   ```bash
   # Create environment
   python3 -m venv venv

   # Activate environment (macOS/Linux)
   source venv/bin/activate

   # Activate environment (Windows)
   # venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --host localhost --port 8000 --reload
   ```
   _The API will be available at: `http://localhost:8000`_

---

## 2. Frontend Setup (React)

The frontend is a React application that allows users to upload leaf images for classification.

1. **Navigate to the frontend directory:**

   ```bash
   cd ../frontend
   ```

2. **Install Node dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a file named `.env` in the `frontend` folder and add the following line:

   ```env
   REACT_APP_API_URL=http://localhost:8000/predict
   ```

4. **Run the React application:**

   ```bash
   # If you are using Node.js v17 or newer (likely), use:
   NODE_OPTIONS=--openssl-legacy-provider npm start

   # Otherwise, simply use:
   npm start
   ```

   _The app will be available at: `http://localhost:3000` (or the next available port)._

---

## 🛠️ Troubleshooting & Common Issues

### Port 8000 or 3000 already in use

If you get an "Address already in use" error:

- **For Backend:** Change the port in the uvicorn command: `uvicorn main:app --port 8001`
- **For Frontend:** npm will usually ask if you want to run on another port. Type `Y` to continue.

### `ERR_OSSL_EVP_UNSUPPORTED`

This is a known issue with Node.js v17+ and older versions of `react-scripts`.
**Fix:** Prefix your start command with `NODE_OPTIONS=--openssl-legacy-provider`.

### Missing Model Error

Ensure the model file exists at `api/saved_models/1.keras`.
