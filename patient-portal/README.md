# Patient Portal - Healthcare Management System

The patient-facing application of the Healthcare Management System, built with Next.js 15 and React 19.

## 🏥 Features

- **Patient Registration & Authentication**: Secure signup and login system
- **Appointment Management**: Book, view, and manage appointments with doctors
- **Doctor Discovery**: Search and browse available doctors by specialty
- **Prescription Management**: View and track medical prescriptions
- **Medical Reports**: Access and download medical reports
- **AI Chatbot**: Get instant medical assistance and information
- **Profile Management**: Update personal information and medical history

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:8000
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:8000](http://localhost:8000) in your browser

## 📁 Project Structure

```
patient-portal/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── patient/           # Patient-specific pages
│   ├── doctor/            # Doctor registration pages
│   ├── admin/             # Admin pages
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── providers/        # Context providers
├── lib/                  # Utility libraries
├── models/               # MongoDB models
├── utils/                # Helper functions
└── public/               # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server on port 8000 with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 🌐 Key Pages & Routes

### Patient Routes
- `/patient/login` - Patient login
- `/patient/signup` - Patient registration
- `/patient/dashboard` - Patient dashboard
- `/patient/appointments` - Appointment management
- `/patient/doctors` - Doctor search and selection
- `/patient/prescriptions` - Prescription viewing
- `/patient/profile` - Profile management
- `/patient/chatbot` - AI assistant

### Doctor Routes
- `/doctor/login` - Doctor login
- `/doctor/signup` - Doctor registration

### Admin Routes
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login-patient` - Patient login
- `POST /api/auth/register` - Patient registration
- `POST /api/auth/login` - Doctor login
- `POST /api/auth/signup` - Doctor registration

### Patient Management
- `GET /api/patients/me` - Get current patient info
- `PUT /api/patients/[patientId]` - Update patient info
- `GET /api/patients` - Get all patients (admin)

### Doctor Management
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/[doctorId]` - Get specific doctor
- `POST /api/approve-doctor` - Approve doctor registration

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments` - Update appointment
- `DELETE /api/appointments` - Cancel appointment

### Prescriptions
- `GET /api/prescriptions` - Get prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/[id]` - Get specific prescription

### Reports
- `GET /api/reports` - Get medical reports
- `POST /api/reports` - Upload medical report

## 🎨 UI Components

Built with modern UI components using:
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Custom Components**: Specialized healthcare UI elements

### Key Components
- `DashboardLayout`: Main layout wrapper
- `PrescriptionModal`: Prescription viewing modal
- `PrescriptionForm`: Prescription creation form
- `Chatbot`: AI assistant interface
- Various UI components (Button, Card, Dialog, etc.)

## 🔐 Authentication & Security

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for password security
- **Session Management**: NextAuth.js integration
- **Role-based Access**: Patient/Doctor/Admin roles
- **Protected Routes**: Middleware for route protection

## 🗄️ Database Models

### Patient Model
```javascript
{
  name: String,
  email: String,
  password: String,
  phone: String,
  dateOfBirth: Date,
  gender: String,
  address: String,
  medicalHistory: String,
  emergencyContact: Object
}
```

### Appointment Model
```javascript
{
  patient: ObjectId,
  doctor: ObjectId,
  date: Date,
  time: String,
  status: String,
  reason: String,
  notes: String
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Ensure these are set in your deployment platform:
- `MONGODB_URI`
- `JWT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 🔧 Development Tips

1. **Hot Reload**: Uses Turbopack for fast development
2. **API Testing**: Use tools like Postman or Thunder Client
3. **Database**: MongoDB Compass for database management
4. **Debugging**: Next.js built-in debugging tools

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for new components (if migrating)
3. Ensure responsive design for all components
4. Add proper error handling
5. Write meaningful commit messages

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure MongoDB is running and connection string is correct
2. **Port Conflicts**: Default port is 8000, change in package.json if needed
3. **Environment Variables**: Double-check all required env vars are set
4. **Dependencies**: Run `npm install` if facing module errors

### Debug Mode
```bash
DEBUG=* npm run dev
```

## 📞 Support

For issues specific to the Patient Portal:
- Check the console for error messages
- Verify API endpoints are responding
- Ensure database connectivity
- Review authentication flow