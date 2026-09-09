import { prisma } from '@/lib/db';

/**
 * ResourceRetriever
 * Queries resources by concept match with fallbacks to subtopic/chapter.
 */
export async function retrieveResources(conceptId: string, limit: number = 10) {
  const concept = await prisma.concept.findUnique({
    where: { id: conceptId },
    include: {
      subtopic: {
        include: { topic: { include: { chapter: true } } },
      },
    },
  });

  if (!concept) return [];

  // First: exact concept match
  let resources = await prisma.resource.findMany({
    where: { conceptId },
    orderBy: { qualityScore: 'desc' },
  });

  // Fallback: subtopic match
  if (resources.length < limit) {
    const subtopicResources = await prisma.resource.findMany({
      where: {
        subtopicId: concept.subtopicId,
        id: { notIn: resources.map((r) => r.id) },
      },
      orderBy: { qualityScore: 'desc' },
    });
    resources = [...resources, ...subtopicResources];
  }

  // Fallback: chapter match
  if (resources.length < limit) {
    const chapterId = concept.subtopic.topic.chapter.id;
    const chapterResources = await prisma.resource.findMany({
      where: {
        chapterId,
        id: { notIn: resources.map((r) => r.id) },
      },
      orderBy: { qualityScore: 'desc' },
    });
    resources = [...resources, ...chapterResources];
  }

  return resources.slice(0, limit);
}

/**
 * Retrieve resources for prerequisite concepts too.
 */
export async function retrievePrerequisiteResources(conceptId: string) {
  const prereqs = await prisma.prerequisite.findMany({
    where: { conceptId },
    include: { prerequisiteConcept: true },
  });

  const prereqResources = await Promise.all(
    prereqs.map((p) => retrieveResources(p.prerequisiteConceptId, 3))
  );

  return prereqResources.flat();
}
