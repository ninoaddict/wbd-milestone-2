import { experienceType } from "@/domain/interfaces/profile.interface";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseDate = (dateStr: string): Date => {
  if (dateStr === "Present") {
    return new Date();
  }
  const [month, year] = dateStr.split(" ");
  const monthIndex = new Date(Date.parse(`${month} 1`)).getMonth(); // Parse month name to index
  return new Date(Number(year), monthIndex); // Create a Date object
};

export const sortExperiences = (experiences: experienceType[]) => {
  return experiences.sort((a, b) => {
    const startDateA = parseDate(a.startDate);
    const startDateB = parseDate(b.startDate);
    const endDateA = parseDate(a.endDate);
    const endDateB = parseDate(b.endDate);

    // Sort by descending startDate
    if (startDateA > startDateB) return -1;
    if (startDateA < startDateB) return 1;

    // If startDate is the same, sort by descending endDate
    if (endDateA > endDateB) return -1;
    if (endDateA < endDateB) return 1;

    return 0; // Dates are equal
  });
};

export const convertTime = (prevDate: any) => {
  const currDate = new Date();
  const prevDateObj = new Date(prevDate);

  const isSameDay = currDate.toDateString() === prevDateObj.toDateString();

  const isYesterday =
    currDate.getDate() - prevDateObj.getDate() === 1 &&
    currDate.getMonth() === prevDateObj.getMonth();

  if (isSameDay) {
    return prevDateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (isYesterday) {
    return "Yesterday";
  }

  const month = (prevDateObj.getMonth() + 1).toString().padStart(2, "0");
  const date = prevDateObj.getDate().toString().padStart(2, "0");
  return `${month}/${date}`;
};
