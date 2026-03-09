# 🍽️ Smart Meal Management System

[![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?style=for-the-badge&logo=php&logoColor=white)]()
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)]()
[![Bootstrap](https://img.shields.io/badge/Bootstrap-Frontend-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)]()

A lightweight **web-based meal management platform** designed for university residence halls.  
The system digitizes meal tracking, wallet transactions, and kitchen management to replace inefficient manual processes.

Students can manage their meals, administrators can monitor operations, and kitchen staff can see real-time meal counts — all from a single platform.

---

# 🌐 Live Demo

🔗 **https://meal.sojolrana.com**

---

# ✨ Features

### 👨‍🎓 Student Features

- Register and login
- Toggle daily meal ON/OFF
- View daily menu
- Book guest meals
- Wallet balance management
- Transaction history
- Receive hall notices

### 👨‍🍳 Kitchen Staff Features

- View total meal count
- Check daily menu
- Monitor meal attendance

### 🛠 Admin Features

- Manage users and approvals
- Manage students
- Manage kitchen staff
- Update daily menu
- Post notices
- Monitor transactions

---

# 🧰 Technology Stack

| Layer | Technology |
|------|------------|
| Frontend | HTML, Bootstrap, JavaScript |
| Backend | PHP |
| Database | MySQL / MariaDB |
| API | PHP REST-style endpoints |
| Server | Apache / Nginx |

---

# 🏗 System Architecture

```
User Browser
      │
      ▼
HTML / Bootstrap Frontend
      │
      ▼
PHP Backend API
(api/*.php)
      │
      ▼
MySQL Database
(meal_db)
```

---

# 📁 Project Structure

```
Smart-Meal-Management-System
│
├── api/
│   ├── config.php
│   ├── login.php
│   ├── signup.php
│   └── other API endpoints
│
├── uploads/
│   └── uploaded images
│
├── admin_dashboard.html
├── student_dashboard.html
├── kitchen_staff_dashboard.html
├── login.html
├── signup.html
├── index.html
│
└── README.md
```

---

# ⚙️ Local Development Setup

## 1️⃣ Clone the repository

```bash
git clone https://github.com/sojolrana/Smart-Meal-Management-System.git
cd Smart-Meal-Management-System
```

---

## 2️⃣ Setup a Local Server

Install one of the following:

- XAMPP
- WAMP
- Laragon
- Apache + PHP + MySQL

Move the project folder into:

```
htdocs/
```

Example:

```
xampp/htdocs/Smart-Meal-Management-System
```

---

# 🗄 Database Setup

This project requires a **MySQL database named `meal_db`**.

You can create it manually using the SQL commands below.

---

## Step 1 — Create Database

Login to MySQL:

```bash
mysql -u root -p
```

Run:

```sql
CREATE DATABASE meal_db;
USE meal_db;
```

---

# Step 2 — Create All Tables

Run the following SQL script to create all required tables at once.

```sql
CREATE TABLE users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 email VARCHAR(100) UNIQUE NOT NULL,
 password VARCHAR(255) NOT NULL,
 role ENUM('student','kitchen_staff','admin') NOT NULL,
 is_approved TINYINT(1) DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 is_blocked TINYINT(1) DEFAULT 0
);

CREATE TABLE students (
 user_id INT PRIMARY KEY,
 full_name VARCHAR(100),
 student_id_no VARCHAR(50) UNIQUE,
 registration_no VARCHAR(50),
 department VARCHAR(100),
 hall_name VARCHAR(100),
 father_name VARCHAR(100),
 mother_name VARCHAR(100),
 phone VARCHAR(20),
 present_address TEXT,
 permanent_address TEXT,
 dob DATE,
 blood_group VARCHAR(10),
 gender VARCHAR(20),
 nid_no VARCHAR(50),
 birth_certificate_no VARCHAR(50),
 photo_path VARCHAR(255),
 id_card_path VARCHAR(255),
 wallet_balance DECIMAL(10,2) DEFAULT 0.00,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE kitchen_staff (
 user_id INT PRIMARY KEY,
 full_name VARCHAR(100),
 father_name VARCHAR(100),
 mother_name VARCHAR(100),
 hall_name VARCHAR(100),
 phone VARCHAR(20),
 nid_number VARCHAR(50),
 present_address TEXT,
 permanent_address TEXT,
 dob DATE,
 blood_group VARCHAR(10),
 gender VARCHAR(20),
 photo_path VARCHAR(255),
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE daily_menu (
 id INT AUTO_INCREMENT PRIMARY KEY,
 menu_date DATE UNIQUE NOT NULL,
 lunch TEXT,
 dinner TEXT,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE meal_attendance (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 meal_date DATE NOT NULL,
 is_active TINYINT(1) DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY unique_attendance (user_id, meal_date),
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE guest_bookings (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 booking_date DATE NOT NULL,
 quantity INT NOT NULL,
 total_cost DECIMAL(10,2) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 amount DECIMAL(10,2) NOT NULL,
 type ENUM('credit','debit') NOT NULL,
 description VARCHAR(255) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notices (
 id INT AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(255) NOT NULL,
 message TEXT NOT NULL,
 posted_by INT NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

After running this script, all tables required by the application will be created.

---

# 👑 Create the First Admin Account

For security reasons, **admin accounts cannot be created from the registration page**.  
The first admin must be created manually in the database.

### Step 1 — Open MySQL

```sql
USE meal_db;
```

### Step 2 — Insert Admin User

Run the following SQL:

```sql
INSERT INTO users (email, password, role, is_approved, is_blocked)
VALUES (
'admin@gmail.com',
'$2a$12$lMbpI8WhghLPcsNc5U/Y1.xfnjhl4RoImh1RSWmIKGmsC1Vn/het.',
'admin',
1,
0
);
```

### Step 3 — Login

Open the login page:

```
http://localhost/Smart-Meal-Management-System/login.html
```

Example login:

```
Email: admin@gmail.com
Password: admin123
```

---

### 🔐 Generating a bcrypt Password

If you want to create another admin manually, generate a **bcrypt hash** for the password.

You can use these online tools:

- https://bcrypt-generator.com  
- https://www.browserling.com/tools/bcrypt  

Then insert the generated hash into the `users` table.

Example:

```sql
INSERT INTO users (email, password, role, is_approved)
VALUES ('newadmin@email.com', 'BCRYPT_HASH_HERE', 'admin', 1);
```


# ⚙️ Configure Database Connection

Edit:

```
api/config.php
```

Example configuration:

```php
<?php

$host = "localhost";
$db_name = "meal_db";
$username = "root";
$password = "";

try {
 $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
} catch(PDOException $exception){
 echo "Connection error: " . $exception->getMessage();
}

?>
```

---

# 📂 File Upload Permissions

Ensure the uploads directory is writable:

```bash
chmod -R 775 uploads
```

---

# 🚀 Running the Project

Open in browser:

```
http://localhost/Smart-Meal-Management-System
```

Login page:

```
http://localhost/Smart-Meal-Management-System/login.html
```

---

# 🚀 Deployment

To deploy on a VPS:

1. Upload project files
2. Create database `meal_db`
3. Run the SQL queries above
4. Configure `api/config.php`
5. Ensure `uploads/` folder is writable
6. Configure domain or web server

Example server path:

```
/var/www/html/meal
```

---

# 🔐 Security Recommendations

For production:

- Change default DB credentials
- Enable HTTPS
- Restrict CORS
- Disable PHP error display

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Sojol Rana**

🌐 Website  
https://sojolrana.com  

💻 GitHub  
https://github.com/sojolrana