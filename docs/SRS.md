# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Project Title

Personal Portfolio Management System

### 1.2 Purpose

The purpose of this project is to develop a full-stack web application that serves as a personal portfolio website and content management system. The platform will allow visitors to view personal information, projects, skills, education, experience, certifications, and blog posts. It will also provide an administrator dashboard for managing portfolio content without modifying source code.

### 1.3 Intended Audience

* Portfolio visitors
* Potential employers
* Recruiters
* Clients
* Project evaluators
* System administrator

### 1.4 Technologies

Frontend:

* React 19
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui

Backend:

* Node.js
* Express.js
* TypeScript
* Prisma ORM

Database:

* PostgreSQL

Storage:

* Local Storage (Development)
* Cloudinary (Production)

---

# 2. Project Scope

The system will provide a modern, responsive, and secure portfolio website where visitors can explore professional information and communicate with the owner. The system will include an administrative dashboard for managing all portfolio content through a graphical interface.

The project aims to demonstrate modern software engineering practices, full-stack web development, database design, API development, authentication, file management, and deployment strategies.

---

# 3. System Overview

The application consists of two major components:

1. Public Website
2. Administrative Dashboard

Visitors can browse portfolio information and submit contact messages.

The administrator can manage all portfolio content through a secured dashboard.

---

# 4. User Roles

## 4.1 Visitor

A visitor can:

* View profile information
* View projects
* View skills
* View education
* View experience
* View certifications
* Read blog posts
* Submit contact messages

## 4.2 Administrator

The administrator can:

* Login securely
* Manage profile information
* Manage projects
* Manage skills
* Manage education
* Manage experience
* Manage certifications
* Manage blog posts
* View contact messages
* Upload images
* Change account password

---

# 5. Functional Requirements

## 5.1 Authentication Module

The system shall allow the administrator to login using email and password.

The system shall generate JWT access and refresh tokens.

The system shall allow secure logout.

The system shall allow password updates.

---

## 5.2 Profile Module

The system shall allow the administrator to:

* Create profile information
* Update profile information
* Upload profile image
* Manage social links

Visitors shall be able to view profile information.

---

## 5.3 Skills Module

The administrator shall be able to:

* Create skills
* Edit skills
* Delete skills

Visitors shall be able to view skills.

---

## 5.4 Projects Module

The administrator shall be able to:

* Create projects
* Edit projects
* Delete projects
* Upload project images
* Mark projects as featured

Visitors shall be able to:

* View project lists
* View project details
* Open GitHub links
* Open live demo links

---

## 5.5 Experience Module

The administrator shall be able to:

* Create experience records
* Edit experience records
* Delete experience records

Visitors shall be able to view experience records.

---

## 5.6 Education Module

The administrator shall be able to:

* Create education records
* Edit education records
* Delete education records

Visitors shall be able to view education records.

---

## 5.7 Certification Module

The administrator shall be able to:

* Create certifications
* Edit certifications
* Delete certifications
* Upload certification images

Visitors shall be able to view certifications.

---

## 5.8 Blog Module

The administrator shall be able to:

* Create blog posts
* Edit blog posts
* Delete blog posts
* Publish or unpublish blog posts

Visitors shall be able to:

* View blog lists
* Read blog details
* Search blog posts

---

## 5.9 Contact Module

Visitors shall be able to:

* Submit contact messages

The administrator shall be able to:

* View messages
* Mark messages as read
* Delete messages

The system shall send email notifications when new messages are received.

---

## 5.10 Media Module

The administrator shall be able to:

* Upload images
* Delete images
* Manage uploaded files

The system shall support:

* Local file storage during development
* Cloudinary storage in production

---

# 6. Non-Functional Requirements

## 6.1 Security

The system shall:

* Use JWT authentication
* Hash passwords using bcrypt
* Validate all inputs
* Use secure HTTP headers
* Apply API rate limiting

## 6.2 Performance

The system shall:

* Load pages quickly
* Optimize image delivery
* Minimize API response time

## 6.3 Reliability

The system shall:

* Handle unexpected errors gracefully
* Maintain database consistency
* Log important system events

## 6.4 Maintainability

The system shall:

* Use TypeScript
* Follow modular architecture
* Maintain clean code practices
* Include documentation

## 6.5 Usability

The system shall:

* Be responsive on mobile devices
* Support desktop devices
* Provide intuitive navigation
* Support dark mode

---

# 7. System Architecture

The system follows a three-tier architecture.

Presentation Layer:

* React Frontend

Application Layer:

* Express Backend API

Data Layer:

* PostgreSQL Database

Communication between frontend and backend shall be performed through RESTful APIs.

---

# 8. Data Requirements

The system shall maintain the following primary entities:

* Admin
* Profile
* Skill
* Project
* ProjectTechnology
* Experience
* Education
* Certification
* Blog
* ContactMessage
* Media

Relationships among these entities shall be defined in the database design document.

---

# 9. Assumptions and Constraints

## Assumptions

* Internet connection is available.
* PostgreSQL database server is available.
* Cloudinary service is available in production.
* Administrator credentials are properly maintained.

## Constraints

* Only one administrator account exists.
* Visitors cannot create accounts.
* The system uses PostgreSQL as the primary database.
* The system uses REST APIs for communication.

---

# 10. Future Enhancements

Potential future enhancements include:

* Multi-administrator support
* Portfolio analytics dashboard
* Project comments
* Newsletter subscription
* Real-time notifications
* Internationalization (i18n)
* AI-powered contact assistant

---

# 11. Conclusion

The Personal Portfolio Management System provides a professional platform for showcasing skills, projects, experience, education, certifications, and technical content while allowing centralized content management through a secure administrative dashboard.
