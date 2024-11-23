import Controller from "@/interfaces/controller";
import { Router } from "express";

class ProfileController implements Controller {
  public path = "/profile";
  public router = Router();
}

export default ProfileController;
