# DreamWay – Study Abroad Assistance Portal

DreamWay is a secure, full-stack web platform designed to simplify the study abroad application process. It connects students with consultants through real-time communication while enforcing strict access control and data privacy.

## 🚀 Tech Stack

### Frontend
- Next.js  
- TypeScript  
- Tailwind CSS  

### Backend
- Nest.js  
- PostgreSQL  
- TypeORM  

### Security & Validation
- JWT Authentication  
- Role-Based Access Control (RBAC)  
- Zod (Schema Validation)  

### Real-time & Services
- Pusher (WebSockets)  
- Nodemailer (Transactional Emails)  

## ✨ Key Features
- Role-based authentication for Students, Consultants, and Admins  
- Strict runtime input validation using Zod  
- Real-time application status updates and notifications  
- Automated transactional emails for registration and status changes  

## 🛠️ Setup

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Configure environment variables
# Add database credentials and API keys in .env

# Start development server
npm run start:dev
