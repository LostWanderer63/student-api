# Student API

Express + MySQL (mysql2) API for student records using raw SQL queries.

## Setup

```bash
npm install
cp .env.example .env              # add your MySQL credentials
mysql -u root -p < schema.sql     # creates student_db and the students table
npm start                         # http://localhost:3000
```

## Endpoints

| Method | Path            | Description            |
|--------|-----------------|------------------------|
| POST   | /students       | Insert a new student   |
| GET    | /students       | Retrieve all students  |
| GET    | /students/:id   | Retrieve a student     |
| PUT    | /students/:id   | Update student details |
| DELETE | /students/:id   | Delete a student       |

Body for POST/PUT: `{ "name": "MS Dhoni", "email": "dhoni@example.com", "age": 42 }`

Missing students return `404`, duplicate emails `409`, missing fields `400`.
Insert, update and delete operations are logged to the console.
