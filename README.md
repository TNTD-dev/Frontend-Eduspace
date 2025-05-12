/ (project root)
├─ public/                   # Tài nguyên tĩnh (favicon, index.html,…)
│   └─ index.html
├─ src/
│   ├─ api/                  # Các hàm gọi API (authService.js, userService.js,…)
│   ├─ assets/               # Hình ảnh, font, icon…
│   ├─ components/           # Các component tái sử dụng
│   │   ├─ auth/             # Login, Register…
│   │   ├─ ui/               # Button, Card, Modal (shadcn/ui)…
│   │   └─ layout/           # Navbar, Footer, Sidebar…
│   ├─ context/              # React Context (AuthContext.jsx,…)
│   ├─ hooks/                # Các custom hook (useAuth.js, useFetch.js…)
│   ├─ pages/                # Các trang của App (LoginPage.jsx, Dashboard.jsx…)
│   ├─ routes/               # Định nghĩa route (ProtectedRoute.jsx, router.jsx…)
│   ├─ styles/               # CSS/Tailwind overrides, globals.css…
│   ├─ utils/                # Công cụ chung (axios.js, validators.js…)
│   ├─ App.jsx               # Component gốc, cấu hình Router
│   └─ main.jsx              # Entry point ReactDOM.render
├─ .gitignore
├─ jsconfig.json             # Alias “@/*” -> “src/*”
├─ netlify.toml              # Cấu hình Netlify
├─ package.json
├─ tailwind.config.cjs
├─ vite.config.js
└─ README.md
