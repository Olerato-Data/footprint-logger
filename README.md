# 🌱 Footprint Logger

A web platform that helps users track daily activities contributing to carbon emissions, view personalised summaries, and receive actionable tips to reduce their environmental impact.

Built as a Data Analytics Capstone project for a local environmental group.

---

## 🚀 Live Demo

> Open `index.html` directly in your browser — no server required for the frontend version.

---

## ✨ Features

### Activity Logging
- Log daily activities across **Transport**, **Food**, and **Energy** categories
- 16 preset activities with real-world CO₂ values (sourced from IPCC & Our World in Data)
- Running total of emissions updated instantly
- Filter logs by category
- Data persists using `localStorage`

### Dashboard
- Summary metric cards: today's total, weekly average, activity count, top category
- **Bar chart** — emissions broken down by category
- **Line chart** — 7-day emissions trend
- **Community comparison** — see how your footprint compares to the average user

### Insight Engine
- Automatically identifies your highest-emission category
- Personalised reduction tips based on your activity patterns
- Weekly goal progress bars (transport reduction, meat-free days, energy target)
- 7-day logging streak tracker

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Charts | Chart.js 4.4 |
| Data persistence | localStorage (frontend) / MongoDB (backend) |
| Backend *(planned)* | Node.js, Express.js |
| Database *(planned)* | MongoDB + Mongoose |
| Auth *(planned)* | JWT, bcrypt |

---

## 📁 Project Structure

```
footprint-logger/
├── index.html          # Main application (single-file frontend)
├── README.md           # Project documentation
├── /backend            # Node.js + Express API (planned)
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── logs.js
│   ├── models/
│   │   ├── User.js
│   │   └── ActivityLog.js
│   └── middleware/
│       └── auth.js
└── /public             # Static assets
```

---

## ⚡ Getting Started

### Frontend only (no setup needed)
```bash
git clone https://github.com/YOUR_USERNAME/footprint-logger.git
cd footprint-logger
# Open index.html in your browser
```

### Full stack (with backend)
```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start the server
npm start
```

---

## 🌍 CO₂ Emission Factors

| Activity | Factor | Source |
|----------|--------|--------|
| Petrol car | 0.21 kg CO₂/km | IPCC 2023 |
| Electric vehicle | 0.07 kg CO₂/km | Our World in Data |
| Short-haul flight | 255 kg CO₂/trip | IPCC 2023 |
| Beef | 27 kg CO₂/kg | Poore & Nemecek, 2018 |
| Electricity (SA grid) | 0.49 kg CO₂/kWh | Eskom 2023 |

---

## 🗺️ Roadmap

- [x] Activity logging with category filtering
- [x] Visual dashboard with Chart.js
- [x] Community comparison
- [x] Personalised tips & weekly goals
- [ ] User registration & login (Node.js + Express)
- [ ] MongoDB cloud database integration
- [ ] Weekly email summaries
- [ ] Mobile-responsive PWA

---

## 👤 Author

**[Your Name]**  
Data Analytics Capstone — 2025  
GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
