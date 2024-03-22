const convertToReadableDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const readableDate = formatter.format(date);

  return readableDate;
};

export default convertToReadableDate;
