## Overview and motivation

Inventory App is a simple web app that allows one to register and manage their belongings.  
A practice project to get a feel of how SSR works. Also tinkering around with other interesting technologies.

Current goal is to create 2 separate directories containing an identical app feature-wise. One would be based off of Nextjs pages router, and ther other, app router. So far only the pages router side is implemented.

## Tech stack

- Nextjs - frontend and API
- Material UI - out of the box ui components
- Tailwind - css framework
- Zod - validation and type generation
- Redux - frontend storage management
- Firestore - persistent storage
- Firebase Auth - user authentication and management
- Github Actions - CI/CD
- Amazon ECR - container registry
- App Runner - hosting containerized app

## Testing out the app locally

#### Prerequisites

- nodejs >= 18
- docker
- setup firestore
- setup firebase auth
- clone this repo to your PC

#### Instructions

1. `cd` into directory `inventory_management_pages`
2. Install dependencies by the command `npm install`
3. Copy the file `.env.local.example` in place and rename it `.env.local`
4. Populate the file `.env.local` appropriately with firebase credentials and other values
   - Note that value of `FIREBASE_PRIVATE_KEY_BASE64` should be firebase admin private key encoded in base64. It is encoded to avoid having to deal with newline characters that are in the original value.
5. `cd` back up to the parent directory and start up the app by the command `docker compose up -d`
6. Open the browser and go to URL `http://localhost:8080`
7. Once you are done, stop the app by the command `docker compose down`
