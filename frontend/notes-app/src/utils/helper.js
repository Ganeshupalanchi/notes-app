export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";
  const words = name.split(" ");

  let initials = "";
  for (let i = 0; i < 2 && i < words.length; i++) {
    if (words[i][0]) {
      initials += words[i][0];
    }
  }
  return initials.toUpperCase();
};
