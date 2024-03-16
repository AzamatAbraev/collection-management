function convertTime(timestamp: string): string {
  const dateObj: Date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return dateObj.toLocaleDateString("en-US", options);
}

export default convertTime;
