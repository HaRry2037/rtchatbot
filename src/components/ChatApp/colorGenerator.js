const colors = [
    '#FF6B6B', // Coral Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Sky Blue
    '#96CEB4', // Sage Green
    '#FFEEAD', // Cream Yellow
    '#D4A5A5', // Dusty Rose
    '#9B59B6', // Purple
    '#3498DB', // Blue
    '#E67E22', // Orange
    '#2ECC71', // Green
    '#F1C40F', // Yellow
    '#E74C3C', // Red
    '#1ABC9C', // Turquoise
    '#9B59B6', // Amethyst
    '#34495E'  // Navy Blue
];

export const generateBackgroundColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
}; 