export function secondsToDuration (totalSeconds){

    const hours = Math.floor(totalSeconds/3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let timeString = "";

  if (hours > 0) timeString += `${hours}h `;
  if (minutes > 0) timeString += `${minutes}min `;
  if (seconds > 0 && hours === 0) timeString += `${seconds}sec`;

  return timeString.trim();

}