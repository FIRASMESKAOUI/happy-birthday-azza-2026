# 🎂 Birthday Wish Website

A faithful recreation of the [Cutiepage Birthday Wish 01](https://www.cutiepage.in/templates/bday-wish-1) template.

## ✨ Features

- **3 Intro Slides** — Animated slideshow with the "It's your special day" flow
- **Celebration Scene** — Confetti cannon + party cake + birthday greeting
- **Flip Cards** — 3 interactive 3D-flipping wish cards
- **Final Letter** — Envelope that opens to reveal a heartfelt letter
- **Music Player** — Auto-play with mute toggle
- **Floating Decorations** — Balloons, sparkles, confetti dots
- **Smooth Transitions** — Framer Motion slide animations between screens

## 🎨 Design

- Pink/cream gradient aesthetic matching the reference
- **Fonts**: Lora (serif/italic) + Nunito (sans-serif)
- **Colors**: Rose pink `#c2185b`, warm pink `#f48fb1`, deep raspberry `#e91e8c`
- Glassmorphism card with soft box shadows
- Responsive for mobile and desktop

## 🛠 Personalization

Edit [`src/config.ts`](./src/config.ts) to customize:

```ts
export const config = {
  birthdayName: "Sarah",        // → shows in brand label
  senderName: "Your bestie",
  
  celebration: {
    title: "Happy Birthday, Sarah! 🎉",
    subtitle: "...",
  },
  
  flipCards: [/* 3 cards with emoji, title, message */],
  
  letter: {
    greeting: "Dear Sarah,",
    paragraphs: ["...", "..."],
    closing: "With all my love,",
    signature: "Your bestie 💕",
  },
  
  music: {
    enabled: true,
    url: "...",  // URL to an MP3 file
  },
};
```

## 🚀 Running

```bash
npm install
npm run dev
```

Opens at **http://localhost:5173**
