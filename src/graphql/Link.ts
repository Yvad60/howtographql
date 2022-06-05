import {
  extendType,
  intArg,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from 'nexus';
import { NexusGenObjects } from '../../nexus-typegen';

export const Link = objectType({
  name: 'Link',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('description');
    t.nonNull.string('url');
  },
});

let links: NexusGenObjects['Link'][] = [
  {
    id: 1,
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQl',
  },
  {
    id: 2,
    url: 'graphql.org',
    description: 'GraphQl official website',
  },
];

export const LinkQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('feed', {
      type: 'Link',
      resolve(parent, args, context, info) {
        return links;
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
        let latestId = links.length + 1;
        const newlink = {
          id: latestId,
          description: description,
          url: url,
        };
        links.push(newlink);
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
        const link = links.find((link) => link.id === id);
        if (!link) throw new Error('The link with given id does not exist');
        if (url) link.url = url;
        if (description) link.description = description;
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
        const link = links.find((link) => link.id === id);
        if (!link) return false;
        links = links.filter((link) => link.id !== id);
        return true;
      },
    });
  },
});
