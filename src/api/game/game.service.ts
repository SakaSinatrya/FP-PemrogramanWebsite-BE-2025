import {
  type Games,
  type GameTemplates,
  type Prisma,
  type Users,
} from '@prisma/client';

import { prisma } from '@/common';
import { paginate } from '@/utils';

import { type IGamePaginateQuery, type IGameTemplateQuery } from './schema';

export abstract class GameService {
  static async getAllGame(
    query: IGamePaginateQuery,
    is_private: boolean,
    user_id?: string,
  ) {
    const args: {
      where: Prisma.GamesWhereInput;
      select: Prisma.GamesSelect;
      orderBy: Prisma.GamesOrderByWithRelationInput[];
    } = {
      where: {
        AND: [
          { is_published: is_private ? undefined : true },
          {
            name: query.search
              ? { contains: query.search, mode: 'insensitive' }
              : undefined,
          },
          { game_template: { slug: query.gameTypeSlug } },
          { creator: { id: user_id } },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail_image: true,
        is_published: is_private,
        game_template: {
          select: {
            slug: true,
          },
        },
        creator: user_id
          ? undefined
          : {
              select: { id: true, username: true },
            },
      },
      orderBy: [
        { name: query.orderByName },
        { total_played: query.orderByPlayAmount },
        {
          liked: query.orderByLikeAmount
            ? { _count: query.orderByLikeAmount }
            : undefined,
        },
        { created_at: query.orderByCreatedAt || 'desc' },
      ],
    };

    const paginationResult = await paginate<
      Games & { creator: Users } & { game_template: GameTemplates },
      typeof args
    >(prisma.games, query.page, query.perPage, args);

    const cleanedResult = paginationResult.data.map(game => ({
      ...game,
      game_template: game.game_template.slug,
      creator: undefined,
      is_published: is_private ? game.is_published : undefined,
      creator_id: user_id ? undefined : game.creator.id,
      creator_name: user_id ? undefined : game.creator.username,
    }));

    return {
      data: cleanedResult,
      meta: paginationResult.meta,
    };
  }

  static async getAllGameTemplate(query: IGameTemplateQuery) {
    const gameTemplates = await prisma.gameTemplates.findMany({
      where: {
        AND: [
          {
            name: query.search
              ? { contains: query.search, mode: 'insensitive' }
              : undefined,
          },
          { is_time_limit_based: query.withTimeLimit },
          { is_life_based: query.withLifeLimit },
        ],
      },
      select: {
        slug: true,
        name: true,
        logo: true,
        id: !query.lite,
        description: !query.lite,
        is_time_limit_based: !query.lite,
        is_life_based: !query.lite,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    return gameTemplates;
  }
}
