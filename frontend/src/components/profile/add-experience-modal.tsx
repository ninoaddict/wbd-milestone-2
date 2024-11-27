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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { addExperienceSchema } from "@/domain/schema/experience.schema";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";
import { experienceType } from "@/domain/interfaces/profile.interface";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function AddExperience({
  handleAddExperience,
}: {
  handleAddExperience: (data: experienceType) => void;
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

  const [stillWorking, setStillWorking] = useState(true);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof addExperienceSchema>>({
    resolver: zodResolver(addExperienceSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      startMonth: "January",
      startYear: "2024",
      stillWorking: true,
      endMonth: currMonth,
      endYear: currYear.toString(),
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="mt-2 sm:mt-0">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Experience</DialogTitle>
          <DialogDescription>
            Add new work experience here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-exp"
            onSubmit={form.handleSubmit((values) => {
              const startDate = values.startMonth + " " + values.startYear;
              let endDate = "Present";
              if (!values.stillWorking) {
                endDate = values.endMonth + " " + values.endYear;
              }
              const data = {
                title: values.title,
                company: values.company,
                startDate,
                endDate,
                location: values.location,
              };
              handleAddExperience(data);
              setOpen(false);
            })}
            className="grid gap-5 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      className="col-span-3"
                      placeholder="Job Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      className="col-span-3"
                      placeholder="Company Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      className="col-span-3"
                      placeholder="Location"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stillWorking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => {
                        field.onChange(value);
                        setStillWorking(value as boolean);
                      }}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel>I am currently working in this role</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="startMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Month</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="sm:w-[180px] w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="sm:w-[180px] w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((m) => {
                          return (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="endMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Month</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={stillWorking}
                    >
                      <FormControl>
                        <SelectTrigger className="sm:w-[180px] w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={stillWorking}
                    >
                      <FormControl>
                        <SelectTrigger className="sm:w-[180px] w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((m) => {
                          return (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            form="add-exp"
            type="submit"
            className="bg-[#0a66c2] hover:bg-[#0a66c2a2]"
          >
            Create
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              className="border-gray-200 bg-gray-200 border hover:bg-gray-300"
              variant="secondary"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
