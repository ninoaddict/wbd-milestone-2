import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CameraIcon, Trash2, Upload } from "lucide-react";

export default function EditProfilePicture({
  initProfilePicture,
  handleUploadPhoto,
}: {
  initProfilePicture: string;
  handleUploadPhoto: (file: File | null) => void;
}) {
  const [newPicture, setNewPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initProfilePicture
  );
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(initProfilePicture);
  }, [initProfilePicture]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewPicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePicture = () => {
    if (
      previewUrl !== initProfilePicture &&
      previewUrl === "" &&
      newPicture === null
    ) {
      // delete image
      handleUploadPhoto(null);
    } else if (previewUrl !== initProfilePicture && previewUrl && newPicture) {
      // update image
      handleUploadPhoto(newPicture);
    }
    setOpen(false);
    setNewPicture(null);
    setPreviewUrl("");
  };

  const handleDeletePicture = () => {
    setNewPicture(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-1 right-1 cursor-pointer h-8 w-8 p-0 hover:bg-inherit"
        >
          <CameraIcon className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile picture</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <Avatar className="w-36 h-36">
              <AvatarImage
                src={previewUrl || undefined}
                alt="Profile picture"
              />
              <AvatarFallback>{previewUrl ? "Pic" : "No Pic"}</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="picture-upload" className="cursor-pointer">
              <div className="flex justify-center items-center gap-2 p-2 border rounded-md hover:bg-accent">
                <Upload className="w-4 h-4" />
                <span>Upload new picture</span>
              </div>
            </Label>
            <input
              id="picture-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              ref={fileInputRef}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleChangePicture}
            type="submit"
            className="bg-[#0a66c2] hover:bg-[#0a66c2a2]"
          >
            Save changes
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeletePicture}
            disabled={!previewUrl}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
