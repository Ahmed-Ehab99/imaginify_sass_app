# 🎨 Imaginify - AI-Powered Image Transformation SaaS

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.20.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-2.7.0-blue?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)
[![Stripe](https://img.shields.io/badge/Stripe-19.1.0-purple?style=for-the-badge&logo=stripe)](https://stripe.com/)

> **Transform your images with the power of AI** - A comprehensive SaaS platform offering advanced image manipulation tools with secure authentication, credit-based pricing, and seamless user experience.

## 📖 Table of Contents

- [Overview](#-overview)
- [✨ Features](#-features)
- [⚙️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🔧 Environment Setup](#-environment-setup)
- [💳 Pricing Plans](#-pricing-plans)
- [🛠️ API Endpoints](#️-api-endpoints)
- [🎯 Key Components](#-key-components)
- [📱 Responsive Design](#-responsive-design)
- [🔒 Security Features](#-security-features)
- [🚀 Deployment](#-deployment)
- [📈 Performance](#-performance)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Overview

Imaginify is a modern, full-stack SaaS application that leverages AI-powered image transformation capabilities through Cloudinary's advanced image processing APIs. Built with Next.js 15 and TypeScript, it provides a seamless experience for users to transform images with various AI-powered tools including restoration, object removal, background removal, generative fill, and object recoloring.

### Key Highlights

- **AI-Powered Transformations**: Advanced image processing using Cloudinary's AI capabilities
- **Credit-Based System**: Flexible pricing model with Stripe integration
- **Real-time Processing**: Instant image transformations with live preview
- **Community Gallery**: Share and discover transformed images
- **Advanced Search**: Semantic search capabilities for finding images
- **Secure Authentication**: Robust user management with Clerk
- **Responsive Design**: Optimized for all devices and screen sizes

## ✨ Features

### 🔐 Authentication & Authorization

- **Secure User Access**: Registration, login, and route protection with Clerk
- **Social Authentication**: Multiple sign-in options
- **Protected Routes**: Middleware-based route protection
- **User Profile Management**: Complete user profile system

### 🖼️ Image Transformation Tools

- **Image Restoration**: Revive old or damaged images with AI-powered restoration
- **Object Removal**: Remove unwanted objects with precision using AI detection
- **Background Removal**: Extract subjects from backgrounds seamlessly
- **Generative Fill**: Fill missing areas using AI outpainting technology
- **Object Recoloring**: Customize object colors with intelligent AI recognition

### 🏪 Community & Discovery

- **Image Gallery**: Explore community transformations with pagination
- **Advanced Search**: Find images by content or objects using semantic search
- **Image Details**: Comprehensive transformation metadata and history
- **Download Options**: Save transformed images in high quality

### 💳 Credits & Payments

- **Flexible Pricing**: Multiple credit packages (Free, Pro, Premium)
- **Secure Payments**: Stripe integration for credit purchases
- **Credit Management**: Real-time credit balance tracking
- **Transaction History**: Complete purchase and usage history

### 🎨 User Experience

- **Real-time Preview**: Live transformation preview
- **Intuitive Interface**: Modern, user-friendly design with Tailwind CSS
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Loading States**: Smooth transitions and loading indicators
- **Error Handling**: Comprehensive error management and user feedback

## ⚙️ Tech Stack

### Frontend

- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4.18
- **UI Components**: Radix UI + Shadcn/ui
- **State Management**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Animations**: Tailwind CSS Animations

### Backend & Database

- **Database**: MongoDB 6.20.0 with Mongoose ODM
- **API Routes**: Next.js API Routes
- **Authentication**: Clerk 6.33.1
- **File Storage**: Cloudinary 2.7.0
- **Payments**: Stripe 19.1.0

### Development & Deployment

- **Package Manager**: npm
- **Linting**: ESLint 9
- **Type Checking**: TypeScript
- **Build Tool**: Next.js with Turbopack
- **Deployment**: Vercel (recommended)

## 🏗️ Architecture

### Project Structure

```
imaginify_sass_app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (root)/                   # Protected application routes
│   ├── api/                      # API endpoints
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── shared/                   # Shared components
│   └── ui/                       # UI component library
├── constants/                    # Application constants
├── lib/                          # Utility functions and actions
│   ├── actions/                  # Server actions
│   ├── database/                 # Database models and connection
│   └── utils.ts                  # Utility functions
├── types/                        # TypeScript type definitions
└── public/                       # Static assets
```

### Data Flow

1. **User Authentication**: Clerk handles authentication and user management
2. **Image Upload**: Cloudinary manages file uploads and storage
3. **Transformation**: Cloudinary AI APIs process images
4. **Data Persistence**: MongoDB stores user data and image metadata
5. **Payment Processing**: Stripe handles credit purchases
6. **Real-time Updates**: Server actions provide seamless data updates

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Clerk account for authentication
- Cloudinary account for image processing
- Stripe account for payments

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/imaginify_sass_app.git
cd imaginify_sass_app
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
WEBHOOK_SECRET=your_clerk_webhook_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Application
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

### Core Directories

#### `/app` - Next.js App Router

- **`(auth)/`**: Authentication pages (sign-in, sign-up)
- **`(root)/`**: Main application pages (home, profile, transformations)
- **`api/`**: API routes for webhooks and server actions

#### `/components` - React Components

- **`shared/`**: Business logic components
- **`ui/`**: Reusable UI components (buttons, forms, etc.)

#### `/lib` - Core Logic

- **`actions/`**: Server actions for data operations
- **`database/`**: MongoDB models and connection
- **`utils.ts`**: Utility functions and helpers

### Key Files

| File                 | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `middleware.ts`      | Route protection and authentication      |
| `constants/index.ts` | Application constants and configurations |
| `types/index.d.ts`   | TypeScript type definitions              |
| `tailwind.config.ts` | Tailwind CSS configuration               |

## 🔧 Environment Setup

### Required Services

1. **MongoDB Atlas**

   - Create a new cluster
   - Get connection string
   - Configure database permissions

2. **Clerk Authentication**

   - Create new application
   - Configure social providers
   - Set up webhooks for user events
   - Configure redirect URLs

3. **Cloudinary**

   - Create account and get cloud name
   - Configure upload presets
   - Set up AI add-ons for transformations

4. **Stripe**
   - Create account and get API keys
   - Configure webhooks for payment events
   - Set up products and pricing

### Webhook Configuration

#### Clerk Webhooks

- **Endpoint**: `/api/webhooks/clerk`
- **Events**: `user.created`, `user.updated`, `user.deleted`

#### Stripe Webhooks

- **Endpoint**: `/api/webhooks/stripe`
- **Events**: `checkout.session.completed`

## 💳 Pricing Plans

| Plan        | Price | Credits | Features                                        |
| ----------- | ----- | ------- | ----------------------------------------------- |
| **Free**    | $0    | 20      | Basic access, 20 free credits                   |
| **Pro**     | $40   | 120     | Full access, priority support                   |
| **Premium** | $199  | 2000    | Full access, priority support, priority updates |

### Credit System

- Each transformation costs 1 credit
- Credits are deducted automatically
- Users can purchase additional credits anytime
- Free users start with 100 credits

## 🛠️ API Endpoints

### Authentication Webhooks

```typescript
POST / api / webhooks / clerk;
// Handles user creation, updates, and deletion
```

### Payment Webhooks

```typescript
POST / api / webhooks / stripe;
// Processes successful payments and credit updates
```

### Server Actions

- `addImage()` - Add new transformed image
- `updateImage()` - Update existing image
- `deleteImage()` - Remove image
- `getAllImages()` - Fetch images with pagination
- `getImageById()` - Get specific image details
- `updateCredits()` - Update user credit balance
- `checkoutCredits()` - Process credit purchases

## 🎯 Key Components

### Core Components

#### `TransformationForm`

- Handles all image transformation logic
- Real-time preview functionality
- Credit validation and deduction
- Form validation with Zod schemas

#### `MediaUploader`

- Cloudinary integration for file uploads
- Drag-and-drop functionality
- Image preview and validation
- Progress indicators

#### `TransformedImage`

- Real-time transformation display
- Download functionality
- Loading states and error handling
- Responsive image optimization

#### `Collection`

- Image gallery with pagination
- Search functionality
- Responsive grid layout
- Image metadata display

#### `Checkout`

- Stripe payment integration
- Credit package selection
- Transaction processing
- Success/error handling

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Design Principles

- Mobile-first approach
- Consistent spacing and typography
- Accessible color contrast
- Touch-friendly interface elements
- Optimized image loading

## 🔒 Security Features

### Authentication Security

- JWT-based authentication via Clerk
- Protected API routes
- CSRF protection
- Secure session management

### Data Security

- Environment variable protection
- Input validation and sanitization
- SQL injection prevention (NoSQL)
- Secure file upload validation

### Payment Security

- Stripe PCI compliance
- Webhook signature verification
- Secure transaction processing
- Encrypted data transmission

## 📈 Performance

### Optimization Features

- **Next.js Image Optimization**: Automatic image optimization
- **Cloudinary CDN**: Global content delivery
- **Code Splitting**: Automatic bundle optimization
- **Lazy Loading**: Component and image lazy loading
- **Caching**: Strategic caching implementation

**Built with ❤️ by Me 😊**

_Transform your creative vision with AI-powered image processing._
