import { prisma } from '@/lib/db';

/**
 * PrerequisiteAnalyzer
 * Walks the prerequisite graph to find root causes of weak concepts.
 * If a student is weak in "Rolling Motion", checks if prerequisites
 * like "Friction" or "Torque" are also weak.
 */

interface PrerequisiteChain {
  conceptId: string;
  conceptName: string;
  prerequisites: {
    conceptId: string;
    conceptName: string;
    isLikelyRoot: boolean;
  }[];
}

export async function analyzePrerequisites(
  weakConceptIds: string[],
  userId: string
): Promise<PrerequisiteChain[]> {
  const chains: PrerequisiteChain[] = [];

  for (const conceptId of weakConceptIds) {
    const concept = await prisma.concept.findUnique({
      where: { id: conceptId },
      include: {
        prerequisites: {
          include: {
            prerequisiteConcept: true,
          },
        },
      },
    });

    if (!concept) continue;

    // Check mastery of prerequisites
    const prereqAnalysis = await Promise.all(
      concept.prerequisites.map(async (prereq) => {
        const knowledgeState = await prisma.knowledgeState.findUnique({
          where: {
            userId_conceptId: {
              userId,
              conceptId: prereq.prerequisiteConceptId,
            },
          },
        });

        // If no knowledge state exists, treat as untested (potentially weak)
        const mastery = knowledgeState?.masteryPercent ?? 0;
        const isLikelyRoot = mastery < 50; // Low mastery on prerequisite = likely root cause

        return {
          conceptId: prereq.prerequisiteConceptId,
          conceptName: prereq.prerequisiteConcept.name,
          isLikelyRoot,
          mastery,
        };
      })
    );

    chains.push({
      conceptId: concept.id,
      conceptName: concept.name,
      prerequisites: prereqAnalysis,
    });
  }

  return chains;
}

/**
 * Walk backwards through prerequisite chains to find the deepest root cause.
 * Returns concept IDs that are likely the foundational gap.
 */
export async function findRootPrerequisites(
  weakConceptIds: string[],
  userId: string,
  maxDepth: number = 3
): Promise<string[]> {
  const roots = new Set<string>();
  const visited = new Set<string>();

  async function walk(conceptId: string, depth: number) {
    if (depth > maxDepth || visited.has(conceptId)) return;
    visited.add(conceptId);

    const prereqs = await prisma.prerequisite.findMany({
      where: { conceptId },
      include: { prerequisiteConcept: true },
    });

    if (prereqs.length === 0) {
      // This is a root concept — check if weak
      roots.add(conceptId);
      return;
    }

    for (const prereq of prereqs) {
      const ks = await prisma.knowledgeState.findUnique({
        where: {
          userId_conceptId: {
            userId,
            conceptId: prereq.prerequisiteConceptId,
          },
        },
      });

      const mastery = ks?.masteryPercent ?? 0;
      if (mastery < 50) {
        // This prerequisite is also weak — keep walking
        await walk(prereq.prerequisiteConceptId, depth + 1);
      }
    }

    // If no prerequisites were weak, this concept itself is the root
    const weakPrereqs = prereqs.filter(async (p) => {
      const ks = await prisma.knowledgeState.findUnique({
        where: {
          userId_conceptId: {
            userId,
            conceptId: p.prerequisiteConceptId,
          },
        },
      });
      return (ks?.masteryPercent ?? 0) < 50;
    });

    if (weakPrereqs.length === 0) {
      roots.add(conceptId);
    }
  }

  for (const cid of weakConceptIds) {
    await walk(cid, 0);
  }

  return Array.from(roots);
}
