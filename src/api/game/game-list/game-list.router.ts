/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-default-export */
import { Router } from 'express';

import { PairOrNoPairController } from './pair-or-no-pair/pair-or-no-pair.controller';
import { QuizController } from './quiz/quiz.controller';
import { WhackAMoleController } from './whack-a-mole/whack-a-mole.controller';

const GameListRouter = Router();

GameListRouter.use('/quiz', QuizController);
GameListRouter.use('/pair-or-no-pair', PairOrNoPairController);
GameListRouter.use('/whack-a-mole', WhackAMoleController);

export default GameListRouter;
