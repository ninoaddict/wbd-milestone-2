export interface experienceDto {
  id?: bigint;
  title: string;
  companyName: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate?: Date;
}
