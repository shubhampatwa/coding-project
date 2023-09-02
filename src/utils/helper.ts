export const getMinutesDifference = (startTime, endTime) => {
  //create date format
  const timeStart = new Date(`01/01/2000 ${startTime}`).getTime();
  const timeEnd = new Date(`01/01/2000 ${endTime}`).getTime();

  return Math.round((timeEnd - timeStart) / 60 / 1000);
};
