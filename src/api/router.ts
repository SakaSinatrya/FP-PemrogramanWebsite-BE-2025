/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-default-export */
import { Router } from 'express';

import { AuthController } from './auth/auth.controller';
import { GameController } from './game/game.controller';
import { UserController } from './user/user.controller';
import { WhackARoboController } from './whack-a-robo/whack-a-robo.controller';

const AppRouter = Router();

AppRouter.use('/auth', AuthController);
AppRouter.use('/user', UserController);
AppRouter.use('/game', GameController);
AppRouter.use('/whack-a-robo', WhackARoboController);

export default AppRouter;
