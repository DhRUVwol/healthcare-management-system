# Doctor Portal - Healthcare Management System

The healthcare provider-facing application of the Healthcare Management System, built with Next.js 15 and React 19.

## 🏥 Features

- **Doctor Authentication**: Secure login system for healthcare providers
- **Patient Management**: View and manage patient information
- **Appointment Scheduling**: Manage appointments with patients
- **Prescription Management**: Create, view, and manage prescriptions
- **Medical Report Upload**: Upload and manage patient medical reports
- **Real-time Chat**: Communicate with patients via Server-Sent Events
- **AI Assistant**: Get medical assistance and drug interaction checks
- **Admin Dashboard**: Approve new doctor registrations
- **Profile Management**: Update doctor credentials and information

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
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
doctor-portal/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── doctor/            # Doctor-specific pages
│   ├── admin/             # Admin pages
│   ├── patient/           # Patient-related pages
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── models/               # MongoDB models
├── scripts/              # Build and utility scripts
├── src/                  # Additional source files
└── public/               # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server on port 3000 with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 🌐 Key Pages & Routes

### Doctor Routes
- `/doctor/login` - Doctor login
- `/doctor/dashboard` - Doctor dashboard
- `/doctor/appointments` - Appointment management
- `/doctor/prescriptions` - Prescription management
- `/doctor/reports` - Medical report viewing
- `/doctor/uploadreport` - Upload medical reports
- `/doctor/profile` - Profile management
- `/doctor/chat` - Real-time patient communication
- `/doctor/ai-assistant` - AI medical assistant

### Admin Routes
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard for doctor approval

### Patient Routes
- `/patient/uploadreport` - Patient report upload

## 🔌 API Endpoints

### Authentication
- `POST /api/doctor/login` - Doctor login
- `POST /api/auth/login-admin` - Admin login
- `GET /api/doctor/me` - Get current doctor info
- `PUT /api/doctor/profile` - Update doctor profile

### Doctor Management
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/[id]` - Get specific doctor
- `GET /api/doctors/for-admin` - Get doctors for admin approval
- `POST /api/doctors/accept/[id]` - Approve doctor
- `POST /api/doctors/reject/[id]` - Reject doctor

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments` - Update appointment

### Prescriptions
- `GET /api/prescriptions` - Get prescriptions
- `POST /api/prescriptions` - Create prescription

### Reports
- `GET /api/reports` - Get medical reports
- `POST /api/reports` - Create medical report
- `POST /api/upload-report` - Upload report files

### Real-time Communication
- `GET /api/chat` - Chat message handling
- `GET /api/socket` - Server-Sent Events endpoint

## 🎨 UI Components & Features

### Advanced UI Components
- **Toast Notifications**: Real-time feedback system
- **Alert Dialogs**: Confirmation and warning dialogs
- **Theme Provider**: Dark/light mode support
- **Mobile Responsive**: Optimized for all devices
- **Loading States**: Skeleton loaders and spinners

### Key Components
- `DashboardLayout`: Main layout with navigation
- `PrescriptionForm`: Advanced prescription creation
- `PrescriptionModal`: Detailed prescription viewing
- `AlertDialog`: Confirmation dialogs
- `Toast`: Notification system
- `ThemeProvider`: Theme management

## 🔐 Authentication & Security

- **NextAuth.js**: Complete authentication solution
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access**: Doctor/Admin role management
- **Session Management**: Persistent login sessions
- **Protected Routes**: Middleware for route protection

## 🗄️ Database Models

### Doctor Model
```javascript
{
  name: String,
  email: String,
  password: String,
  phone: String,
  specialization: String,
  licenseNumber: String,
  experience: Number,
  qualification: String,
  isApproved: Boolean,
  profileImage: String
}
```

### Prescription Model
```javascript
{
  patient: ObjectId,
  doctor: ObjectId,
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  diagnosis: String,
  notes: String,
  date: Date
}
```

### Medical Report Model
```javascript
{
  patient: ObjectId,
  doctor: ObjectId,
  title: String,
  description: String,
  reportType: String,
  fileUrl: String,
  uploadDate: Date
}
```

## 🚀 Advanced Features

### Real-time Communication
- **Server-Sent Events**: Live chat with patients
- **Message History**: Persistent chat history
- **Online Status**: Real-time presence indicators

### AI Assistant
- **Medical Queries**: AI-powered medical assistance
- **Drug Interactions**: Check medication interactions
- **Diagnosis Support**: AI-assisted diagnosis suggestions

### File Management
- **Report Upload**: Secure file upload system
- **PDF Generation**: Generate prescription PDFs
- **File Storage**: Organized file management

### Admin Features
- **Doctor Approval**: Review and approve new doctors
- **System Monitoring**: Monitor system usage
- **User Management**: Manage doctor accounts

## 🔧 Custom Hooks

### Available Hooks
- `use-mobile.js`: Detect mobile devices
- `use-toast.js`: Toast notification management

### Usage Example
```javascript
import { useMobile } from '@/hooks/use-mobile'
import { useToast } from '@/hooks/use-toast'

function MyComponent() {
  const isMobile = useMobile()
  const { toast } = useToast()
  
  // Component logic
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
NEXTAUTH_SECRET=your_production_nextauth_secret
NEXTAUTH_URL=https://your-domain.com
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js apps
- **Netlify**: Alternative deployment option
- **Railway**: Full-stack deployment
- **Heroku**: Traditional cloud platform

## 🔧 Development Guidelines

### Code Style
- Use functional components with hooks
- Implement proper error boundaries
- Follow Next.js best practices
- Use TypeScript for type safety (if migrating)

### Performance Optimization
- Implement proper loading states
- Use Next.js Image optimization
- Implement proper caching strategies
- Optimize bundle size

### Testing
```bash
# Add testing framework
npm install --save-dev jest @testing-library/react
```

## 📱 Mobile Responsiveness

Fully responsive design supporting:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

### Mobile Features
- Touch-friendly interface
- Optimized navigation
- Responsive tables and forms
- Mobile-specific layouts

## 🆘 Troubleshooting

### Common Issues

1. **File Upload Issues**:
   ```bash
   # Check upload directory permissions
   chmod 755 uploads/
   ```

2. **Database Connection**:
   ```bash
   # Test MongoDB connection
   mongosh "your_connection_string"
   ```

3. **Environment Variables**:
   ```bash
   # Check if env vars are loaded
   console.log(process.env.MONGODB_URI)
   ```

4. **Port Conflicts**:
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

### Debug Mode
```bash
DEBUG=* npm run dev
```

### Logging
```javascript
// Enable detailed logging
console.log('Debug info:', { variable })
```

## 🔄 Updates & Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor security vulnerabilities
- Update Next.js regularly
- Review and update API endpoints

### Backup Strategy
- Regular database backups
- Code repository backups
- Environment configuration backups

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Submit pull request
5. Code review process

### Code Standards
- ESLint configuration
- Prettier formatting
- Consistent naming conventions
- Proper documentation

## 📞 Support & Documentation

### Getting Help
- Check console for error messages
- Review API response codes
- Verify database connections
- Test authentication flow

### Additional Resources
- Next.js Documentation
- MongoDB Documentation
- NextAuth.js Documentation
- Tailwind CSS Documentation