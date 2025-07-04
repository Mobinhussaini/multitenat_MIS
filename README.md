# 🎓 Multitenant MIS – Laravel + React + Inertia.js

A robust **Multitenant Management Information System (MIS)** designed for educational institutions. This system enables centralized management of students, courses, teachers, and enrollments — all scoped per tenant. Built using **Laravel**, **React**, **Inertia.js**, and **Tailwind CSS**.

> 🚀 Open-source and developer-friendly. Clone, modify, and scale it freely for your institution or SaaS idea.

---

## 📚 Features

- ✅ **Multi-Tenancy Support** – Isolated data per tenant
- 👨‍🏫 **Teacher Management** – Add/edit/delete teachers
- 🎓 **Student Management** – Assign grades, view enrollments
- 📘 **Course Management** – Courses linked with teachers
- 📝 **Enrollments** – Assign students to courses with duplication protection
- 🔍 **Column-wise Search** – Filter enrollments by student, course, etc.
- 📄 **Pagination** – Server-side pagination for scalable data
- 🧪 **Demo Seeder** – Generate dummy data for multiple tenants
- 🎨 **Modern UI** – Built with React, Tailwind CSS, and Lucide Icons

---

## 🛠️ Tech Stack

| Layer        | Tech                       |
|--------------|----------------------------|
| Backend      | Laravel 12, Eloquent ORM   |
| Frontend     | React 19, Inertia.js       |
| Styling      | Tailwind CSS               |
| Database     | MySQL (or PostgreSQL)      |
| Auth         | Laravel Breeze (Inertia)   |
| Deployment   | Any VPS (e.g., Contabo)    |

---

## ⚙️ Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Mobinhussaini/multitenat_MIS.git
cd multitenant-mis


2. Install Laravel dependencies:

composer install
cp .env.example .env
php artisan key:generate



3. Configure .env:

Set up your database and mail credentials.

DB_DATABASE=multitenant_mis
DB_USERNAME=root
DB_PASSWORD=secret


4. Run migrations and seed demo data:

php artisan migrate
php artisan db:seed --class=DemoDatabaseSeeder

🔁 The seeder inserts demo teachers, students, courses, and enrollments for tenant_id: 1 and tenant_id: 2.


5. Install front-end dependencies:

npm install
npm run dev



6. Start your Laravel server:

php artisan serve
or composer run dev


👨‍💻 Usage
🧑‍🏫 Teachers
List all teachers per tenant

Assign subjects and courses

🎓 Students
Manage students with grade-level info

Tenant-based isolation of student data

📘 Courses
Courses linked to teachers

Edit and delete functionality included

📝 Enrollments
Add/Edit/Delete student enrollments

Prevents duplicate enrollments in same course

Column-wise search (by student, course, teacher)

Paginated view of enrollments

🔐 Multi-Tenancy Architecture
Each user has a tenant_id

All resources (teachers, students, courses, enrollments) are scoped to this ID

Middleware/auth ensures isolation of data per tenant


🙌 Contribution
Contributions are welcome!

Fork the repo

Create a feature branch

Make your changes

Submit a pull request

📄 License
This project is open-source under the MIT License.

🌐 Credits
Built with ❤️ by Mobin Hussaini

✨ Future Improvements
Role-based permissions

Course schedule/calendar integration

Live notifications

PDF report exports

SaaS-ready registration flow





