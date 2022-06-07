import {
  extendType,
  intArg,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from 'nexus';
import { PrismaClient } from '@prisma/client';

export const Link = objectType({
  name: 'Link',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('description');
    t.nonNull.string('url');
  },
});

export const LinkQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('feed', {
      type: 'Link',
      resolve(parent, args, context) {
        return context.prisma.link.findMany();
      },
    });
  },
});

export const linkMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('postLink', {
      type: 'Link',
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve(parent, args, context) {
        const { description, url } = args;
        const newlink = context.prisma.link.create({
          data: { description, url },
        });
        return newlink;
      },
    });

    t.nonNull.field('updateLink', {
      type: 'Link',
      args: {
        id: nonNull(intArg()),
        url: nullable(stringArg()),
        description: nullable(stringArg()),
      },
      resolve(parent, args, context) {
        const { id, description, url } = args;
        const link = context.prisma.link.update({
          where: { id },
          data: {
            description: description || undefined,
            url: url || undefined,
          },
        });
        return link;
      },
    });

    t.nonNull.field('deleteLink', {
      type: 'Boolean',
      args: {
        id: nonNull(intArg()),
      },
      resolve(parent, args, context) {
        const { id } = args;
        context.prisma.link.findUnique({ where: { id } });
        return true;
      },
    });
  },
});
