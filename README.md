# 🗂 Kanban Board

A modern, responsive Kanban Task Management App built with React + Vite.

![Kanban Board](screenshots/dark.png)

## ✨ Features

- 📋 Three default columns: **Todo**, **In Progress**, **Done**
- ➕ Add, edit, and delete tasks with title, description & priority
- 🎯 Drag and drop tasks between columns
- ✅ Tasks auto-complete with strikethrough when moved to Done
- ⚡ Active indicator on In Progress tasks
- 🔴🟡🟢 Priority labels (High, Medium, Low)
- 🔍 Real-time search/filter
- 🌙 Dark / Light mode toggle
- 💾 localStorage persistence — tasks survive page refresh
- ➕ Add custom columns
- 📱 Fully responsive on mobile & desktop
- 🎨 Glassmorphism UI with animated background

## 🛠 Tech Stack

- **React** + **Vite**
- **Tailwind CSS v4**
- **@dnd-kit** — drag and drop
- **Lucide React** — icons
- **localStorage** — persistence
- **Vercel** — deployment

## 🚀 Live Demo

[View Live App](<YOUR_VERCEL_LINK_HERE>)

## 📸 Screenshots

### Dark Mode
![Dark Mode](screenshots/dark.png)

### Light Mode
![Light Mode](screenshots/light.png)

## 🏃 Run Locally
```bash
git clone https://github.com/snehakar1435/kanban-app.git
cd kanban-app
npm install
npm run dev
```

## 📁 Project Structure
```
src/
├── components/
│   ├── Board.jsx      # DnD context & column layout
│   ├── Column.jsx     # Column with add task form
│   └── TaskCard.jsx   # Draggable task card
├── App.jsx            # Main app with dark mode & search
└── index.css          # Glassmorphism styles
```
