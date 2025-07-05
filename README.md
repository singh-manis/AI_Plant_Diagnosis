# 🌱 AI Plant Diagnosis

A full-stack AI-powered urban gardening platform to help you diagnose plant issues, track care, and get smart reminders—anywhere, anytime.

---

## 🚀 Live Demo

- **Frontend:** [ai-plant-diagnosis.vercel.app](https://ai-plant-diagnosis.vercel.app/)
- **Backend API:** [ai-plant-diagnosis-1.onrender.com](https://ai-plant-diagnosis-1.onrender.com/)

---

## ✨ Features

- **User Authentication** – Secure login and registration
- **Plant Management** – Add, edit, and track your plants
- **AI Assistant** – Identify plants and diagnose health issues
- **Care Diary** – Log plant care activities with photos
- **Smart Reminders** – Never forget to water or fertilize
- **Weather Integration** – Get care tips based on local weather
- **Notifications** – Real-time alerts for plant care
- **Dashboard** – Overview of your plant collection and schedule

---

## 🛠️ Tech Stack

| Frontend         | Backend         | Database | Deployment      |
|------------------|----------------|----------|-----------------|
| React 18         | Node.js, Express| MongoDB  | Vercel (FE), Render (BE) |
| Tailwind CSS     | JWT Auth        |          |                 |
| Axios, Heroicons | Nodemailer, Multer |      |                 |

---

## 📦 Project Structure

```
AI_Plant_Diagnosis/
├── backend/    # Express API, MongoDB models, controllers
├── frontend/   # React app, UI components, context, services
└── README.md   # (this file)
```

---

## ⚡ Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/your-username/AI_Plant_Diagnosis.git
cd AI_Plant_Diagnosis
```

### 2. Backend Setup

```sh
cd backend
npm install
# Create a .env file with your MongoDB URI and secrets
npm start
```

**Sample backend/.env:**
```
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
```

### 3. Frontend Setup

```sh
cd ../frontend
npm install
# Create a .env file with your backend API URL
npm start
```

**Sample frontend/.env:**
```
REACT_APP_API_URL=http://localhost:5000
```

---

## 🌍 Deployment

- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Render](https://render.com/)

---

## 🤝 Contributing

1. Fork the repo and create your branch (`git checkout -b feature/your-feature`)
2. Commit your changes (`git commit -am 'Add new feature'`)
3. Push to the branch (`git push origin feature/your-feature`)
4. Open a Pull Request

---

