# TRACE Mock Backend

Tracking and Criminal Evidence Platform (TRACE) mock backend for simulating API endpoints without MongoDB. This server provides dummy data for testing suspect management, OSINT profiling, report generation, Telegram bot interactions, legal assistance, and officer authentication functionalities.

## Table of Contents
- [Overview](#overview)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
    - [POST /auth/login](#post-authlogin)
    - [POST /auth/register](#post-authregister)
  - [Suspect Management](#suspect-management)
    - [GET /suspects](#get-suspects)
    - [GET /suspects/:id](#get-suspectsid)
    - [POST /suspects](#post-suspects)
  - [OSINT Profile](#osint-profile)
    - [POST /osint/profile](#post-osintprofile)
  - [Report Generation](#report-generation)
    - [POST /reports/generate](#post-reportsgenerate)
  - [Telegram Bot](#telegram-bot)
    - [POST /bot/start](#post-botstart)
    - [GET /bot/conversation/:botId](#get-botconversationbotid)
    - [DELETE /bot/:botId](#delete-botbotid)
  - [Legal Assistant](#legal-assistant)
    - [POST /legal/assist](#post-legalassist)
    - [POST /legal/fir](#post-legalfir)
- [Authentication](#authentication)
- [License](#license)

## Overview

This mock backend simulates the TRACE platform's API for Indian police officers to track drug trafficking activities. It uses Express.js and provides hardcoded responses for testing without requiring a database. All endpoints (except `/auth/login`) are protected with JWT-based authentication and role-based access control (`admin`, `inspector`, `analyst`).

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm
- Postman or `curl` for testing APIs

### Installation
1. **Clone or Create Project Directory**:
   ```bash
   mkdir trace-mock-backend
   cd trace-mock-backend
   ```

2. **Initialize Node.js Project**:
   ```bash
   npm init -y
   ```

3. **Install Dependencies**:
   ```bash
   npm install express jsonwebtoken bcrypt
   ```

4. **Add `server.js`**:
   Copy the `server.js` file into the `trace-mock-backend` directory.

5. **Start the Server**:
   ```bash
   node server.js
   ```
   The server runs on `http://localhost:3000`.

6. **Start a Dummy Server**:
  ```bash
   node dummy_server.js
   ```
   The dummy server runs on `http://localhost:3000`.
### Authentication Setup
All endpoints (except `/auth/login`) require a JWT token in the `Authorization` header and an `X-TRACE-OFFICER-ID` header. To generate a JWT token, first use the login endpoint or create one manually for testing:
```javascript
const jwt = require('jsonwebtoken');
console.log(jwt.sign({ id: 'officer_293' }, 'mock_jwt_secret'));
```
- Use `officer_293` (inspector), `officer_294` (admin), or `officer_295` (analyst) as the `id`.
- Copy the generated token and include it in requests:
  ```
  Authorization: Bearer <your-jwt-token>
  X-TRACE-OFFICER-ID: officer_293
  ```

### Git Setup
To version control the project:
1. Create a `.gitignore` file:
   ```gitignore
   node_modules/
   npm-debug.log
   .env
   error.log
   combined.log
   reports/
   .DS_Store
   *.swp
   *.swo
   .idea/
   *.code-workspace
   dist/
   build/
   coverage/
   ```
2. Initialize and push to Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: TRACE mock backend with authentication"
   git remote add origin https://github.com/your-username/trace-mock-backend.git
   git push -u origin main
   ```

## API Endpoints

### Authentication Endpoints

#### POST /auth/login
**Purpose**: Authenticate an officer and return a JWT token.  
**Roles**: None (public endpoint)  
**Example Request**:
```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"email":"joshi@trace.in","password":"securepassword123"}' \
     http://localhost:3000/auth/login
```
**Example Response**:
```json
{
  "token": "<jwt-token>",
  "officer": {
    "id": "officer_293",
    "name": "Inspector R. Joshi",
    "role": "inspector",
    "email": "joshi@trace.in"
  }
}
```

#### POST /auth/register
**Purpose**: Register a new officer (admin only).  
**Roles**: `admin`  
**Example Request**:
```bash
curl -X POST -H "Authorization: Bearer <your-jwt-token>" \
     -H "X-TRACE-OFFICER-ID: officer_294" \
     -H "Content-Type: application/json" \
     -d '{"name":"S. Gupta","badgeId":"B12345","role":"analyst","email":"gupta@trace.in","password":"securepassword123"}' \
     http://localhost:3000/auth/register
```
**Example Response**:
```json
{
  "token": "<jwt-token>",
  "officer": {
    "id": "officer_295",
    "name": "S. Gupta",
    "role": "analyst",
    "email": "gupta@trace.in"
  }
}
```

### Suspect Management

#### GET /suspects
**Purpose**: List suspects with pagination, filtering, and sorting.  
**Roles**: `admin`, `inspector`, `analyst`  
**Example Request**:
```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
     -H "X-TRACE-OFFICER-ID: officer_293" \
     http://localhost:3000/suspects?page=1&limit=20&riskLevel=high&platform=telegram
```
**Example Response**:
```json
{
  "data": [
    {
      "id": "sus123",
      "name": "Ajay Singh",
      "aliases": ["@rajx", "Aj_S"],
      "riskScore": 87,
      "platforms": ["telegram", "instagram"],
      "lastSeen": "2025-07-03T21:20:00Z",
      "status": "active"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

#### GET /suspects/:id
**Purpose**: Get detailed suspect information.  
**Roles**: `admin`, `inspector`, `analyst`  
**Example Request**:
```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
     -H "X-TRACE-OFFICER-ID: officer_293" \
     http://localhost:3000/suspects/sus123
```
**Example Response**:
```json
{
  "id": "sus123",
  "name": "Ajay Singh",
  "dob": "1999-08-12T00:00:00.000Z",
  "aliases": ["@rajx", "Aj_S"],
  "phone": "+919876543210",
  "platforms": ["telegram", "instagram"],
  "groupMemberships": ["Group A", "DarkBazaar"],
  "messageSummary": {
    "totalMessages": 1,
    "suspiciousMessages": 1
  },
  "riskScore": 87,
  "locationHistory": ["Mumbai", "Navi Mumbai"],
  "mediaLinks": [
    { "type": "image", "url": "https://cdn.trace/suspects/sus123/img1.jpg" }
  ]
}
```

#### POST /suspects
**Purpose**: Add a new suspect.  
**Roles**: `admin`, `inspector`  
**Example Request**:
```bash
curl -X POST -H "Authorization: Bearer <your-jwt-token>" \
     -H "X-TRACE-OFFICER-ID: officer_293" \
     -H "Content-Type: application/json" \
     -d '{"name":"Ajay Singh","platform":"telegram","username":"@rajx","aliases":["Aj_S"],"phone":"+919876543210"}' \
     http://localhost:3000/suspects
```
**Example Response**:
```json
{
  "id": "sus4567",
  "message": "Suspect created successfully"
}
```

### OSINT Profile

#### POST /osint/profile
**Purpose**: Generate an OSINT profile for a username or phone number.  
**Roles**: `admin`, `inspector`, `analyst`  
**Example Request**:
```bash
curl -X POST -H "Authorization: Bearer <your-jwt-token>" \
     -H "X-TRACE-OFFICER-ID: officer_293" \
     -H "Content-Type: application/json" \
     -d '{"query":"@rajx","platforms":["telegram","instagram"]}' \
     http://localhost:3000/osint/profile
```
**Example Response**:
```json
{
  "summary": "User '@rajx' active in 3 groups linked to drug slang...",
  "relatedProfiles": ["Aj_S", "@r4jj"],
  "extractedEntities": {
    "locations": ["Mumbai", "Borivali"],
    "contacts": ["@dealer_x", "@buyer123"]
  },
  "riskScore": 78,
  "recommendation": "Flag for deeper investigation"
}
```

### Report Generation

#### POST /reports/generate
**Purpose**: Generate a case report for a suspect.  
**Roles**: `admin`, `inspector`  
**Example Request**:
```bash
curl -X POST -H "Authorization: Bearer <your-jwt-token>" \
     -H "X-TRACE-OFFICER-ID: officer_293" \
     -H "Content-Type: application/json" \
     -d '{"suspectId":"sus123","includeMessages":true,"includeLegalSections":true,"format":"pdf"}' \
     http://localhost:3000/reports/generate
```
**Example Response**:
```json
{
  "reportUrl": "https://trace.ai/reports/sus123_case_2025-07-06.pdf",
  "generatedAt": "2025-07-06T01:02:00.000Z"
}
```

### Telegram Bot

#### POST /bot/start
**Purpose**: Start a Telegram bot conversation with a suspect.  
**Roles**: `admin`, `inspector`  
**Example Request**:
```bash
curl -X POST -H "Authorization: Bearer <your-jwt-token>" \
     -H "X-TRACE-OFFICER-ID: officer_293" \
     -H "Content-Type: application/json" \
     -d '{"suspectId":"sus123","initialPrompt":"Hi, is this Raj from Borivali?","persona":"college buyer","maxTurns":10}' \
     http://localhost:3000/bot/start
```
**Example Response**:
```json
{
  "botId": "bot7890",
  "status": "started",
  "startTime": "2025-07-06T01:02:00.000Z"
}
```

#### GET /bot/conversation/:botId
**Purpose**: Fetch a bot-suspect conversation.  
**Roles**: `admin`, `inspector`, `analyst`  
**Example Request**:
```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
     -H "X-TRACE-OFFICER-ID: officer_293" \
     http://localhost:3000/bot/conversation/bot456
```
**Example Response**:
```json
{
  "botId": "bot456",
  "conversation": [
    {
      "from": "bot",
      "text": "Hi, is this Raj from Borivali?",
      "timestamp": "2025-07-04T22:00:00.000Z"
    },
    {
      "from": "suspect",
      "text": "Who's asking?",
      "timestamp": "2025-07-04T22:01:00.000Z"
    },
    {
      "from": "bot",
      "text": "Need some stuff for party night.",
      "timestamp": "2025-07-04T22:02:00.000Z"
    }
  ],
  "flaggedTurns": [
    {
      "turnIndex": 3,
      "reason": "Potential drug inquiry"
    }
  ]
}
```

#### DELETE /bot/:botId
**Purpose**: Stop a bot session.  
**Roles**: `admin`, `inspector`  
**Example Request**:
```bash
curl -X DELETE -H "Authorization: Bearer <your-jwt-token>" \
     -H "X-TRACE-OFFICER-ID: officer_293" \
     http://localhost:3000/bot/bot456
```
**Example Response**:
```json
{
  "message": "Bot session stopped"
}
```

### Legal Assistant

#### POST /legal/assist
**Purpose**: Suggest IPC/NDPS sections and generate a draft summary.  
**Roles**: `admin`, `inspector`  
**Example Request**:
```bash
curl -X POST -H "Authorization: Bearer <your-jwt-token>" \
     -H "X-TRACE-OFFICER-ID: officer_293" \
     -H "Content-Type: application/json" \
     -d '{"description":"Suspect was caught with 30g MDMA near railway station, said he was selling it.","includeDraft":true}' \
     http://localhost:3000/legal/assist
```
**Example Response**:
```json
{
  "suggestedSections": [
    {
      "code": "NDPS 21",
      "description": "Punishment for possession of manufactured drugs"
    },
    {
      "code": "NDPS 22",
      "description": "Punishment for sale of synthetic drugs"
    }
  ],
  "draftSummary": "Draft based on: Suspect was caught with 30g MDMA near railway station, said he was selling it."
}
```

#### POST /legal/fir
**Purpose**: Generate a draft FIR document.  
**Roles**: `admin`, `inspector`  
**Example Request**:
```bash
curl -X POST -H "Authorization: Bearer <your-jwt-token>" \
     -H "X-TRACE-OFFICER-ID: officer_293" \
     -H "Content-Type: application/json" \
     -d '{"suspectId":"sus123","incidentDate":"2025-07-03","location":"Borivali Station","evidence":["photo","message_log"],"officerName":"Inspector R. Joshi"}' \
     http://localhost:3000/legal/fir
```
**Example Response**:
```json
{
  "firDocument": "https://trace.ai/fir/draft_fir_sus123.pdf",
  "status": "generated"
}
```

## Authentication

All endpoints (except `/auth/login`) require:
- **Authorization Header**: `Bearer <your-jwt-token>`
- **X-TRACE-OFFICER-ID Header**: e.g., `officer_293`
- Generate a token using the `/auth/login` endpoint or manually:
  ```javascript
  const jwt = require('javascript');
  console.log(jwt.sign({ id: 'officer_293' }, 'mock_jwt_secret'));
  ```
- Supported officer IDs and roles:
  - `officer_293`: `inspector` (email: `joshi@trace.in`, password: `securepassword123`)
  - `officer_294`: `admin` (email: `sharma@trace.in`, password: `securepassword123`)
  - `officer_295`: `analyst` (email: `gupta@trace.in`, password: `securepassword123`)