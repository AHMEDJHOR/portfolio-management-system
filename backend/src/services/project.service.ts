import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export const getProjects = async (
  featured?: boolean,
  page = 1,
  limit = 20,
) => {
  const skip = (page - 1) * limit;

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      ...(featured !== undefined && {
        where: { featured },
      }),
      include: {
        technologies: {
          include: {
            skill: true,
          },
        },
        thumbnail: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.project.count({
      ...(featured !== undefined && {
        where: { featured },
      }),
    }),
  ]);

  return {
    projects,
    total,
  };
};

export const getProjectBySlug = async (slug: string) => {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      technologies: {
        include: {
          skill: true,
        },
      },
      thumbnail: true,
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  return project;
};

export const createProject = async (data: {
  title: string;
  slug: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  thumbnailId?: string;
  skillIds?: string[];
}) => {
  const existingProject = await prisma.project.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existingProject) {
    throw new AppError('A project with this slug already exists', 409);
  }

  if (data.skillIds?.length) {
    const skills = await prisma.skill.findMany({
      where: {
        id: {
          in: data.skillIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (skills.length !== new Set(data.skillIds).size) {
      throw new AppError('One or more skills were not found', 400);
    }
  }

  const { skillIds, thumbnailId, ...projectData } = data;

  return prisma.project.create({
    data: {
      ...projectData,
      ...(thumbnailId && {
        thumbnail: {
          connect: {
            id: thumbnailId,
          },
        },
      }),
      ...(skillIds?.length && {
        technologies: {
          create: skillIds.map((skillId) => ({
            skill: {
              connect: { id: skillId },
            },
          })),
        },
      }),
    },
    include: {
      technologies: {
        include: {
          skill: true,
        },
      },
      thumbnail: true,
    },
  });
};

export const updateProject = async (
  id: string,
  data: {
    title: string;
    slug: string;
    description: string;
    githubUrl?: string;
    liveUrl?: string;
    featured?: boolean;
    thumbnailId?: string;
    skillIds?: string[];
  },
) => {
  const existingProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!existingProject) {
    throw new AppError('Project not found', 404);
  }

  const duplicateProject = await prisma.project.findFirst({
    where: {
      slug: data.slug,
      NOT: {
        id,
      },
    },
  });

  if (duplicateProject) {
    throw new AppError('A project with this slug already exists', 409);
  }

  if (data.skillIds?.length) {
    const skills = await prisma.skill.findMany({
      where: {
        id: {
          in: data.skillIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (skills.length !== new Set(data.skillIds).size) {
      throw new AppError('One or more skills were not found', 400);
    }
  }

  const { skillIds, thumbnailId, ...projectData } = data;

  return prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: { id },
      data: {
        ...projectData,
        ...(thumbnailId !== undefined && {
          thumbnail: thumbnailId
            ? { connect: { id: thumbnailId } }
            : { disconnect: true },
        }),
      },
    });

    if (skillIds !== undefined) {
      await tx.projectTechnology.deleteMany({
        where: {
          projectId: id,
        },
      });

      if (skillIds.length > 0) {
        await tx.projectTechnology.createMany({
          data: skillIds.map((skillId) => ({
            projectId: id,
            skillId,
          })),
        });
      }
    }

    return tx.project.findUniqueOrThrow({
      where: { id },
      include: {
        technologies: {
          include: {
            skill: true,
          },
        },
        thumbnail: true,
      },
    });
  });
};

export const deleteProject = async (id: string) => {
  const existingProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!existingProject) {
    throw new AppError('Project not found', 404);
  }

  await prisma.project.delete({
    where: { id },
  });
};