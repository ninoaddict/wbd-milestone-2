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
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

export function EditSkills({
  initSkills,
  handleEditSkills,
}: {
  initSkills: string[];
  handleEditSkills: (newSkills: string[]) => void;
}) {
  const [skills, setSkills] = useState(initSkills);
  const [newSkill, setNewSkill] = useState("");
  const [open, setOpen] = useState(false);

  function handleChange(id: number, value: string) {
    const newSkills = skills.map((val, idx) => {
      if (idx === id) return value;
      return val;
    });
    setSkills(newSkills);
  }

  function handleAddData() {
    if (!newSkill) return;
    const newSkills = [...skills, newSkill];
    setSkills(newSkills);
    setNewSkill("");
  }

  function handleDelete(id: number) {
    const newSkills = skills.filter((_, idx) => idx !== id);
    setSkills(newSkills);
  }

  function handleSave() {
    for (let i = 0; i < skills.length; i++) {
      if (!skills[i]) {
        return;
      }
    }
    handleEditSkills(skills);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="mt-2 sm:mt-0">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
          <DialogDescription>
            Make changes to your skills here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {skills.map((skill, id) => (
            <div className="flex gap-1" key={id}>
              <Input
                defaultValue={skill}
                onChange={(e) => {
                  handleChange(id, e.target.value);
                }}
                required
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  handleDelete(id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-1">
            <Input
              id="add-photo"
              placeholder="New Skill"
              value={newSkill}
              onChange={(e) => {
                setNewSkill(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddData();
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                handleAddData();
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            className="bg-[#0a66c2] hover:bg-[#0a66c2a2]"
            onClick={handleSave}
          >
            Save changes
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
