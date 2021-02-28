import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';
import { AppError } from "../errors/AppError";

class SendEmailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userAlreadyExists = await usersRepository.findOne({ email });

        if (!userAlreadyExists) throw new AppError("User does not exists.");

        const serveyAlreadyExists = await surveysRepository.findOne({ id: survey_id });

        if (!serveyAlreadyExists) throw new AppError("Survey does not exists.");

        //Mail template path
        const nps_path = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        //Check it was sent a survey for the user
        const serveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: { user_id: userAlreadyExists.id, value: null },
            relations: ["user", "survey"]
        });

        const variables = {
            name: userAlreadyExists.name,
            title: serveyAlreadyExists.title,
            description: serveyAlreadyExists.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if (serveyUserAlreadyExists) {
            variables.id = serveyUserAlreadyExists.id;
            await SendMailService.execute(email, serveyAlreadyExists.title, variables, nps_path);
            return response.json(serveyUserAlreadyExists);
        }

        //Sending a new survey
        const surveysUsers = surveysUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id: survey_id,
            value: null
        });

        //Saving on database
        await surveysUsersRepository.save(surveysUsers);
        variables.id = surveysUsers.id;

        //Sending the email
        await SendMailService.execute(email, serveyAlreadyExists.title, variables, nps_path);

        //Response
        return response.status(200).json(surveysUsers);
    }

    async show(request: Request, response: Response) {
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const all = await surveysUsersRepository.find();
        return response.json(all);
    }
}

export { SendEmailController }