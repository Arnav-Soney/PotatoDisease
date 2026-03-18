# PotatoDisease

# 🚀 Potato Disease Classification App (FastAPI & React)

This project is a full-stack application consisting of a Python FastAPI backend (for image classification) and a React frontend. The application is designed to be deployed easily using **Render.com's** free tier.

The project structure is organized into two main directories:

- `api/`: Contains the FastAPI application, Python dependencies, and the machine learning model.
- `frontend/`: Contains the React application code and Node.js dependencies.

---

## � Dataset Credits

The dataset used for training the models is from the **PlantVillage** dataset on Kaggle:

🔗 **[PlantVillage Dataset](https://www.kaggle.com/arjuntejaswi/plant-village)**

This dataset contains images of healthy and diseased plant leaves for:

- 🥔 **Potato** - Early Blight, Late Blight, Healthy
- 🌶️ **Pepper** - Bacterial Spot, Healthy
- 🍅 **Tomato** - Multiple diseases including Early Blight, Late Blight, Leaf Mold, and more

---

## �🖥️ Local Development Guide

This section provides the exact steps to set up and run the project on your local machine.

### Prerequisites

- **Python 3.12**
- **Node.js (v14+)** & **npm**
- **Git**

---

### 1. Backend Setup (FastAPI)

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

### 2. Frontend Setup (React)

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

### 🛠️ Troubleshooting & Common Issues

#### Port 8000 or 3000 already in use

If you get an "Address already in use" error:

- **For Backend:** Change the port in the uvicorn command: `uvicorn main:app --port 8001`
- **For Frontend:** npm will usually ask if you want to run on another port. Type `Y` to continue.

#### `ERR_OSSL_EVP_UNSUPPORTED`

This is a known issue with Node.js v17+ and older versions of `react-scripts`.
**Fix:** Prefix your start command with `NODE_OPTIONS=--openssl-legacy-provider`.

#### Missing Model Error

Ensure the model file exists at `api/saved_models/1.keras`.

---

## ☁️ Deploying to Render.com

Render allows you to deploy both the API and the frontend as two separate, interconnected services directly from this repository.

### Prerequisites

1.  A Render.com account (free signup, no credit card required for the free tier).
2.  The project repository must be connected to your Render account.

### Step 1: Deploy the Backend API (FastAPI Web Service)

The FastAPI service runs the prediction model and generates a public endpoint.

| Setting            | Value                                          | Notes                                                              |
| :----------------- | :--------------------------------------------- | :----------------------------------------------------------------- |
| **Service Type**   | Web Service                                    | Python environment.                                                |
| **Root Directory** | `api`                                          | Points to the FastAPI code folder.                                 |
| **Environment**    | Python 3                                       | Ensure correct runtime.                                            |
| **Build Command**  | `pip install -r requirements.txt`              | Installs Python dependencies (e.g., TensorFlow, FastAPI).          |
| **Start Command**  | `uvicorn main:app --host 0.0.0.0 --port $PORT` | Uses Uvicorn for asynchronous serving, utilizing Render's `$PORT`. |
| **Instance Type**  | Free                                           | This service may sleep after 15 minutes of inactivity.             |

**Action:** Once deployed, Render will generate a public URL (e.g., `https://potatodisease-3gpa.onrender.com/`). **Copy this URL** as it is needed for the next step.

---

### Step 2: Deploy the Frontend (React Static Site)

The React application hosts the user interface and is configured to talk to the live API from Step 1.

| Setting               | Value                          | Notes                                                        |
| :-------------------- | :----------------------------- | :----------------------------------------------------------- |
| **Service Type**      | Static Site                    | Node/React environment.                                      |
| **Root Directory**    | `frontend`                     | Points to the React app root.                                |
| **Build Command**     | `npm install && npm run build` | Installs Node dependencies and creates the production build. |
| **Publish Directory** | `build`                        | The folder created by the build command.                     |

#### Environment Variables (Crucial Connection)

The frontend requires the API URL to be injected during the build process. You must also include a fix for a common Node.js build issue on newer versions.

Go to the **Advanced** section of your Static Site settings and add the following two environment variables:

| Key                 | Value                            | Purpose                                                                                                |
| :------------------ | :------------------------------- | :----------------------------------------------------------------------------------------------------- |
| `REACT_APP_API_URL` | **`[Your FastAPI URL]/predict`** | **Set this to your actual URL from Step 1.** (e.g., `https://potatodisease-3gpa.onrender.com/predict`) |
| `NODE_OPTIONS`      | `--openssl-legacy-provider`      | Fixes a common build error with Node.js v17+ compatibility.                                            |

**Final Step:** Click to deploy the Static Site. The resulting URL is your live application!
