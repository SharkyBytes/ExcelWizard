# Excel Wizard ✨📊

**Excel Wizard** is a powerful web application that allows users to upload, validate, and import data from Excel files into a MongoDB database. With features like drag-and-drop file upload, data preview, error handling, and pagination, **Excel Wizard** makes data management simple and intuitive for businesses.

## Overview

Excel Wizard simplifies the process of handling Excel files by providing an easy-to-use interface for validating data, previewing it before import, and efficiently storing it in a MongoDB database. Built with **React.js** on the frontend and **Node.js/Express.js** on the backend, this app makes working with Excel files a breeze! 🌟

## Features 🚀

- **File Upload 📤:**
  - Drag-and-drop functionality for easy file uploads.
  - Fallback file input button for those who prefer to browse files.
  - Only accepts `.xlsx` files with a maximum size of 2 MB.

- **Error Handling ⚠️:**
  - Displays validation errors in a modal dialog.
  - Provides row numbers and descriptions of errors for each invalid row.
  - Errors for multiple sheets are displayed in separate tabs.

- **Data Preview 📝:**
  - Dropdown to select from multiple sheets in the uploaded file.
  - Data is displayed in a paginated table.
  - Date formatting as DD-MM-YYYY.
  - Numeric values formatted with Indian number format (e.g., 12,34,456.00).
  - Option to delete rows with a confirmation dialog.

- **Data Import 💾:**
  - Imports valid rows to MongoDB.
  - Skips invalid rows and highlights them after import.
  - Displays a success message after successful import.

- **Backend Validation 🔍:**
  - Validates file based on predefined rules (Name, Amount, Date mandatory).
  - Supports future sheet extensions with different columns and validation rules.

## Requirements ⚙️

Ensure the following dependencies are installed:

- **Node.js** (>= 14.17.0)
- **MongoDB Atlas** (free tier)
- **Express.js** (>= 4.17.1)
- **React.js** (>= 17.0.2)
- **Tailwind CSS** (>= 2.0.0)
- **Mongoose** (>= 5.13.2)
- **xlsx** or **exceljs** (for backend Excel file processing)

## Installation 🛠️

To get started with the **Excel Wizard** project:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SharkyBytes/ExcelWizard.git
   ```

2. **Install dependencies:**
   ```bash
   cd excel-wizard
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the application in your browser:**
   Visit `http://localhost:3000` to use the app. 🎉

## Configuration 🔧

Create a `.env` file in the root directory with the following environment variables:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `PORT`: The port number for the backend server (default: `3000`)

Example `.env` file:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/excel-wizard
PORT=3000
```

## API Endpoints 📡

The backend exposes the following endpoints:

- **`POST /api/upload`**: Upload an Excel file and process its data.
- **`POST /api/import`**: Import the valid rows from the uploaded Excel file into the MongoDB database.

## Frontend 💻

The frontend is built with **React.js** and **Tailwind CSS** for styling. Key components include:

- **`App.tsx`**: Main component that coordinates the UI and interactions.
- **`FileUpload.tsx`**: Component for handling file uploads.
- **`DataTable.tsx`**: Displays a preview of the uploaded data.
- **`ErrorModal.tsx`**: Modal dialog for showing validation errors.

## Backend ⚡

The backend is built using **Express.js** and is located in the `server` directory. The backend handles file uploads, validation, and data import. Key files include:

- **`server/index.js`**: Main server file to set up routes and middleware.
- **`server/api/upload.js`**: Handles file upload and processing.
- **`server/api/import.js`**: Imports validated data into MongoDB.

## Database 🗄️

Data is stored in **MongoDB Atlas**. The backend uses **Mongoose** to interact with the database, and the schema is designed to handle dynamic validation rules for various sheets.

## Project Structure 🏗️

Here’s a glimpse of the project structure:

```
.
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── project_structure.txt
├── server
│   └── index.js
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── DataTable.tsx
│   │   ├── ErrorModal.tsx
│   │   └── FileUpload.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── types
│   │   └── index.ts
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Contributing 🤝

We welcome contributions! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push your changes (`git push origin feature-branch`).
6. Create a pull request.

