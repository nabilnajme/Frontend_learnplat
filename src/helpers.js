// helpers.js
export function courseImage(imagePath) {
  if (!imagePath) return null;
  return `http://localhost:8000/storage/${imagePath}`;
}
