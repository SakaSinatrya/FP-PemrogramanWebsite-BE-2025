import { type Prisma, type ROLE } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { v4 } from 'uuid';

import { ErrorResponse, type IQuizJson, prisma } from '@/common';
import { FileManager } from '@/utils';

import { type ICreateQuiz } from './schema';

export abstract class QuizService {
  static async createQuiz(data: ICreateQuiz, user_id: string) {
    await this.existGameCheck(data.name);

    const newQuizId = v4();
    const quizTemplateId = await this.getGameTemplateId();

    let questionWithImageAmount = 0;

    for (const [index, question] of data.questions.entries()) {
      if (!Number.isNaN(question.question_image_array_index))
        questionWithImageAmount++;

      const correctAnswer = question.answers.filter(
        item => item.is_correct === true,
      );
      if (correctAnswer.length !== 1)
        throw new ErrorResponse(
          StatusCodes.BAD_REQUEST,
          `There should be 1 correct answer in question no. ${index + 1}`,
        );
    }

    if (
      data.files_to_upload &&
      questionWithImageAmount !== data.files_to_upload.length
    )
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        'all uploaded file must be used',
      );

    const thumbnailImagePath = await FileManager.upload(
      `game/quiz/${newQuizId}`,
      data.thumbnail_image,
    );

    const imageArray: string[] = [];

    if (data.files_to_upload) {
      for (const image of data.files_to_upload) {
        const newImagePath = await FileManager.upload(
          `game/quiz/${newQuizId}`,
          image,
        );
        imageArray.push(newImagePath);
      }
    }

    const quizJson: IQuizJson = {
      score_per_question: data.score_per_question,
      is_question_randomized: data.is_question_randomized,
      is_answer_randomized: data.is_answer_randomized,
      questions: data.questions.map(question => ({
        question_text: question.question_text,
        question_image: question.question_image_array_index
          ? imageArray[question.question_image_array_index]
          : null,
        answers: question.answers,
      })),
    };

    const newGame = await prisma.games.create({
      data: {
        id: newQuizId,
        game_template_id: quizTemplateId,
        creator_id: user_id,
        name: data.name,
        description: data.description,
        thumbnail_image: thumbnailImagePath,
        is_published: data.is_publish_immediately,
        game_json: quizJson as unknown as Prisma.InputJsonValue, // gunakan ini agar field Json Prisma dapat menerima object JS
      },
      select: {
        id: true, // select id agar tidak semua dikembalikan
      },
    });

    return newGame;
  }

  static async getQuizGameDetail(
    game_id: string,
    user_id: string,
    user_role: ROLE,
  ) {
    const game = await prisma.games.findUnique({
      where: { id: game_id },
      omit: {
        updated_at: true,
        game_template_id: true,
      },
    });

    if (!game) throw new ErrorResponse(StatusCodes.NOT_FOUND, 'Game not found');

    if (user_role !== 'SUPER_ADMIN' && game.creator_id !== user_id)
      throw new ErrorResponse(
        StatusCodes.FORBIDDEN,
        'User cannot access this game',
      );

    return {
      ...game,
      creator_id: undefined,
    };
  }

  private static async existGameCheck(game_name?: string, game_id?: string) {
    const game = await prisma.games.findUnique({
      where: { name: game_name, id: game_id },
      select: { id: true, creator_id: true },
    });

    if (game)
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        'Game name is already exist',
      );

    return game;
  }

  private static async getGameTemplateId() {
    const result = await prisma.gameTemplates.findUnique({
      where: { slug: 'quiz' },
      select: { id: true },
    });

    if (!result)
      throw new ErrorResponse(StatusCodes.NOT_FOUND, 'Game template not found');

    return result.id;
  }
}
