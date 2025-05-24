# 📝 TODO App API

A robust and secure RESTful API for managing TODO tasks with user authentication and authorization. Built with Node.js, Express, Sequelize ORM, and MySQL, featuring JWT-based authentication, input validation, and comprehensive API documentation.

---

## 🚀 Technologies Used

| Technology                                                                                              | Description                     | Version          |
| ------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------------- |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) Node.js            | JavaScript runtime environment  | 16+ (assumed)    |
| ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) Express            | Web framework                   | ^5.1.0           |
| ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?logo=sequelize&logoColor=white) Sequelize    | ORM for MySQL                   | ^6.37.7          |
| ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white) MySQL                    | Relational database             | ^3.14.1 (mysql2) |
| ![JWT](https://img.shields.io/badge/JWT-000000?logo=JSON%20web%20tokens&logoColor=white) JSON Web Token | Authentication token            | ^9.0.2           |
| ![bcrypt](https://img.shields.io/badge/bcrypt-000000?logo=bcrypt&logoColor=white) bcrypt                | Password hashing                | ^5.1.1           |
| ![Joi](https://img.shields.io/badge/Joi-000000?logo=Joi&logoColor=white) Joi                            | Input validation                | ^17.13.3         |
| ![Morgan](https://img.shields.io/badge/Morgan-000000?logo=morgan&logoColor=white) Morgan                | HTTP request logger             | ^1.10.0          |
| ![Helmet](https://img.shields.io/badge/Helmet-000000?logo=helmet&logoColor=white) Helmet                | Security middleware             | ^8.1.0           |
| ![CORS](https://img.shields.io/badge/CORS-000000?logo=cors&logoColor=white) CORS                        | Cross-Origin Resource Sharing   | ^2.8.5           |
| ![Swagger](https://img.shields.io/badge/Swagger-000000?logo=swagger&logoColor=white) Swagger UI & JSDoc | API documentation               | ^5.0.1, ^6.2.8   |
| ![Lodash](https://img.shields.io/badge/Lodash-000000?logo=lodash&logoColor=white) Lodash                | Utility library                 | ^4.17.21         |
| ![dotenv](https://img.shields.io/badge/Dotenv-000000?logo=dotenv&logoColor=white) dotenv                | Environment variable management | ^16.5.0          |
| ![Nodemon](https://img.shields.io/badge/Nodemon-000000?logo=nodemon&logoColor=white) Nodemon            | Development server auto-restart | ^3.1.10 (dev)    |

---

## ✨ Features

- 🔐 User registration and login with JWT authentication
- 🛡️ Password hashing with bcrypt for security
- ✅ CRUD operations for TODO tasks with priority and status management
- 🔍 Search TODOs by title and user
- 👥 User management: get all users, get user by ID, update, delete
- 📋 Input validation using Joi for robust API requests
- 🛡️ Security best practices with Helmet and CORS middleware
- 📜 API documentation with Swagger UI available at `/api-docs`
- 📝 Logging HTTP requests with Morgan

---

## 📚 API Endpoints Summary

| Module         | Endpoint                      | Method | Description                      | Auth Required |
| -------------- | ----------------------------- | ------ | -------------------------------- | ------------- |
| Authentication | `/api/auth/register`          | POST   | Register a new user              | No            |
|                | `/api/auth/login`             | POST   | User login                       | No            |
| Users          | `/api/users`                  | GET    | Get all users with their todos   | Yes           |
|                | `/api/users/:id`              | GET    | Get user by ID with todos        | Yes           |
|                | `/api/users/userProfile/:id`  | GET    | Get user profile by ID           | Yes           |
|                | `/api/users/:id`              | PUT    | Update user by ID                | Yes           |
|                | `/api/users/:id`              | DELETE | Delete user by ID                | Yes           |
| Todos          | `/api/todos/:userId`          | POST   | Create a todo for a user         | Yes           |
|                | `/api/todos/:todoId`          | PUT    | Update a todo by ID              | Yes           |
|                | `/api/todos/:todoId`          | DELETE | Delete a todo by ID              | Yes           |
|                | `/api/todos/:todoId/status`   | PATCH  | Update todo status               | Yes           |
|                | `/api/todos/:todoId/complete` | PATCH  | Mark todo as complete            | Yes           |
|                | `/api/todos/search`           | GET    | Search todos by title and userId | Yes           |

---

## 🛠️ Middleware Used

- **Morgan**: HTTP request logging
- **CORS**: Cross-Origin Resource Sharing enabled for all origins
- **Helmet**: Secures HTTP headers
- **express.json()**: Parses incoming JSON requests
- **Authentication Middleware**: Protects routes requiring user authentication

---

## ⚙️ Installation & Running

1. Clone the repository:

```bash
git clone https://github.com/oraclematrix/todo_app_api.git
cd todo_app_api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

4. Run the development server:

```bash
npm run dev
```

5. Access the API documentation at: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

Ehsan Mohammadipoor
