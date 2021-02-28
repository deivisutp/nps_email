import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { SurveyController } from "./controllers/SurveyController";
import { SendEmailController } from "./controllers/SendEmailController";
import { AnswerController } from "./controllers/AnswerController";
import { NPSController } from "./controllers/NPSController";

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const sendEmailController = new SendEmailController();
const answerController = new AnswerController();
const npsController = new NPSController();

router.post("/users", userController.create);
router.get("/users", userController.show);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

router.post("/sendEmail", sendEmailController.execute);
router.get("/sendEmail", sendEmailController.show);

router.get("/answers/:value", answerController.execute);

router.get("/nps/:survey_id", npsController.execute);

export { router };