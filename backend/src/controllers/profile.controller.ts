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
import { createContentLimiter } from "../config/rateLimiter";

class ProfileController implements Controller {
  /**
   * @swagger
   * /api/profile/{userId}:
   *    get:
   *     summary: This is the endpoint to get profile from the user in the parameter
   *     parameters:
   *       - name: userId
   *         in: path
   *         descriptions: The id of the specific user
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Profile fetched successfully
   *       404:
   *         description: User not found
   *    put:
   *     summary: This is the endpoint to update profile
   *     parameters:
   *       - name: userId
   *         in: path
   *         descriptions: The id of the specific user
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                   id:
   *                     type: string
   *                     example: 9
   *                   username:
   *                     type: string
   *                     example: kratos_222
   *                   name:
   *                     type: string
   *                     example: Kratos Boii
   *                   skills:
   *                     type: string
   *                     example: Yapper
   *                   work_history:
   *                     type: string
   *                     example: hahaah
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *       404:
   *         description: User not Found
   *
   */
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
        req.user?.id,
        BigInt(req.params.userId)
      ),
      message: "Profile fetched successfully",
    };
  };

  updateProfile = async (req: RequestWithUser): Promise<BaseResponse> => {
    if (req.body.profile_photo === null) {
      return {
        body: await this.profileService.updateProfile(
          req.user?.id!,
          req.body,
          null
        ),
        message: "Profile updated successfully",
      };
    }
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
        createContentLimiter,
        validateRequest(updateProfileParamsSchema),
        this.authMiddleware.checkUserUpload,
        upload.single("profile_photo"),
        validateRequest(updateProfileSchema),
      ],
      handleRequest(this.updateProfile)
    );
  }
}

export default ProfileController;
