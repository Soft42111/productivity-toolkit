# Productivity Toolkit 🧰

**Get‑Productive** is a web-based productivity suite built with TypeScript, Vite, Tailwind, and Supabase. It’s designed to help you manage tasks, stay focused, and make your workflow more efficient — all in one lightweight app.

Live demo → [get‑productive.vercel.app](https://get-productive.vercel.app)  

---

## Features

- **Task Management** — Create, edit, and delete tasks / todos.  
- **Real-time Sync** — Data persists in Supabase, so your tasks sync across sessions.  
- **Responsive UI** — Clean, minimal UI built with Tailwind + Vite.  
- **Powered by TypeScript** — Type safety across the front end.  
- **Backed by Supabase** — For auth, database, and realtime features.

---

## Architecture

```
/
├── src/                 # Frontend source code
│   ├── components       # Reusable UI components
│   ├── pages            # Vite / framework pages (if any)
│   ├── styles           # Tailwind / CSS config
│   └── utils            # Utility helpers
├── supabase/            # Supabase-related config & migration files
│   └── …  
├── public/              # Static assets
├── .env                 # Environment variables (ignored)
└── vite.config.ts       # Vite configuration
```

---

## Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/Soft42111/productivity-toolkit.git
   cd productivity-toolkit
   ```

2. **Install dependencies**  
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Supabase**  
   - Create a Supabase project  
   - Copy your Supabase `URL` and `anon/public` key  
   - Add them to `.env`:
     ```
     VITE_SUPABASE_URL=your_url_here  
     VITE_SUPABASE_ANON_KEY=your_key_here  
     ```

4. **Run locally**  
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Deploy**  
   - You can deploy this to Vercel (or a similar static-hosting + serverless backend provider).  
   - Make sure your environment variables are set in the hosting provider.

---

## Usage

- Open the app via the web link or your local dev version  
- Sign in (if auth is enabled) — Supabase takes care of that  
- Create and manage tasks  
- Your tasks are saved in real-time and synced

---

## Roadmap

Here are some ideas for where this could go / be improved:

- **Subtasks / Checklists** — Break tasks into smaller bits  
- **Reminder / Notifications** — Trigger alerts for upcoming tasks  
- **Tags / Labels** — Categorize tasks (e.g. work, personal)  
- **Calendar Integration** — See your tasks on a calendar view  
- **Analytics** — Stats on how many tasks you complete, productivity trends  

---

## Contributing

1. Fork the repo  
2. Create a new branch (`git checkout -b feature/some-new-feature`)  
3. Make your changes + add tests / validation  
4. Commit & push  
5. Open a pull request — describe what you did and why  

Please make sure any new features are in line with project’s goals (simplicity and productivity).

---

## License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute it as you like.

---

## Contact / Author

- **Author:** Soft42111  
- **Website / Demo:** [get‑productive.vercel.app](https://get-productive.vercel.app)  
- **Feedback / Issues:** Use the GitHub Issues tab  

---

## Why This Exists

Productivity tools are everywhere, but many get bloated, complex, or overly opinionated. This toolkit aims to stay **simple**, **fast**, and **useful** — your daily companion, not a burden. Productivity software helps people manage tasks and time more effectively. ([techtarget.com](https://www.techtarget.com/whatis/definition/productivity-software?utm_source=chatgpt.com))  
