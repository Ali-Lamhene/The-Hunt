/**
 * Design System Colors - "The Hunt: Jungle Expedition"
 * Organic and contrasted palette for immersion.
 */

const palette = {
  parchment: '#F4EDE0',
  cream: '#FAF6EE',
  inkDark: '#1A0E05',
  inkMid: '#3D2410',
  inkLight: '#7A5C3A',
  inkFaint: '#C4A882',
  hunterRed: '#C0392B',
  preyGreen: '#2D6A4F',
  alertAmber: '#D4830A',
  canopy: '#0D0802', // Very dark for jungle background
};

export const Colors = {
  light: {
    text: palette.inkDark,
    background: palette.parchment,
    tint: palette.inkMid,
    icon: palette.inkDark,
    tabIconDefault: palette.inkDark,
    tabIconSelected: palette.inkMid,
    primary: palette.hunterRed,
    secondary: palette.inkLight,
    accent: palette.alertAmber,
    error: palette.hunterRed,
    surface: palette.cream,
    border: palette.inkFaint,
  },
  dark: {
    text: palette.parchment,
    background: palette.canopy,
    tint: palette.parchment,
    icon: palette.parchment,
    tabIconDefault: palette.inkFaint,
    tabIconSelected: palette.parchment,
    primary: palette.hunterRed,
    secondary: palette.inkMid,
    accent: palette.alertAmber,
    error: palette.hunterRed,
    surface: palette.inkDark,
    border: palette.inkLight,
  },
};
