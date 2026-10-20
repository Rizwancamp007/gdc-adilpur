# Government Degree College Adilpur — Official Website

Source code for the official website of **Government Degree College Adilpur**.

🌐 **Live site:** [gdcadilpur.edu.pk](https://gdcadilpur.edu.pk)

The website serves as the primary digital portal for students, faculty, administration, and prospective applicants to access academic resources, news, and campus updates.

## 🏛️ Features

- **Academic Directories:** Comprehensive information on departments, faculties, and course offerings.
- **Admissions Portal:** Guidelines, eligibility criteria, online registration forms, and fee structures.
- **News & Announcements:** Digital notice board for exams, results, holidays, and campus events.
- **Student Resources:** Quick access to downloads (admission forms, challans, roll number slips).
- **Responsive Layout:** Optimized for seamless viewing across smartphones, tablets, and desktops.

## 🛠️ Tech Stack

- **Frontend:** React 19, React Router, Vite, Tailwind CSS 4, Axios, react-hot-toast
- **Backend:** Node.js, Express 4, Mongoose (MongoDB), JWT auth, bcryptjs
- **Hosting:** Vercel (client) · Render (server)

## 🚀 Getting Started

Follow these steps to set up and run a local instance of the website for development and testing.

### Prerequisites

- **Node.js** 18+ and npm
- **Git** installed on your machine
- A **MongoDB** instance (local or Atlas) for the API

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rizwancamp007/gdc-adilpur.git
   ```
2. **Install all dependencies (root + client + server):**
   ```bash
   cd gdc-adilpur
   npm run install:all
   ```
3. **Configure the API environment:**
   Create a `.env` file inside `server/`:
   ```bash
   PORT=5000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<a-strong-random-secret>
   CLIENT_URL=http://localhost:5173
   ```
4. **Run in development mode (two terminals):**
   ```bash
   npm run dev:client   # Vite dev server → http://localhost:5173
   npm run dev:server   # API → http://localhost:5000
   ```
5. **Build the client for production:**
   ```bash
   npm run build   # outputs to client/dist
   ```

## 📂 Project Structure

```
gdc-adilpur/
├── client/               # React + Vite frontend (deployed to Vercel)
│   ├── src/              # Pages, components, hooks
│   └── vercel.json       # Client deployment config
├── server/               # Express API (deployed to Render)
│   ├── config/           # DB + app configuration
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth, error handling, rate limiting
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── seed/             # Seed scripts (seedAll.js)
│   ├── utils/            # Shared helpers
│   └── server.js         # App entry point
├── render.yaml           # Server deployment config
├── gdc-logo.png          # College logo asset
└── README.md             # Project documentation
```

## 📦 Deployment

- **Client:** deployed via Vercel (`client/vercel.json`).
- **API:** deployed via Render (`render.yaml`) — Node web service, env vars `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` set in the Render dashboard.

## 🤝 Contributing

Contributions to improve the website's UI/UX, security, or functionality are welcome.

1. **Fork** the repository.
2. Create your **feature branch** (`git checkout -b feature/NewFeature`).
3. **Commit** your changes with a [Conventional Commits](https://www.conventionalcommits.org/) message, e.g. `feat: add admission form validation` or `fix: broken notice-board link`.
4. **Push** to the branch (`git push origin feature/NewFeature`).
5. Open a **Pull Request** for review.

## 📄 License

This project is proprietary. All digital assets, source code, and institutional data belong strictly to the **Government Degree College Adilpur** administration. Unauthorized reproduction or distribution is strictly prohibited.
