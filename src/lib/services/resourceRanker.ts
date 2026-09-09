import type { Resource } from '@prisma/client';

/**
 * ResourceRanker
 * Ranks resources using this priority order (do not just sort by popularity/rating):
 * 1. Exact concept match
 * 2. Prerequisite concept match
 * 3. Difficulty match (student's level)
 * 4. Shortest duration
 * 5. Source quality score
 * 6. Exam relevance
 *
 * Never surfaces verified=false as top pick without UNVERIFIED tag.
 */

interface RankingContext {
  targetConceptId: string;
  prerequisiteConceptIds: string[];
  studentDifficulty: number; // 1-5, estimated from diagnostic
}

export function rankResources(
  resources: Resource[],
  context: RankingContext
): (Resource & { rankScore: number; unverifiedWarning: boolean })[] {
  const scored = resources.map((resource) => {
    let score = 0;

    // 1. Exact concept match (highest weight)
    if (resource.conceptId === context.targetConceptId) {
      score += 100;
    }

    // 2. Prerequisite concept match
    if (resource.conceptId && context.prerequisiteConceptIds.includes(resource.conceptId)) {
      score += 60;
    }

    // 3. Difficulty match — closer to student level = higher score
    const diffDelta = Math.abs(resource.difficulty - context.studentDifficulty);
    score += Math.max(0, 40 - diffDelta * 10);

    // 4. Shortest duration (prefer SHORT_VIDEO and short content)
    if (resource.durationSeconds > 0 && resource.durationSeconds <= 600) {
      score += 30; // Under 10 minutes = bonus
    } else if (resource.durationSeconds > 0 && resource.durationSeconds <= 1200) {
      score += 15; // Under 20 minutes
    }
    // Penalty for very long content
    if (resource.durationSeconds > 2400) {
      score -= 10;
    }

    // 5. Source quality score
    score += resource.qualityScore * 5;

    // 6. Exam relevance
    score += resource.examRelevance * 3;

    // Type bonuses for recovery context
    if (resource.type === 'SHORT_VIDEO') score += 10;
    if (resource.type === 'WORKED_EXAMPLE') score += 8;
    if (resource.type === 'FORMULA_SHEET') score += 5;

    // Penalty for unverified
    if (!resource.verified) {
      score -= 15;
    }

    return {
      ...resource,
      rankScore: score,
      unverifiedWarning: !resource.verified,
    };
  });

  // Sort by rank score descending
  scored.sort((a, b) => b.rankScore - a.rankScore);

  // If top pick is unverified, check if there's a verified alternative
  if (scored.length > 0 && !scored[0].verified) {
    const firstVerified = scored.find((r) => r.verified);
    if (firstVerified) {
      // Note: we keep the order but flag it — let the UI handle the UNVERIFIED tag
      // The resource is still ranked highest, but UI shows the warning
    }
  }

  return scored;
}

/**
 * Get the best resource for a recovery stack.
 * Returns the top-ranked resource with substitution logic for unavailable ones.
 */
export function getBestResource(
  rankedResources: ReturnType<typeof rankResources>
): { resource: ReturnType<typeof rankResources>[0]; substituted: boolean; message?: string } | null {
  if (rankedResources.length === 0) return null;

  const top = rankedResources[0];

  // If top resource URL is empty or resource is unavailable, substitute
  if (!top.url && rankedResources.length > 1) {
    const next = rankedResources.find((r, i) => i > 0 && r.url);
    if (next) {
      return {
        resource: next,
        substituted: true,
        message: "This resource is currently unavailable. We've selected an alternative.",
      };
    }
  }

  return { resource: top, substituted: false };
}
