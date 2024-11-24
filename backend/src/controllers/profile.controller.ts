import Controller from "@/interfaces/controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";
import { RequestWithUser } from "@/domain/dtos/auth.dto";
import { BaseResponse } from "@/interfaces/base-response";
import { handleRequest } from "../utils/handle-request";
import { upload } from "../utils/storage";
import { validateRequest } from "../middlewares/validate.middleware";
import {
  getProfileSchema,
  updateProfileSchema,
  updateProfileParamsSchema,
} from "../domain/schema/profile.schema";
import ProfileService from "../services/profile.service";

class ProfileController implements Controller {
  public path = "/profile";
  public router = Router();
  private authMiddleware: AuthMiddleware;
  private profileService: ProfileService;

  constructor() {
    this.authMiddleware = new AuthMiddleware();
    this.profileService = new ProfileService();
    this.initRoutes();
  }

  getProfile = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.profileService.getProfile(
        req.user,
        BigInt(req.params.userId)
      ),
      message: "Profile fetched successfully",
    };
  };

  updateProfile = async (req: RequestWithUser): Promise<BaseResponse> => {
    return {
      body: await this.profileService.updateProfile(
        req.user?.id!,
        req.body,
        req.file?.filename
      ),
      message: "Profile updated successfully",
    };
  };

  private initRoutes() {
    this.router.get(
      `${this.path}/:userId`,
      [this.authMiddleware.checkPublicUser, validateRequest(getProfileSchema)],
      handleRequest(this.getProfile)
    );
    this.router.put(
      `${this.path}/:userId`,
      [
        validateRequest(updateProfileParamsSchema),
        this.authMiddleware.checkUserUpload,
        upload.single("file"),
        validateRequest(updateProfileSchema),
      ],
      handleRequest(this.updateProfile)
    );
  }
}

export default ProfileController;
