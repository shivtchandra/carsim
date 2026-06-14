/** DriveScope design tokens — Active: Japanese Editorial (Bone + Ink + Vermillion) */

export const theme = {
  base: "#F5F1E8",
  accent: "#C84C31",
  accentGlow: "rgba(200, 76, 49, 0.15)",
  textPrimary: "#161616",
  textSecondary: "rgba(22, 22, 22, 0.65)",
  positive: "#2d6a4f",
  negative: "#C84C31",
  warning: "#d97706",
  secondary: "#4F6B8A",

  rooms: {
    plum: "#F5F1E8",
    indigo: "#F5F1E8",
    emerald: "#F5F1E8",
    bronze: "#F5F1E8",
    graphite: "#F5F1E8",
    gold: "#F5F1E8",
  },

  roomAccents: {
    hero: "#C84C31",
    lab: "#C84C31",
    financial: "#C84C31",
    lifecycle: "#C84C31",
    simulation: "#C84C31",
    comparison: "#C84C31",
    luxury: "#C84C31",
  },

  chart: ["#C84C31", "#4F6B8A", "#161616", "rgba(22, 22, 22, 0.45)", "#2d6a4f"],
} as const;

export type RoomMood = keyof typeof theme.roomAccents;

