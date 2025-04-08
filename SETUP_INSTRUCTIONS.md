# Recipe Management System - Setup Instructions for Codio

This document provides detailed instructions for setting up and running the Recipe Management System in a Codio environment.

## Project Overview

This is a full-stack recipe management application with:
- Koa.js RESTful API backend
- MySQL database
- React.js single page application frontend
- OpenAPI documentation
- Automated tests

## Setup Instructions

### 1. Database Setup

First, set up the MySQL database:

```bash
# Log in to MySQL (use your Codio credentials)
mysql -u root -p

# Once logged in, run the SQL commands from database.sql
source database.sql

# Exit MySQL
exit
```

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm start
```

The backend server will run on port 3001. You should see output confirming the server is running and listing the available API endpoints.

### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

The frontend development server will run on port 3000.

### 4. Accessing the Application

In Codio, you'll need to make the application accessible through the Box URL:

1. From the Codio menu, select "Project" > "Configure..."
2. Click on "Ports" and add entries for ports 3000 and 3001
3. Click "Save"

You can now access:
- Frontend: https://[box-name]-3000.codio.io
- Backend API: https://[box-name]-3001.codio.io/api/recipes

## Running Tests

To run the automated API tests:

```bash
# Navigate to the backend directory
cd backend

# Run tests
npm test
```

## API Documentation

The API is documented using OpenAPI Specification in the `swagger.yaml` file. You can view this documentation using a Swagger UI tool or by importing the YAML file into a tool like Postman.

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:
1. Check that MySQL is running
2. Verify the database credentials in `backend/src/config/database.js`
3. Ensure the recipe_db database exists

### Port Conflicts

If you encounter port conflicts:
1. Check if other applications are using ports 3000 or 3001
2. Modify the port numbers in the respective configuration files

### CORS Issues

If you encounter CORS issues:
1. Verify that the frontend is making requests to the correct backend URL
2. Check that CORS middleware is properly configured in the backend

## Additional Resources

- Koa.js documentation: https://koajs.com/
- React.js documentation: https://reactjs.org/
- MySQL documentation: https://dev.mysql.com/doc/
