const calculateCountUnit = (date, timeDimension = "past") => {
  let parts = date.split("=")[1]
  let count = parseInt(parts.replace(/\D/g, '')) || 1;
  let unit = parts.replace(count, '');

  let targetDate = new Date();

  switch (unit) {
    case "d":
      if (timeDimension === "past") {
        targetDate.setDate(targetDate.getDate() - count);
      } else {
        targetDate.setDate(targetDate.getDate() + count);
      }
      break;
    case "w":
      if (timeDimension === "past") {
        targetDate.setDate(targetDate.getDate() - count * 7);
      } else {
        targetDate.setDate(targetDate.getDate() + count * 7);
      }
      break;
    case "m":
      console.log("here");
      if (timeDimension === "past") {
        targetDate.setDate(targetDate.getDate() - count * 30);
      } else {
        targetDate.setDate(targetDate.getDate() + count * 30);
      }
      break;
    case "y":
      if (timeDimension === "past") {
        targetDate.setFullYear(targetDate.getFullYear() - count);
      } else {
        targetDate.setFullYear(targetDate.getFullYear() + count);
      }
      break;
    default:
      // default is day
      if (timeDimension === "past") {
        targetDate.setDate(targetDate.getDate() - count);
      } else {
        targetDate.setDate(targetDate.getDate() + count);
      }
      break;
  }
  // morning
  targetDate.setHours(0, 0, 0, 0);
  return targetDate;
};

export const calculateDateRules = (date, type, fields) => {

  // today, tomorrow, yesterday, future, past
  if (date?.startsWith("past=")) {
    return calculateCountUnit(date, "past");
  } else if (date?.startsWith("future=")) {
    return calculateCountUnit(date, "future");
  } else if (date?.startsWith("field=")) {
    let otherFieldName = date?.split("=")[1];
    let otherFieldValue = fields[otherFieldName];
    return new Date(otherFieldValue)
  }

  switch (date) {
    case "today":
      return new Date();
    case "tomorrow":
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    case "yesterday":
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    case "future":
      return type === "min" ? new Date() : null;
    case "past":
      return type === "max" ? new Date() : null;
    default:
      return new Date(date);
  }
};