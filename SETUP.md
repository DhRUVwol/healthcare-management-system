# 🚀 Quick Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB database
- Git

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <your-github-repo-url>
   cd healthcare-management-system
   ```

2. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

3. **Environment Setup**:
   
   Create `.env.local` in `patient-portal/`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/healthcare_db
   JWT_SECRET=your_super_secret_jwt_key_here
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:8000
   ```
   
   Create `.env.local` in `doctor-portal/`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/healthcare_db
   JWT_SECRET=your_super_secret_jwt_key_here
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start both applications**:
   ```bash
   npm run dev
   ```

## 🌐 Access Points
- **Patient Portal**: http://localhost:8000
- **Doctor Portal**: http://localhost:3000

## 🔧 Individual Portal Setup

### Patient Portal Only
```bash
cd patient-portal
npm install
npm run dev
```

### Doctor Portal Only
```bash
cd doctor-portal
npm install
npm run dev
```

## 📝 Next Steps
1. Set up your MongoDB database
2. Create admin user for doctor approvals
3. Test patient registration and login
4. Test doctor registration and approval process

## 🆘 Need Help?
- Check the main README.md for detailed documentation
- Review individual portal README files
- Ensure MongoDB is running
- Verify all environment variables are set correctly