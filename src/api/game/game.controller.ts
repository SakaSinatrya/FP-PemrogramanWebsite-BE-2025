import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from 'express';
import { StatusCodes } from 'http-status-codes';

import { type AuthedRequest, SuccessResponse, validateAuth } from '@/common';
import { AdditionalValidation } from '@/utils';

import { GameService } from './game.service';
import GameListRouter from './game-list/game-list.router';
import { GamePaginateQuerySchema, GameTemplateQuerySchema } from './schema';

export const GameController = Router()
  .get(
    '/',
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const query = AdditionalValidation.validate(
          GamePaginateQuerySchema,
          request.query,
        );

        const games = await GameService.getAllGame(query, false);
        const result = new SuccessResponse(
          StatusCodes.OK,
          'Get all game successfully',
          games.data,
          games.meta,
        );

        return response.status(result.statusCode).json(result.json());
      } catch (error) {
        return next(error);
      }
    },
  )
  .get(
    '/private',
    validateAuth({
      allowed_roles: ['SUPER_ADMIN'],
    }),
    async (request: AuthedRequest, response: Response, next: NextFunction) => {
      try {
        const query = AdditionalValidation.validate(
          GamePaginateQuerySchema,
          request.query,
        );

        const games = await GameService.getAllGame(query, true);
        const result = new SuccessResponse(
          StatusCodes.OK,
          'Get all game (private) successfully',
          games.data,
          games.meta,
        );

        return response.status(result.statusCode).json(result.json());
      } catch (error) {
        return next(error);
      }
    },
  )
  .get(
    '/user/:user_id',
    async (
      request: Request<{ user_id: string }>,
      response: Response,
      next: NextFunction,
    ) => {
      try {
        const query = AdditionalValidation.validate(
          GamePaginateQuerySchema,
          request.query,
        );

        const games = await GameService.getAllGame(
          query,
          false,
          request.params.user_id,
        );
        const result = new SuccessResponse(
          StatusCodes.OK,
          'Get all user game successfully',
          games.data,
          games.meta,
        );

        return response.status(result.statusCode).json(result.json());
      } catch (error) {
        return next(error);
      }
    },
  )
  .get(
    '/template',
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const query = AdditionalValidation.validate(
          GameTemplateQuerySchema,
          request.query,
        );
        const templates = await GameService.getAllGameTemplate(query);
        const result = new SuccessResponse(
          StatusCodes.OK,
          'Get all game template successfully',
          templates,
        );

        return response.status(result.statusCode).json(result.json());
      } catch (error) {
        return next(error);
      }
    },
  )
  .use('/game-type', GameListRouter);
