## Assignment - Cloud App Development

__Name:__ Sicheng Mu

---

## Overview

This project implements a secure serverless Web API for managing movie cast information using AWS services.  
The application supports retrieving actor details, movie information, and roles, as well as adding new roles.

---

## Links

__Demo:__ https://www.youtube.com/watch?v=tsUJskz7zMw

---

## Screenshots

### API Gateway

![][api]

### DynamoDB

![][db]

---

## Design Features

### API Design
The application uses a RESTful API built with Amazon API Gateway.

Implemented endpoints:
- GET /actors/{actorID}
- GET /movies/{movieID}
- GET /movies/{movieID}/role
- POST /movies/role

The POST endpoint is protected using an API key.

---

### Lambda Functions
Each API endpoint is backed by a dedicated AWS Lambda function.

Responsibilities include:
- Handling incoming requests
- Validating input
- Interacting with DynamoDB
- Formatting responses

AWS SDK v3 is used for all database operations.

---

### DynamoDB Design (Single-table)
A single-table design is used to model a many-to-many relationship between movies and actors.

| Entity | PK | SK |
|--------|----|----|
| Movie  | m#movieID | m#movieID |
| Actor  | a#actorID | a#actorID |
| Role   | m#movieID | a#actorID |

This structure supports:
- Retrieving actor details
- Retrieving movie details
- Querying all roles in a movie
- Filtering roles by actor

---

### Query Features
- Retrieve all roles for a movie
- Optional filtering by actorID using query parameters
- Efficient querying using partition keys

---

### Translation Feature
The API supports translation of:
- Actor biography
- Role description

This is implemented using Amazon Translate.  
The target language is provided via query parameters.

---

## Extra Features

### API Security
- POST /movies/role requires an API key
- Usage plan and throttling are configured

---

### Full Stack Integration
A React frontend is used to interact with the API.

Implemented features:
- Actor search with optional translation
- Display of movie roles
- Add new role using POST request

---

### Deployment
The backend is deployed using AWS CDK.

Resources include:
- DynamoDB table
- Lambda functions
- API Gateway configuration

---

## Notes

Route53 is not used in this project.

---

## AI Declaration

1. AI tools were used during development primarily for debugging and resolving integration issues between the React frontend and the serverless API. 
2. AI tools were used to write readme file.
---
[api]: ./images/api.png
[db]: ./images/db.png
