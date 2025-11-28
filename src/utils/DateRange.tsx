export const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const getTodayRange = () => {
  const today = new Date();
  return { startDate: formatDate(today), endDate: formatDate(today) };
};

export const getWeekRange = () => {
  const today = new Date();
  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - today.getDay());

  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 6);

  return { startDate: formatDate(firstDay), endDate: formatDate(lastDay) };
};

export const getMonthRange = () => {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return { startDate: formatDate(first), endDate: formatDate(last) };
};

export const getYearRange = () => {
  const today = new Date();
  const first = new Date(today.getFullYear(), 0, 1);
  const last = new Date(today.getFullYear(), 11, 31);

  return { startDate: formatDate(first), endDate: formatDate(last) };
};
