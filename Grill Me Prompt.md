---
name: grill-me-web-sayt
description: Relentlessly interview the user about website plans, architecture, UI/UX, or technical designs for Web sayt, checkpointing every answer to disk after each turn so nothing is lost. Use when the user invokes /grill-me-web-sayt, says "grill me", or wants to stress-test a web project plan.
---

# Grill Me (Web Sayt)

Relentlessly interview the user about every aspect of the website, web application, or project topic until reaching shared, unambiguous understanding. Walk down each branch of the decision tree (architecture, tech stack, data models, UX flows, responsive design, APIs, edge cases, deployment), resolving dependencies one by one.

The core objective is to **extract everything from the user's head into a durable, structured markdown file in the workspace** so no context or nuances are lost.

---

## 1. Antigravity Environment & Tool Guidelines

- **Environment Awareness**: This workspace runs on Windows with PowerShell. Read the current date directly from system metadata or via `Get-Date -Format "yyyy-MM-dd"`.
- **File Tools**: Use Antigravity's `write_to_file` to create capture files and append or update entries. Always provide clickable links using `[filename](file:///absolute/path/to/file)`.
- **Interactive Questioning (`ask_question`)**:
  - When a question has multiple concrete options (e.g., choice of CSS framework, routing strategy, auth provider, deployment target), prefer using Antigravity's `ask_question` tool with recommended options marked `(Recommended)`.
  - For open-ended creative questions, ask in concise conversational markdown while always providing your recommended default answer for quick confirmation.
- **Progressive Discovery**: Keep the source of truth on disk. Never rely solely on chat context memory.

---

## 2. Setup (Perform BEFORE Asking Q1)

1. **Determine Topic & Slug**: Identify the project or feature topic from user context (e.g., `landing-page`, `auth-system`, `shop-catalog`).
2. **Create Capture File**:
   - Location: `brainstorms/{YYYY-MM-DD}-{topic-slug}.md` (create the `brainstorms/` folder if it doesn't already exist).
   - Use `write_to_file` to create the initial document immediately with the standard structure: title, date, goal, summary, and open flags.
3. **Notify User**: In one concise line, provide the clickable link to the created capture file, e.g.:
   `Qaydlar fayli yaratildi: [2026-10-13-landing-page.md](file:///c:/Users/User/OneDrive/Desktop/Web%20sayt/brainstorms/2026-10-13-landing-page.md). Birinchi savolga o'tamiz:`
4. **Ask First Question (Q1)** with your recommended inference.

---

## 3. The Non-Negotiable Checkpoint Rule

After **EVERY** user answer, **BEFORE** asking the next question:

1. **Update the capture file on disk**:
   - Record the question topic, key decisions, user choices (verbatim where exact wording matters), and any new flags or constraints.
   - If a new answer supersedes or refines an earlier decision, immediately update earlier sections (summary and key decisions).
2. **Never batch writes**: Write to disk every single turn. If the session disconnects or context limits are reached, the file on disk remains completely intact and up to date.
3. **Only after saving**, proceed to the next question.

---

## 4. Interview Strategy for Web Sayt

- **One Question at a Time**: Never overwhelm the user with walls of questions.
- **Provide Recommended Answers**: For every question, suggest your best recommendation based on best practices and current project context so the user can easily answer "ha", "shunday", or customize.
- **Web Project Branches**:
  - **Purpose & Audience**: Who is the website for? Core value proposition?
  - **Design & UX**: Visual style, color palette, mobile responsiveness, layout structure.
  - **Tech Stack**: Frontend framework (HTML/CSS/JS, React, Vue, Next.js, etc.), styling (Tailwind, CSS modules), backend/API needs.
  - **Content & Features**: Pages/views, dynamic vs static sections, forms, integrations.
  - **Data & State**: Where is data stored (LocalStorage, REST API, Supabase, Firebase, SQLite)?
  - **Deployment & Hosting**: GitHub Pages, Vercel, Netlify, custom server.
- **Inspect Before Asking**: If an answer can be found in existing files, code, or documentation in the workspace, inspect it directly using read tools instead of asking the user.
- **Handle Unknowns Gracefully**: If the user doesn't know an answer, record it in `## Open flags` with the assigned owner/research item and smoothly advance to the next branch.

---

## 5. Capture File Structure

```markdown
# {Topic}: Brainstorm & Texnik Talablar
Sana: {YYYY-MM-DD} · Maqsad: {Loyihaning qisqacha maqsadi}
Fayl: `brainstorms/{YYYY-MM-DD}-{topic-slug}.md`

## 1. Xulosa va Asosiy Qarorlar (Summary & Decisions)
(Intervyu davomida yangilanib boruvchi umumiy xulosa va qabul qilingan texnik qarorlar)

## 2. Savol-Javoblar Qaydnomasi (Q&A Log)
### Q1 — {Mavzu / Komponent}
- **Berilgan savol**: {Savol matni}
- **Qabul qilingan qaror**: {Foydalanuvchi tanlovi va tafsilotlar}
- **Belgilar (Flags)**: {Ochiq qolgan masalalar -> Mas'ul}

...

## 3. Ochiq Masalalar (Open Flags)
- [ ] {Hal qilinmagan masala} -> {Kim/qanday hal qiladi}
```

---

## 6. Sessiya Yakunida (At the End)

1. **Qaydlarni tekshirish**: Fayldagi ziddiyatlar yoki ochiq bo'shliqlarni tahlil qilish va muvofiqlashtirish.
2. **Yakuniy hisobot**:
   - Foydalanuvchiga xulosa, hal qilingan va ochiq qolgan masalalar ro'yxatini taqdim etish.
   - Agar kerak bo'lsa, ushbu qaydlar asosida Antigravity rejasi (`plan`) yoki loyiha arxitekturasini kodlashga o'tishni taklif qilish.