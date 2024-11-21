export const formatCreatedAt = (createdAt) => {
  if (!createdAt) return '';
  const [date, time] = createdAt.split('T');
  return `${date} ${time.slice(0, 8)}`;
};

export const formatDate = (createdAt) => {
  if (!createdAt) return '';
  const [date] = createdAt.split('T');
  return date;
};
