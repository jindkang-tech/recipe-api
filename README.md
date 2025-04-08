# Recipe Management System

A full-stack recipe management application with a RESTful API built using Koa.js and a React single-page application (SPA) frontend.

## Project Overview

This project implements a recipe management system with the following components:

1. **Backend**: A RESTful API built with Koa.js and MySQL
2. **Frontend**: A React-based single-page application
3. **API Documentation**: OpenAPI Specification (OAS) document

## Features

- Create, read, update, and delete recipes
- Responsive design for desktop and mobile devices
- RESTful API with proper error handling
- MySQL database for data persistence

## Technical Stack

### Backend
- Node.js
- Koa.js framework
- MySQL database
- OpenAPI/Swagger for API documentation

### Frontend
- React.js
- Axios for API communication
- CSS for styling

## Project Structure

```
recipe-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── recipeController.js
│   │   ├── models/
│   │   │   └── recipe.js
│   │   ├── routes/
│   │   │   └── recipes.js
│   │   └── app.js
│   ├── swagger.yaml
│   ├── database.sql
│   └── package.json
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── manifest.json
    ├── src/
    │   ├── components/
    │   │   ├── Recipe.js
    │   │   ├── RecipeForm.js
    │   │   └── RecipeList.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MySQL (v5.7 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Set up the database:
   ```sql
   -- Run the SQL commands in database.sql
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Configure the database connection in `backend/src/config/database.js`

5. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Access the application at http://localhost:3000

## API Endpoints

The API provides the following endpoints:

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get a recipe by ID
- `POST /api/recipes` - Create a new recipe
- `PUT /api/recipes/:id` - Update a recipe
- `DELETE /api/recipes/:id` - Delete a recipe

## API Documentation

The API is documented using OpenAPI Specification (OAS) in the `swagger.yaml` file.

## Testing

To implement automated API endpoint tests, you can use tools like Jest and Supertest. Here's how to set it up:

1. Install testing dependencies:
   ```bash
   cd backend
   npm install --save-dev jest supertest
   ```

2. Create test files in a `tests` directory
3. Run tests with `npm test`

## Deployment

### Codio Deployment Instructions

This application is fully configured to work in the Codio environment. Follow these detailed steps to deploy:

1. **Upload Project to Codio**
   - Upload all project files to your Codio workspace, maintaining the directory structure
   - Ensure both `frontend` and `backend` directories are at the root level

2. **Backend Setup**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create and configure the MySQL database:
     - Start MySQL if it's not running:
       ```bash
       sudo service mysql start
       ```
     - Log in to MySQL (in Codio, root typically works with empty password):
       ```bash
       mysql -u root -p
       ```
       (press Enter if it asks for a password - empty password)
     - Import the schema directly from the SQL file:
       ```bash
       mysql -u root < database.sql
       ```
       
     - Alternatively, you can run the SQL commands manually:
       ```sql
       source database.sql
       ```
   - The database configuration has been updated to use the root user with an empty password,
     which is common in Codio environments.
   - Test database connection:
     ```bash
     node -e "require('./src/config/database.js')"
     ```
     You should see "Database connection established successfully"

3. **Frontend Setup**
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - The frontend is configured to automatically detect the Codio environment 
     and will connect to the backend using your Codio box URL

4. **Start the Application**
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - The backend will be running on port 3005
   - In a new terminal, start the frontend:
     ```bash
     cd frontend
     npm start
     ```
   - The frontend will be running on port 3000

5. **Access the Application**
   - Access your frontend at: `https://[box-name]-3000.codio-box.uk/`
     (e.g., `https://peacehoney-lauraeric-3000.codio-box.uk/`)
   - The backend API will be at: `https://[box-name]-3005.codio-box.uk/api/`
   - Login with the default admin user:
     - Username: `jind`
     - Password: `admin123`

6. **Troubleshooting**
   - If MySQL isn't starting:
     ```bash
     sudo service mysql status
     sudo service mysql start
     ```
   - If you see database connection errors, verify credentials in `backend/src/config/database.js`
   - Check CORS errors in the browser console - the CORS config has been updated to allow requests from Codio domains
   - The frontend automatically detects the Codio environment and adjusts API URLs accordingly
   - If you encounter "Invalid Host header" error:
     - We've added a `.env.development` file that should fix this
     - If problems persist, try restarting the frontend server
     - As a last resort, you can build the app instead of using the dev server:
       ```bash
       npm run build
       npx serve -s build -l 3000
       ```

## Security Features

- Input validation
- Error handling
- CORS protection

## License

MIT License
