# API Specification

## 1. Overview

This document defines the REST API endpoints for the Personal Portfolio Management System.

### Base URL

```text
/api/v1
```

### Response Format

Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# 2. Authentication Module

## Login

### POST

```text
/api/v1/auth/login
```

Request

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Response

```json
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

---

## Refresh Token

### POST

```text
/api/v1/auth/refresh
```

Response

```json
{
  "accessToken": "new-access-token"
}
```

---

## Logout

### POST

```text
/api/v1/auth/logout
```

---

## Change Password

### PATCH

```text
/api/v1/auth/change-password
```

Request

```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

---

# 3. Profile Module

## Get Profile

### GET

```text
/api/v1/profile
```

---

## Update Profile

### PUT

```text
/api/v1/profile
```

---

# 4. Skills Module

## Get Skills

### GET

```text
/api/v1/skills
```

---

## Create Skill

### POST

```text
/api/v1/skills
```

---

## Update Skill

### PUT

```text
/api/v1/skills/:id
```

---

## Delete Skill

### DELETE

```text
/api/v1/skills/:id
```

---

# 5. Projects Module

## Get All Projects

### GET

```text
/api/v1/projects
```

Query Parameters

```text
?page=1
&limit=10
&featured=true
```

---

## Get Project By Slug

### GET

```text
/api/v1/projects/:slug
```

---

## Create Project

### POST

```text
/api/v1/projects
```

---

## Update Project

### PUT

```text
/api/v1/projects/:id
```

---

## Delete Project

### DELETE

```text
/api/v1/projects/:id
```

---

# 6. Experience Module

## Get Experiences

### GET

```text
/api/v1/experiences
```

---

## Create Experience

### POST

```text
/api/v1/experiences
```

---

## Update Experience

### PUT

```text
/api/v1/experiences/:id
```

---

## Delete Experience

### DELETE

```text
/api/v1/experiences/:id
```

---

# 7. Education Module

## Get Education Records

### GET

```text
/api/v1/education
```

---

## Create Education

### POST

```text
/api/v1/education
```

---

## Update Education

### PUT

```text
/api/v1/education/:id
```

---

## Delete Education

### DELETE

```text
/api/v1/education/:id
```

---

# 8. Certification Module

## Get Certifications

### GET

```text
/api/v1/certifications
```

---

## Create Certification

### POST

```text
/api/v1/certifications
```

---

## Update Certification

### PUT

```text
/api/v1/certifications/:id
```

---

## Delete Certification

### DELETE

```text
/api/v1/certifications/:id
```

---

# 9. Blog Module

## Get Blogs

### GET

```text
/api/v1/blogs
```

Query Parameters

```text
?page=1
&limit=10
&search=react
```

---

## Get Blog By Slug

### GET

```text
/api/v1/blogs/:slug
```

---

## Create Blog

### POST

```text
/api/v1/blogs
```

---

## Update Blog

### PUT

```text
/api/v1/blogs/:id
```

---

## Delete Blog

### DELETE

```text
/api/v1/blogs/:id
```

---

## Publish Blog

### PATCH

```text
/api/v1/blogs/:id/publish
```

---

## Unpublish Blog

### PATCH

```text
/api/v1/blogs/:id/unpublish
```

---

# 10. Contact Message Module

## Send Contact Message

### POST

```text
/api/v1/messages
```

Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Portfolio Inquiry",
  "message": "Hello Ahmed"
}
```

---

## Get Messages

### GET

```text
/api/v1/messages
```

---

## Mark As Read

### PATCH

```text
/api/v1/messages/:id/read
```

---

## Delete Message

### DELETE

```text
/api/v1/messages/:id
```

---

# 11. Media Module

## Upload File

### POST

```text
/api/v1/uploads
```

Content Type

```text
multipart/form-data
```

---

## Delete File

### DELETE

```text
/api/v1/uploads/:id
```

---

# 12. Health Check

## Health Endpoint

### GET

```text
/api/v1/health
```

Response

```json
{
  "status": "ok"
}
```

---

# 13. Protected Routes

The following routes require authentication:

* Profile Update
* Skill Create
* Skill Update
* Skill Delete
* Project Create
* Project Update
* Project Delete
* Experience Create
* Experience Update
* Experience Delete
* Education Create
* Education Update
* Education Delete
* Certification Create
* Certification Update
* Certification Delete
* Blog Create
* Blog Update
* Blog Delete
* Blog Publish
* Message Management
* Media Upload
* Media Delete

---

# 14. API Versioning

Current Version:

```text
v1
```

Base Path:

```text
/api/v1
```

Future versions:

```text
/api/v2
/api/v3
```
