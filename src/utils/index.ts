export function formatLabel(str: string) {
  if (!str) return "";
  // replace any _ with space
  const spaced = str.replace(/_/g, " ");
  const words = spaced.split(" ");
  return words.map((word, i) => (i === 0 ? capitalizeFirstLetter(word) : word)).join(" ");
}

export function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US");
};
