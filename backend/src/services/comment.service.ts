import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

// Public: approved comments only, and never the email address.
export const getApprovedComments = (blogId: string) =>
  prisma.comment.findMany({
    where: { blogId, approved: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, content: true, createdAt: true },
  });

export const createComment = async (
  blogId: string,
  data: { name: string; email: string; content: string },
) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    select: { published: true },
  });

  if (!blog || !blog.published) {
    throw new AppError('Blog not found', 404);
  }

  return prisma.comment.create({
    data: { blogId, ...data },
    select: { id: true },
  });
};

export const getAllComments = () =>
  prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { blog: { select: { title: true } } },
  });

export const setCommentApproved = async (id: string, approved: boolean) => {
  const existing = await prisma.comment.findUnique({ where: { id } });
  if (!existing) throw new AppError('Comment not found', 404);

  return prisma.comment.update({ where: { id }, data: { approved } });
};

export const deleteComment = async (id: string) => {
  const existing = await prisma.comment.findUnique({ where: { id } });
  if (!existing) throw new AppError('Comment not found', 404);

  await prisma.comment.delete({ where: { id } });
};