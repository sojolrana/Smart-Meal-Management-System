# Smart Meal Management System

A full-stack, containerized web application designed to modernize meal management for university residence halls. This system replaces inefficient paper-based processes with a modern, cashless, and data-driven platform for students, hall administrators, and kitchen staff.

## 🚀 Live Demo

The project is deployed and live at:
**[https://meal.projects.sojolrana.com](https://meal.projects.sojolrana.com)**

---

## 🌟 Key Features

* **Role-Based Dashboards:** Separate, secure interfaces for Students, Kitchen Staff, and Hall Admins (Superuser).
* **Meal Management:** Students can easily toggle their daily meals ON or OFF and schedule preferences for the week.
* **Digital Wallet:** A simple, cashless payment system. Students can recharge their balance (future-proofed for payment gateways).
* **Automated Payments:** The system automatically deducts the cost of a meal from a student's wallet when their meal is toggled ON.
* **Menu System:** Admins/Staff can set the daily or weekly menu, and students can view it.
* **Guest Meals:** Students can order and pay for guest meals for their visitors.
* **Admin Approval:** New student and staff accounts must be manually approved by an admin for security.
* **Kitchen Dashboard:** A read-only "kitchen mode" for cooks to see the exact count of "ON" meals for the day, reducing food waste.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Backend** | ![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white) ![Django REST](https://img.shields.io/badge/DRF-A30000?style=for-the-badge&logo=django&logoColor=white) |
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) |
| **DevOps** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white) |

---

## 🏛️ System Architecture

This project uses a decoupled, multi-container architecture, orchestrated with Docker Compose.

* A **Host Nginx** (on the DigitalOcean droplet) acts as a reverse proxy, handling SSL and routing traffic from the subdomain to the application.
* The application itself runs in **Docker Compose** with four main services:
    1.  **Project Nginx:** A second internal proxy that routes traffic to the correct container (`/api` to backend, `/` to frontend).
    2.  **Backend (Django/DRF):** A Gunicorn server running the Python API.
    3.  **Frontend (Next.js):** A Node.js server running the React application.
    4.  **Database (PostgreSQL):** A dedicated container for data persistence.



---

## 💻 Getting Started: Local Development

To run this project on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/sojolrana/Smart-Meal-Management-System.git](https://github.com/sojolrana/Smart-Meal-Management-System.git)
    cd Smart-Meal-Management-System
    ```

2.  **Create your environment file:**
    * Create a file named `.env` in the root directory and add the following:
    ```ini
    # --- PostgreSQL Database Secrets ---
    POSTGRES_DB=smart_meal_db
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgrespassword
    
    # --- Django Backend Secrets ---
    # (Generate a new key for better security)
    DJANGO_SECRET_KEY=your-local-dev-secret-key
    DJANGO_DEBUG=True
    ```

3.  **Build and Run with Docker Compose:**
    ```bash
    docker compose up --build
    ```

4.  **Create your database tables:**
    * In a **new terminal window**, run the migrations:
    ```bash
    docker compose exec backend python manage.py migrate
    ```

5.  **Create a Superuser (Admin):**
    ```bash
    docker compose exec backend python manage.py createsuperuser
    ```

6.  **Access the application:**
    * **Frontend:** `http://localhost/`
    * **Login Page:** `http://localhost/login`
    * **Registration Page:** `http://localhost/register`
    * **Backend Admin:** `http://localhost/admin/`

---

## 🚀 Deployment (CI/CD)

This project is configured with a GitHub Actions workflow for continuous integration and deployment to a DigitalOcean droplet.

1.  **On push to `main`**, the workflow (defined in `.github/workflows/deploy.yml`) is triggered.
2.  **Build:** Production Docker images for the `backend` and `frontend` are built and pushed to Docker Hub.
3.  **Deploy:** The action SSHes into the server, pulls the new images, and restarts the application using `docker compose.prod.yml`.
4.  **Host Nginx** on the server routes traffic from `https://meal.projects.sojolrana.com` to the running application.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sojol Rana**
* GitHub: [@sojolrana](https://github.com/sojolrana)
* Website: [sojolrana.com](https://sojolrana.com)