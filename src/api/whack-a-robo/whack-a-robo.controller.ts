import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from 'express';
import { StatusCodes } from 'http-status-codes';

import { SuccessResponse } from '@/common';

import { WhackARoboService } from './whack-a-robo.service';

export const WhackARoboController = Router()
  .get(
    '/scores',
    (request: Request, response: Response, next: NextFunction) => {
      try {
        const scores = WhackARoboService.getTopScores();
        const result = new SuccessResponse(
          StatusCodes.OK,
          'Get top scores successfully',
          scores,
        );

        response.status(result.statusCode).json(result);
      } catch (error) {
        next(error);
      }
    },
  )
  .post(
    '/scores',
    (request: Request, response: Response, next: NextFunction) => {
      try {
        const { score } = request.body as { score: number };

        if (score === undefined || score === null) {
          return response.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Score is required',
          });
        }

        const newScore = WhackARoboService.createScore(Number(score));
        const result = new SuccessResponse(
          StatusCodes.CREATED,
          'Score saved successfully',
          newScore,
        );

        response.status(result.statusCode).json(result);
      } catch (error) {
        next(error);
      }
    },
  );
