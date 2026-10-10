// ─── Birthday config for AZZA from FIRAS ──────────────────────

export const config = {
  recipientName: 'AZZA',
  senderName: 'FIRAS',

  darkRoom: {
    label: 'azza.birthday',
    title: 'Happy Birthday',
    subtitle: 'Your surprise is waiting in the dark…',
    buttonLabel: 'Turn on the light',
  },

  litRoom: {
    headline: 'Happy Birthday',
    subheadline: 'A tiny celebration page for AZZA, made with lots of love.',
    buttons: {
      music:    'Set the mood',
      decorate: 'Decorate the room',
      balloons: 'Release the balloons',
      cake:     'Cut the cake',
    },
  },

  card: {
    title: 'Happy Birthday, AZZA! 🎉',
    subtitle: 'This little page was made just for you.',
    emoji: '🎂',
  },

  cake: {
    instruction: 'Swipe across to cut the cake →',
    progressLabel: 'Cut progress',
  },

  wish: {
    label: 'MAKE A WISH',
    heading: 'Close your eyes and make a wish',
    subtext: "When you're ready, tap the button below.",
    buttonLabel: 'I Made My Wish',
  },

  wishCards: [
    {
      id: 1,
      emoji: '🌸',
      color: '#fce4ec',
      accentColor: '#f48fb1',
      message:
        'May your day be filled with laughter, love, and small moments that feel unforgettable.',
    },
    {
      id: 2,
      emoji: '✨',
      color: '#e8eaf6',
      accentColor: '#7986cb',
      message:
        'I hope this year brings calm, confidence, good surprises, and people who cheer for you loudly.',
    },
    {
      id: 3,
      emoji: '🎀',
      color: '#e0f7fa',
      accentColor: '#4dd0e1',
      message:
        'You deserve joy that feels easy, memories that stay warm, and a year that treats you gently.',
    },
  ],

  letter: {
    dateLine: 'With lots of love',
    greeting: 'Dear AZZA,',
    body: [
      'Happy Birthday to someone who makes life feel softer, brighter, and a little more fun.',
      'I hope this year gives you more peace, more confidence, and more moments that remind you how loved you are.',
      'You deserve good people, beautiful memories, and the kind of happiness that stays.',
    ],
    closing: 'With all my love,',
    signature: 'FIRAS',
  },
};
