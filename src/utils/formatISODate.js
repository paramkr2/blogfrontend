export function formatISODate(isoDate) {
  const dateObj = new Date(isoDate);

  // Extract year, month, day, hour, minute
  const year = dateObj.getFullYear();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[dateObj.getMonth()]; // Get month name
  const day = dateObj.getDate();

  // Format hours and minutes
  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12; // Convert to 12-hour format

  // Get ordinal suffix for the day
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; // Special case for 11th to 20th
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Combine date and time into the desired format
  return `${hours}:${minutes}${ampm} ${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

