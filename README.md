# HealMate

HealMate is a smart health-tech solution designed to tackle medication non-adherence using artificial intelligence. The system monitors patient medication behavior, predicts missed doses, and provides real-time alerts to patients, caregivers, and healthcare providers.

## Features

- **User Authentication**: Secure user registration and login.
- **Medication Management**: Add, update, and view medication schedules.
- **Adherence Tracking**: Log and monitor medication adherence.
- **AI-Powered Predictions**: Predicts medication non-adherence using machine learning.
- **Real-time Alerts**: Notifies users, caregivers, and doctors about potential non-adherence.
- **Caregiver Portal**: A dedicated dashboard for caregivers to monitor dependents.
- **Patient Invitation**: Caregivers can invite patients to be managed under their care.
- **Informational Pages**: Includes pages for Contact, Documentation, Privacy Policy, and Terms of Service.

## Tech Stack

### Frontend
- **React.js**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

### Backend
- **Node.js**: A JavaScript runtime for building server-side applications.
- **Express.js**: A web application framework for Node.js.
- **MongoDB**: A NoSQL database for storing application data.
- **Mongoose**: An ODM library for MongoDB and Node.js.
- **Firebase Admin**: For backend integration with Firebase services.
- **JSON Web Tokens (JWT)**: For secure user authentication.

### Data Pipeline & Machine Learning
- **Python**: For data processing and machine learning.
- **Pandas**: A data analysis and manipulation library.
- **Scikit-learn**: A machine learning library for predictive data analysis.
- **FastAPI**: A modern, fast web framework for building APIs with Python.

## Project Structure

```
HealMate/
├── backend/         # Node.js backend server
├── data-pipeline/   # Python scripts for data processing and ML
├── datasets/        # Sample datasets
├── docs/            # Project documentation
├── frontend/        # React.js frontend application
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- Python
- pip (Python package installer)
- MongoDB

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Nitish0018/HealMate.git
    cd HealMate
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install data pipeline dependencies:**
    ```bash
    cd ../data-pipeline
    pip install -r requirements.txt
    ```

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    npm start
    ```

2.  **Run the data processing pipeline:**
    ```bash
    cd data-pipeline
    python data_processing.py
    ```

