# 📦 SmartMargin

<div align="center">
  <a href="https://github.com/ranaahmd/smartmargin-frontend">
    <img src="../smartmargin-frontend/image.png" alt="SmartMargin Logo" width="100" height="100">
  </a>
  <h3 align="center">SmartMargin</h3>
  <p align="center">
    A full-stack web application to help users manage products and ingredients efficiently.<br>
    Calculate total cost, profit, and selling price in real time with precision and ease.<br>
    Built with React, Django REST Framework, and PostgreSQL.
  </p>
</div>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Built With](#built-with)
- [Installation](#installation)
- [Usage](#usage)
- [Backend Repository](#backend-repository)
- [Code Highlight](#code-highlight)
- [Future Enhancements](#future-enhancements)

---

##  About the Project

SmartMargin is a full-stack application designed to streamline product pricing by allowing users to:

- Create products and assign multiple ingredients with specific quantities.
- Automatically calculate total cost, profit margin, and selling price.
- View real-time updates as ingredient data changes.
- Authenticate securely using JWT.
- Enjoy full CRUD functionality through a clean, responsive UI.

The backend is powered by Django REST Framework and PostgreSQL, while the frontend is built with React and Tailwind CSS. Docker ensures smooth deployment across environments.

---

##  Features

-  JWT-based user authentication
-  Real-time cost and profit calculations
-  Full CRUD operations for products and ingredients
-  Responsive UI with Tailwind CSS
-  Dockerized setup for easy deployment

---

##  Tech Stack

| Layer         | Technologies Used                  |
|---------------|------------------------------------|
| Frontend      | React.js, Tailwind CSS             |
| Backend       | Django REST Framework              |
| Database      | PostgreSQL                         |
| Containerization | Docker                         |
| Authentication| JWT (JSON Web Token)               |
| Version Control| Git & GitHub                      |

---

## ⚙️ Built With

- **React.js** – Dynamic and responsive frontend
- **Tailwind CSS** – Clean and modern UI styling
- **Django REST Framework** – Robust backend API
- **PostgreSQL** – Reliable relational database
- **Docker** – Seamless containerization and deployment
- **Git & GitHub** – Version control and collaboration

---
## Backend Repository
[SmartMargin Backend](https://github.com/ranaahmd/-smartmargin-backend)

## Code Highlight
One of the standout features is the real-time cost calculation logic. It dynamically updates the product pricing based on ingredient quantities and profit percentages. This logic blends precision, performance, and real-world math—something I truly enjoyed building.

## Future Enhancements
Add data visualization charts for cost and profit tracking

 Implement user roles and permissions (Admin, Regular User)

 Multi-language support for global accessibility

 Email notifications for product updates

 Dark/light mode toggle for better UX

Enhanced testing coverage for frontend and backend
##  Installation

To run the project locally using Docker:

```bash
# 1. Clone the frontend repository
git clone https://github.com/ranaahmd/smartmargin-frontend
cd smartmargin-frontend

# 2. Build and start the containers
docker-compose up --build

# 3. Access the application
Frontend: http://localhost:3000  
Backend: http://localhost:8000

# 4. To stop the containers
docker-compose down




