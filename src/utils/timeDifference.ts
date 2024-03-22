const convertToRelativeTime = (isoDateString: string): string => {
  const now = new Date();
  const pastDate = new Date(isoDateString);
  const diffInSeconds = Math.round((now.getTime() - pastDate.getTime()) / 1000);

  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  } else if (diffInSeconds < 2629800) {
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  } else if (diffInSeconds < 31557600) {
    return `${Math.floor(diffInSeconds / 2629800)} months ago`;
  } else {
    return `${Math.floor(diffInSeconds / 31557600)} years ago`;
  }
};

export default convertToRelativeTime;
