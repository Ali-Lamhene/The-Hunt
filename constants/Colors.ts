/**
 * Design System Colors - "The Hunt: Jungle Expedition"
 * Organic and contrasted palette for immersion.
 */

const palette = {
  canopy: '#1B3022', // Deep Jungle Green
  earth: '#BC8F4F',  // Sand/Old Paper Ocre
  leather: '#3E2723', // Worn Leather Brown
  gold: '#FFD700',    // Idol Gold
  blood: '#8B0000',   // Predator Blood Red
  river: '#2E5A88',   // River Blue (Stealth)
  parchment: '#F4EBD0', // Light Parchment for backgrounds
  mud: '#2C1E16',     // Darker mud for depth
};

export const Colors = {
  light: {
    text: palette.leather,
    background: palette.parchment,
    tint: palette.earth,
    icon: palette.leather,
    tabIconDefault: palette.leather,
    tabIconSelected: palette.earth,
    primary: palette.canopy,
    secondary: palette.earth,
    accent: palette.gold,
    error: palette.blood,
    surface: '#FFFFFF',
    border: palette.leather,
  },
  dark: {
    text: palette.earth,
    background: palette.canopy,
    tint: palette.gold,
    icon: palette.earth,
    tabIconDefault: palette.earth,
    tabIconSelected: palette.gold,
    primary: palette.canopy,
    secondary: palette.leather,
    accent: palette.gold,
    error: palette.blood,
    surface: palette.mud,
    border: palette.earth,
  },
};
