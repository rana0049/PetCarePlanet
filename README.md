# PetCarePlenet.net

A complete full-stack web application for pet care, marketplace, and vet appointments tailored for Pakistan.

## Features

- **Health Monitoring**: Track pet weight, vaccinations, and medical history.
- **Marketplace**: Buy and sell pets with search and filtering.
- **Vet Appointments**: Find vets and book appointments.
- **Blogs**: Read pet care articles.
- **Authentication**: Role-based access (Pet Owner, Vet, Admin).
- **Payments**: Mock integration for JazzCash/Easypaisa.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB

## Setup Instructions

1.  **Prerequisites**: Ensure Node.js and MongoDB are installed.
2.  **Install Dependencies**:
    ```bash
    npm run install-all
    ```
3.  **Environment Variables**:
    - The `server/.env` file is pre-configured with default values.
    - `MONGO_URI=mongodb://localhost:27017/petcareplenet`
4.  **Run Application**:
    ```bash
    npm start
    ```
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:5000`

## User Roles & Testing

- **Register**: Create a new account as a Pet Owner or Vet.
- **Login**: Use your credentials to access the Dashboard.
- **Marketplace**: Go to `/market` to browse or `/create-listing` to sell.
- **Vets**: Go to `/vets` to see available doctors.
