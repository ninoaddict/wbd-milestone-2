export interface experienceType {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
}

export interface UpdateProfileInterface {
  name?: string;
  username?: string;
  skills?: string;
  work_history?: experienceType;
}
