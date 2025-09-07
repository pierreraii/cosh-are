# CoOwn - Collective Asset Management Platform

CoOwn is a modern web application designed to help multiple people manage shared assets together. Whether you're co-owning a vacation home, sharing a car, or managing any collective investment, CoOwn provides the tools to track ownership, expenses, bookings, and documentation in one centralized platform.

## ✨ Features

### 📊 **Dashboard & Analytics**
- Real-time overview of all co-owned assets
- Total portfolio value tracking
- Monthly expense monitoring
- Upcoming bookings preview
- Visual ownership breakdowns with interactive charts

### 🏠 **Asset Management**
- Create and manage shared items (vehicles, properties, equipment, etc.)
- Track current market value and ownership percentages
- Upload and organize important documents (deeds, registrations, warranties)
- Rich item descriptions with image support

### 💰 **Financial Tracking**
- **Recurring Bills**: Monthly/yearly expenses (insurance, utilities, maintenance)
- **One-time Expenses**: Repairs, improvements, and unexpected costs
- Track who paid what and when
- Automatic calculation of ownership-based expense splitting
- Receipt and document attachment support

### 📅 **Booking System**
- Schedule usage of shared assets
- Prevent booking conflicts
- Track booking history
- Status management (confirmed/pending)

### 👥 **Multi-owner Support**
- Flexible ownership percentage allocation
- User management with avatars and profiles
- Track individual contributions and usage
- Transparent expense attribution

### 📄 **Document Management**
- Secure document storage and organization
- File type and size tracking
- User attribution for uploads
- Easy access to important paperwork

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: React Router DOM
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Notifications**: Sonner for toast notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collective-assets
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using bun (recommended)
   bun install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_PROJECT_ID=your_supabase_project_id
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   # Using npm
   npm run dev
   
   # Using bun
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── AddBillModal.tsx # Bill creation modal
│   ├── BillList.tsx    # Bill management interface
│   ├── BookingCalendar.tsx # Calendar for bookings
│   ├── BookingModal.tsx # Booking creation modal
│   ├── CreateItemModal.tsx # Item creation modal
│   ├── Dashboard.tsx   # Main dashboard view
│   ├── DocumentList.tsx # Document management
│   ├── ItemDetail.tsx  # Detailed item view
│   ├── Layout.tsx      # App layout wrapper
│   └── OwnershipChart.tsx # Ownership visualization
├── hooks/              # Custom React hooks
├── lib/
│   ├── supabase.ts     # Supabase client configuration
│   └── utils.ts        # Utility functions
├── pages/
│   ├── Index.tsx       # Main application page
│   └── NotFound.tsx    # 404 error page
├── types/
│   └── index.ts        # TypeScript type definitions
└── main.tsx           # Application entry point
```

## 💡 Usage Guide

### Creating Your First Asset

1. Click the "Add Item" button in the header
2. Fill in the item details:
   - **Title & Description**: Clear identification
   - **Value**: Current market value
   - **Owners**: Add co-owners with ownership percentages
3. Save to create your asset

### Managing Expenses

1. Navigate to an asset's detail page
2. Use "Add Bill" to create expenses:
   - **Recurring**: Monthly insurance, utilities, loan payments
   - **One-time**: Repairs, improvements, emergency costs
3. Assign who paid and attach receipts if needed

### Booking Assets

1. Open the asset detail page
2. Click "Book Asset" or use the calendar view
3. Select dates and add a description
4. Confirm to reserve the asset

### Document Organization

1. Access the Documents section in asset details
2. Upload important files (PDFs, images, etc.)
3. Files are automatically organized with metadata
4. Easy download and viewing capabilities

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- ESLint for code linting
- TypeScript for type safety
- Prettier configuration through ESLint
- Tailwind CSS for consistent styling

### Database Schema

The application expects the following main entities in Supabase:

- **Users**: User profiles and authentication
- **Items**: Shared assets/items
- **Bills**: Expense tracking (recurring and one-time)
- **Bookings**: Asset reservation system  
- **Documents**: File storage and metadata
- **Ownership**: User-asset relationships with percentages

## 🎨 Design System

The application uses a custom financial-focused design system built on top of Tailwind CSS:

- **Colors**: Professional palette with primary, secondary, and accent colors
- **Typography**: Clean, readable fonts optimized for financial data
- **Components**: Consistent styling for cards, buttons, and forms
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG compliant components from Radix UI

## 🚀 Deployment

The application can be deployed to any static hosting service:

1. **Vercel** (Recommended)
   ```bash
   npm run build
   # Deploy the `dist` folder
   ```

2. **Netlify**
   ```bash
   npm run build
   # Deploy the `dist` folder
   ```

3. **Custom Server**
   ```bash
   npm run build
   # Serve the `dist` folder with any web server
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- Mobile app development
- Advanced expense splitting algorithms
- Integration with bank accounts
- Automated bill reminders
- Advanced reporting and analytics
- Multi-currency support
- API for third-party integrations

---

**CoOwn** - Making shared ownership simple and transparent.