# Entity Relationship Design (ERD)

## 1. Purpose

This document defines the database entities, attributes, primary keys, foreign keys, and relationships for the Personal Portfolio Management System.

The database will use PostgreSQL and Prisma ORM.

---

# 2. Entities

## 2.1 Admin

Stores administrator authentication information.

| Field     | Type     | Constraints |
| --------- | -------- | ----------- |
| id        | UUID     | Primary Key |
| email     | String   | Unique      |
| password  | String   | Required    |
| createdAt | DateTime | Required    |
| updatedAt | DateTime | Required    |

---

## 2.2 Profile

Stores personal profile information.

| Field          | Type     | Constraints |
| -------------- | -------- | ----------- |
| id             | UUID     | Primary Key |
| fullName       | String   | Required    |
| title          | String   | Required    |
| bio            | Text     | Required    |
| location       | String   | Optional    |
| email          | String   | Required    |
| phone          | String   | Optional    |
| githubUrl      | String   | Optional    |
| linkedinUrl    | String   | Optional    |
| telegramUrl    | String   | Optional    |
| resumeUrl      | String   | Optional    |
| profileImageId | UUID     | Foreign Key |
| createdAt      | DateTime | Required    |
| updatedAt      | DateTime | Required    |

---

## 2.3 Skill

Stores technical and professional skills.

| Field     | Type     | Constraints |
| --------- | -------- | ----------- |
| id        | UUID     | Primary Key |
| name      | String   | Unique      |
| category  | String   | Required    |
| level     | Integer  | Required    |
| icon      | String   | Optional    |
| createdAt | DateTime | Required    |
| updatedAt | DateTime | Required    |

---

## 2.4 Project

Stores portfolio projects.

| Field       | Type     | Constraints   |
| ----------- | -------- | ------------- |
| id          | UUID     | Primary Key   |
| title       | String   | Required      |
| slug        | String   | Unique        |
| description | Text     | Required      |
| githubUrl   | String   | Optional      |
| liveUrl     | String   | Optional      |
| featured    | Boolean  | Default False |
| thumbnailId | UUID     | Foreign Key   |
| createdAt   | DateTime | Required      |
| updatedAt   | DateTime | Required      |

---

## 2.5 ProjectTechnology

Junction table between Project and Skill.

| Field     | Type | Constraints |
| --------- | ---- | ----------- |
| projectId | UUID | Foreign Key |
| skillId   | UUID | Foreign Key |

Composite Primary Key:

(projectId, skillId)

---

## 2.6 Experience

Stores work and internship experiences.

| Field       | Type     | Constraints   |
| ----------- | -------- | ------------- |
| id          | UUID     | Primary Key   |
| company     | String   | Required      |
| position    | String   | Required      |
| description | Text     | Required      |
| startDate   | Date     | Required      |
| endDate     | Date     | Optional      |
| isCurrent   | Boolean  | Default False |
| createdAt   | DateTime | Required      |
| updatedAt   | DateTime | Required      |

---

## 2.7 Education

Stores academic information.

| Field        | Type     | Constraints |
| ------------ | -------- | ----------- |
| id           | UUID     | Primary Key |
| institution  | String   | Required    |
| degree       | String   | Required    |
| fieldOfStudy | String   | Required    |
| startDate    | Date     | Required    |
| endDate      | Date     | Optional    |
| description  | Text     | Optional    |
| createdAt    | DateTime | Required    |
| updatedAt    | DateTime | Required    |

---

## 2.8 Certification

Stores certifications.

| Field         | Type     | Constraints |
| ------------- | -------- | ----------- |
| id            | UUID     | Primary Key |
| title         | String   | Required    |
| issuer        | String   | Required    |
| issueDate     | Date     | Required    |
| credentialUrl | String   | Optional    |
| imageId       | UUID     | Foreign Key |
| createdAt     | DateTime | Required    |
| updatedAt     | DateTime | Required    |

---

## 2.9 Blog

Stores blog articles.

| Field       | Type     | Constraints   |
| ----------- | -------- | ------------- |
| id          | UUID     | Primary Key   |
| title       | String   | Required      |
| slug        | String   | Unique        |
| excerpt     | Text     | Required      |
| content     | Text     | Required      |
| published   | Boolean  | Default False |
| thumbnailId | UUID     | Foreign Key   |
| createdAt   | DateTime | Required      |
| updatedAt   | DateTime | Required      |

---

## 2.10 ContactMessage

Stores visitor messages.

| Field     | Type     | Constraints   |
| --------- | -------- | ------------- |
| id        | UUID     | Primary Key   |
| name      | String   | Required      |
| email     | String   | Required      |
| subject   | String   | Required      |
| message   | Text     | Required      |
| isRead    | Boolean  | Default False |
| createdAt | DateTime | Required      |

---

## 2.11 Media

Stores uploaded media information.

| Field     | Type     | Constraints |
| --------- | -------- | ----------- |
| id        | UUID     | Primary Key |
| publicId  | String   | Optional    |
| url       | String   | Required    |
| altText   | String   | Optional    |
| mimeType  | String   | Required    |
| size      | Integer  | Required    |
| provider  | Enum     | Required    |
| createdAt | DateTime | Required    |
| updatedAt | DateTime | Required    |

---

# 3. Enum Definitions

## MediaProvider

```text
LOCAL
CLOUDINARY
```

---

# 4. Relationships

## One-to-One

Profile → Media

```text
Profile.profileImageId
    references
Media.id
```

---

## One-to-One

Project → Media

```text
Project.thumbnailId
    references
Media.id
```

---

## One-to-One

Blog → Media

```text
Blog.thumbnailId
    references
Media.id
```

---

## One-to-One

Certification → Media

```text
Certification.imageId
    references
Media.id
```

---

## Many-to-Many

Project ↔ Skill

Implemented using ProjectTechnology table.

```text
Project
   │
   ├── ProjectTechnology
   │
Skill
```

---

# 5. ERD Diagram

```text
Admin

Profile -------- Media

Project -------- Media

Blog ----------- Media

Certification -- Media

Project
   │
   │
ProjectTechnology
   │
   │
Skill

Experience

Education

ContactMessage
```

---

# 6. Indexing Strategy

Create indexes for:

* Project.slug
* Blog.slug
* Skill.name
* ContactMessage.createdAt
* Experience.startDate
* Education.startDate

These indexes improve query performance and search efficiency.

---

# 7. Database Design Notes

* UUIDs will be used as primary keys.
* Soft deletes are not required in Version 1.
* PostgreSQL will be the primary database.
* Prisma ORM will manage migrations.
* Media records support both local and Cloudinary storage.
* Only one administrator account is supported.
