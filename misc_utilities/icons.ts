
// Each entry: { label, value, icon } where `icon` is the Ionicons outline name used with @expo/vector-icons

export type IconOption = {
  label: string;
  value: number;
  icon: string; // Ionicons outline icon string (use with <Ionicons name={icon} />)
};

const ICONS: IconOption[] = [
  { label: "Hydration", value: 1, icon: "water-outline" },
  { label: "Sleep", value: 2, icon: "bed-outline" },
  { label: "Exercise", value: 3, icon: "barbell-outline" },
  { label: "Walking", value: 4, icon: "walk-outline" },
  { label: "Cycling", value: 5, icon: "bicycle-outline" },
  { label: "Meditation", value: 6, icon: "leaf-outline" },
  { label: "Mindfulness", value: 7, icon: "flower-outline" },
  { label: "Healthy Eating", value: 8, icon: "restaurant-outline" },
  { label: "Vitamins", value: 9, icon: "medkit-outline" },
  { label: "Hygiene", value: 10, icon: "brush-outline" },
  { label: "Productivity", value: 11, icon: "stopwatch-outline" },
  { label: "Focus Session", value: 12, icon: "timer-outline" },
  { label: "Reading", value: 13, icon: "book-outline" },
  { label: "Learning", value: 14, icon: "school-outline" },
  { label: "Study", value: 15, icon: "library-outline" },
  { label: "Work", value: 16, icon: "briefcase-outline" },
  { label: "Finance", value: 17, icon: "cash-outline" },
  { label: "Social", value: 18, icon: "people-outline" },
  { label: "Relationships", value: 19, icon: "heart-outline" },
  { label: "Gratitude", value: 20, icon: "happy-outline" },
  { label: "Creativity", value: 21, icon: "color-palette-outline" },
  { label: "Music", value: 22, icon: "musical-notes-outline" },
  { label: "Entertainment", value: 23, icon: "film-outline" },
  { label: "Gaming", value: 24, icon: "game-controller-outline" },
  { label: "Cleaning", value: 25, icon: "trash-outline" },
  { label: "Gardening", value: 26, icon: "leaf-circle-outline" },
  { label: "Self Care", value: 27, icon: "sparkles-outline" },
  { label: "Photography", value: 28, icon: "camera-outline" },
];

export default ICONS;
