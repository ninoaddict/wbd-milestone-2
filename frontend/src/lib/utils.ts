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
