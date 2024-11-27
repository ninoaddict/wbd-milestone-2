import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";
import { experienceType } from "@/domain/interfaces/profile.interface";

export function EditExperience({
  initExp,
  id,
  handleEditExperience,
  handleDeleteExperience,
}: {
  initExp: experienceType;
  id: number;
  handleEditExperience: (data: experienceType, id: number) => void;
  handleDeleteExperience: (id: number) => void;
}) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currDate = new Date();
  const firstYear = 1923;
  const currMonth = months[currDate.getMonth()];
  const currYear = currDate.getFullYear();

  const years = Array.from({ length: currYear - firstYear + 1 }, (_, i) =>
    (firstYear + i).toString()
  );

  // get initial startDate
  const [initStartMonth, initStartYear] = initExp.startDate.split(" ");

  // get initial endDate
  let initEndMonth = currMonth;
  let initEndYear = currYear.toString();
  const initStillWorking = initExp.endDate === "Present";
  if (!initStillWorking) {
    [initEndMonth, initEndYear] = initExp.endDate.split(" ");
  }

  const [jobTitle, setJobTitle] = useState(initExp.title);
  const [company, setCompany] = useState(initExp.company);
  const [startMonth, setStartMonth] = useState(initStartMonth);
  const [startYear, setStartYear] = useState(initStartYear);
  const [endMonth, setEndMonth] = useState(initEndMonth);
  const [endYear, setEndYear] = useState(initEndYear);
  const [stillWorking, setStillWorking] = useState(initStillWorking);
  const [location, setLocation] = useState(initExp.location);

  const onSubmit = (e: any) => {
    e.preventDefault();
    handleEditExperience(
      {
        title: jobTitle,
        company,
        startDate: `${startMonth} ${startYear}`,
        endDate: stillWorking ? "Present" : `${endMonth} ${endYear}`,
        location: location,
      },
      id
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="mt-2 sm:mt-0">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Experience</DialogTitle>
          <DialogDescription>
            Edit work experience here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form id="edit-exp" onSubmit={onSubmit}>
          <div className="grid gap-5 py-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                className="col-span-3"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                className="col-span-3"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                className="col-span-3"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2 my-2">
              <Checkbox
                id="still"
                defaultChecked={stillWorking}
                onCheckedChange={(value) => {
                  if (value as boolean) {
                    setEndMonth(currMonth);
                    setEndYear(currYear.toString());
                  }
                  setStillWorking(value as boolean);
                }}
              />
              <label
                htmlFor="still"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I am currently working in this role
              </label>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <p>Start Month</p>
                <Select
                  value={startMonth}
                  onValueChange={(value) => {
                    setStartMonth(value);
                  }}
                >
                  <SelectTrigger className="sm:w-[180px] w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => {
                      return (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <p>Start Year</p>
                <Select
                  value={startYear}
                  onValueChange={(value) => {
                    setStartYear(value);
                  }}
                >
                  <SelectTrigger className="sm:w-[180px] w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => {
                      return (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <p>End Month</p>
                <Select
                  value={endMonth}
                  onValueChange={(value) => {
                    setEndMonth(value);
                  }}
                  disabled={stillWorking}
                >
                  <SelectTrigger className="sm:w-[180px] w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => {
                      return (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <p>End Year</p>
                <Select
                  value={endYear}
                  onValueChange={(value) => {
                    setEndYear(value);
                  }}
                  disabled={stillWorking}
                >
                  <SelectTrigger className="sm:w-[180px] w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => {
                      return (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="edit-exp"
            className="bg-[#0a66c2] hover:bg-[#0a66c2a2]"
          >
            Save
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              className="bg-red-500 hover:bg-red-600"
              onClick={(e) => {
                handleDeleteExperience(id);
              }}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
