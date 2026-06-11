# LinkVault Frontend

A modern, responsive frontend for LinkVault — a Linktree-style SaaS platform built with React, Vite, and Tailwind CSS.

## 🌐 Live Demo
(https://linkvault-frontend-flax.vercel.app)

## 📸 Features

- 🔐 **JWT Authentication** — Secure login & register
- 👤 **Profile Management** — Create and edit your profile
- 🔗 **Link Management** — Add, edit, delete, toggle links
- 📊 **Analytics Dashboard** — Track clicks with charts
- 🎨 **3 Themes** — Dark, Light, Gradient
- 📱 **Mobile Responsive** — Works on all devices
- 🖼️ **Image Upload** — Cloudinary integration
- ↕️ **Drag & Drop** — Reorder links easily
- 🌍 **Public Profile** — Share your page at `/u/username`
- 📋 **Copy Link** — One click profile link copy

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS v3 | Styling |
| React Router v6 | Routing |
| Axios | API calls |
| Recharts | Analytics charts |
| DnD Kit | Drag & drop |
| React Icons | Icon library |
| Vercel | Deployment |

## 📁 Project Structure

```frontend/
├── public/
│   └── vercel.json        # Vercel routing config
├── src/
│   ├── api/
│   │   └── axios.js       # Axios instance + interceptors
│   ├── components/
│   │   ├── ImageUpload.jsx # Profile image upload
│   │   ├── LinkCard.jsx   # Link card component
│   │   ├── LinkForm.jsx   # Add/edit link form
│   │   ├── ProfileForm.jsx # Profile form
│   │   └── SortableLinkCard.jsx # Drag & drop card
│   ├── context/
│   │   └── AuthContext.jsx # Auth state management
│   ├── pages/
│   │   ├── Analytics.jsx  # Analytics page
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   ├── Login.jsx      # Login page
│   │   ├── PublicProfile.jsx # Public profile page
│   │   └── Register.jsx   # Register page
│   ├── App.jsx            # Routes configuration
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- npm or yarn
- LinkVault Backend running

### Installation

```bash
# Clone the repository
git clone https://github.com/mianmuhammadbilal/linkvault-frontend.git

# Navigate to project
cd linkvault-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

## 📱 Pages Overview

### Login Page (`/login`)
- Email & password login
- Link to register page
- JWT token storage

### Register Page (`/register`)
- Name, email, password
- Password strength indicator
- Redirect to login after success

### Dashboard (`/`)
- Stats cards (total links, active, clicks)
- Profile card with edit option
- Links management with drag & drop
- Analytics button
- Copy profile link

### Analytics (`/analytics`)
- Total clicks, links, active count
- Bar chart with Recharts
- Link breakdown with progress bars
- Top performing link

### Public Profile (`/u/:username`)
- Profile avatar & info
- All active links
- 3 theme support
- Click tracking

## 🎨 Themes

| Theme | Description |
|-------|-------------|
| 🌙 Dark | Sleek black background |
| ☀️ Light | Clean white background |
| ✨ Gradient | Purple gradient background |

## 🚀 Deployment

This app is deployed on **Vercel**.

### Deploy Steps
1. Push code to GitHub
2. Import project in Vercel
3. Add `VITE_API_URL` environment variable
4. Vercel auto-deploys on every push

### Vercel Config (`vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🔗 Related

- **Backend Repo:** [linkvault-backend](https://github.com/mianmuhammadbilal/linkvault-backend)
- **Live API:** https://linkvault-backend-production-612e.up.railway.app

## 👨‍💻 Author

**M. Bilal**
- GitHub: [https://github.com/mianmuhammadbilal]

## 📄 License

MIT License — feel free to use this project!