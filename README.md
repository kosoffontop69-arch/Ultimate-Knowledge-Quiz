# Ultimate Knowledge Quiz

A single-page quiz web application built with **HTML**, **CSS**, and **vanilla JavaScript**. Choose from 25 categories across 5 topics, answer 10 random questions per round, and compete on the leaderboard. No frameworks or build step required—just open and play.

---

## Features

- **25 categories** in **5 topics**: Academic, Sports, Nepal, Arts & Culture, General  
- **10 questions per game**—randomly picked from 25 per category so each round is different  
- **Random answer order**—correct option appears in any of the 4 positions  
- **No time limit**—take your time; **time taken** is shown on the result screen  
- **Leaderboard**—scores saved in the browser (name, category, score, date); filter by All / Science / Sports / Math; **Clear Leaderboard** option  
- **Dark mode**—toggle in the top-right; preference saved in the browser  
- **Responsive layout**—works on desktop and mobile  
- **Confetti** for high scores (70%+)

---

## How to Run

1. Download or clone this folder.
2. Open **`index.html`** in a modern browser (Chrome, Edge, Firefox, etc.).
3. No server or installation needed—the app runs entirely in the browser.

---

## Project Structure

```
├── index.html    # Main page: home, name entry, quiz, result, leaderboard screens
├── style.css     # All styles: layout, dark mode, responsive, components
├── script.js     # App logic: navigation, quiz flow, timer, leaderboard, theme
├── questions.js  # Question bank: 25 questions per category (25 categories)
└── README.md     # This file
```

---

## Topics & Categories

| Topic | Categories |
|-------|------------|
| **1. Academic** | Science, Mathematics, Computer, English, Social Studies |
| **2. Sports** | Football, Cricket, Basketball, Olympics, Sports General |
| **3. Nepal** | Nepal, Nepal's History, Nepal Geography, Nepal Culture, Nepal Festivals |
| **4. Arts & Culture** | Geography, Literature, Music, World History, Art & Movies |
| **5. General** | Nature, Space, General Knowledge, Current Affairs, Mixed Challenge |

**Mixed Challenge** picks 10 random questions from all categories.

---

## How to Play

1. **Home** — Tap or click a category card.
2. **Name entry** — Enter your name and click **Start Quiz**.
3. **Quiz** — Answer 10 questions (4 options each). Correct answers turn green, wrong ones red with the correct answer shown. You move to the next question automatically after 1 second.
4. **Result** — See your score, percentage, time taken, and a short message. Your score is added to the leaderboard.
5. **Leaderboard** — Open from the result screen; filter by category and clear scores if you want.

---

## Technologies

- **HTML5** — Structure and semantics  
- **CSS3** — Layout, variables, dark mode, transitions, responsive design  
- **JavaScript (ES5-style)** — No frameworks; plain JS for quiz logic, localStorage, DOM  
- **Google Fonts** — Poppins

---

## Browser Support

Works in current versions of Chrome, Edge, Firefox, and Safari. Requires JavaScript enabled and localStorage available for leaderboard and theme.

---

## License

Free to use and modify for learning or exhibition projects.
