# Cloud App Assignment – Movie API

## 📌 Overview

This project implements a serverless RESTful API using AWS services to manage movie, actor, and role data.

The system allows clients to:
- Retrieve movie details
- Retrieve roles for a specific movie
- Retrieve actor details
- Retrieve an actor’s role within a specific movie

The application is built using:
- AWS Lambda (Node.js / TypeScript)
- Amazon API Gateway
- Amazon DynamoDB (Single Table Design)
- AWS CDK (Infrastructure as Code)

---

## 🏗️ Architecture

The system follows a serverless architecture:

Client → API Gateway → Lambda → DynamoDB

### Components

- **API Gateway**  
  Handles HTTP requests and routes them to Lambda functions.

- **Lambda Functions**  
  Contain business logic and data transformation.

- **DynamoDB**  
  Stores all entities (movies, actors, roles) in a single table.

- **AWS CDK**  
  Used to define and deploy all infrastructure.

---

## 🗄️ Data Model

A **single-table design** is used in DynamoDB.

### Primary Keys

- PK (Partition Key)
- SK (Sort Key)

### Entity Structure

| Entity | PK | SK |
|------|----|----|
| Movie | m#movieID | m#movieID |
| Actor | a#actorID | a#actorID |
| Role  | m#movieID | a#actorID |

---

### Explanation

- Movie:
  PK = m#1, SK = m#1

- Actor:
  PK = a#1, SK = a#1

- Role:
  PK = m#1, SK = a#1

This design allows:
- Efficient queries by movie
- Direct lookup of actor-role relationships
- No need for joins

---

## 🔗 API Endpoints

### 1. Get Movie

GET /movies/{movieID}

Response:
{
  "data": {
    "title": "The Shawshank Redemption",
    "overview": "...",
    "releaseDate": "1994-09-23"
  }
}

---

### 2. Get Roles for a Movie

GET /movies/{movieID}/role

Response:
{
  "data": [
    {
      "roleName": "Red",
      "roleDescription": "..."
    }
  ]
}

---

### 3. Get Actor

GET /actors/{actorID}

Response:
{
  "data": {
    "name": "Morgan Freeman",
    "bio": "...",
    "dob": "1937-06-01"
  }
}

---

### 4. Get Actor + Role in a Movie

GET /actors/{actorID}?movie={movieID}

Response:
{
  "data": {
    "actor": {
      "name": "...",
      "bio": "...",
      "dob": "..."
    },
    "role": {
      "roleName": "...",
      "roleDescription": "..."
    }
  }
}

---

## ⚙️ Key Design Decisions

### 1. Single Table Design

All data is stored in a single DynamoDB table.

Benefits:
- Eliminates joins
- Improves performance
- Supports flexible access patterns

---

### 2. Query + Get Pattern

- Query is used for retrieving collections (e.g., roles)
- GetItem is used for direct lookup (e.g., movie or role)

---

### 3. API Response Abstraction

The API does not expose internal fields like PK and SK.

Instead, all responses follow:

{
  "data": ...
}

Benefits:
- Cleaner API design
- Better separation of concerns
- Improved usability

---

### 4. Optional Query Parameter

The endpoint:

GET /actors/{actorID}?movie={movieID}

Allows:
- Actor-only retrieval
- Actor + role retrieval

This simulates a relational join in a NoSQL system.

---

## 🚀 Deployment

npm install  
npx aws-cdk deploy  

---

## 📊 Summary

This project demonstrates:

- Serverless application development
- DynamoDB single-table modelling
- Efficient query patterns
- Clean API design
- Infrastructure as Code using CDK
