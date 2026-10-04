import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export const getBlogs = async (includeDrafts: boolean) => {
  return prisma.blog.findMany({
    where: includeDrafts ? {} : { published: true },
    orderBy: { createdAt: 'desc' },
  })
}

export const getBlogById = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    throw new AppError('Blog not found', 404);
  }

  return blog;
};

export const createBlog = async (data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published?: boolean;
  thumbnailId?: string;
}) => {
  const existingBlog = await prisma.blog.findUnique({
    where: { slug: data.slug },
  });

  if (existingBlog) {
    throw new AppError('Blog slug already exists', 409);
  }

  return prisma.blog.create({
    data,
  });
};

export const updateBlog = async (
  id: string,
  data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    published?: boolean;
    thumbnailId?: string;
  },
) => {
  const existingBlog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!existingBlog) {
    throw new AppError('Blog not found', 404);
  }

  const existingSlug = await prisma.blog.findFirst({
    where: {
      slug: data.slug,
      NOT: {
        id,
      },
    },
  });

  if (existingSlug) {
    throw new AppError('Blog slug already exists', 409);
  }

  return prisma.blog.update({
    where: { id },
    data,
  });
};

export const deleteBlog = async (id: string) => {
  const existingBlog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!existingBlog) {
    throw new AppError('Blog not found', 404);
  }

  await prisma.blog.delete({
    where: { id },
  });
};