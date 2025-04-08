# Recipe Management Application

A full-stack recipe management application built with Node.js, React, and MySQL.

## Features

- User authentication and authorization
- Recipe CRUD operations
- Recipe categorization
- Recipe ratings and comments
- Meal planning
- Admin panel for user management
- Swagger API documentation

## Tech Stack

### Backend
- Node.js v16.20.2
- Koa.js web framework
- MySQL database (via mysql2)
- JWT authentication
- Swagger API documentation

### Frontend
- React 18
- Ant Design components
- Axios for API calls
- Modern and responsive UI

## Getting Started

### Prerequisites
- Node.js v16.20.2
- MySQL 8.0 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jindkang-tech/recipe-api.git
cd recipe-api
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a MySQL database named 'recipe_db'

5. Set up environment variables:
Create a `.env` file in the backend directory with:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=recipe_db
JWT_SECRET=your_secret_key
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


## License
MIT License
