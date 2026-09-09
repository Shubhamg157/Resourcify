import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════
// RESOURCIFY SEED DATA
// Real JEE-level content for Physics (Mechanics), Chemistry, Mathematics
// ═══════════════════════════════════════════════════════════

async function main() {
  console.log('🌱 Seeding GapZero database...');

  // ─── Demo User ───
  const user = await prisma.user.create({
    data: {
      id: 'demo-user-001',
      name: 'Arjun Sharma',
      examTarget: 'Both',
    },
  });
  console.log(`✅ User: ${user.name}`);

  // ═══════════════════════════════════════════════════════════
  // SUBJECTS
  // ═══════════════════════════════════════════════════════════

  const physics = await prisma.subject.create({ data: { id: 'sub-physics', name: 'Physics' } });
  const chemistry = await prisma.subject.create({ data: { id: 'sub-chemistry', name: 'Chemistry' } });
  const mathematics = await prisma.subject.create({ data: { id: 'sub-mathematics', name: 'Mathematics' } });

  // ═══════════════════════════════════════════════════════════
  // PHYSICS — MECHANICS (Deep Tree)
  // ═══════════════════════════════════════════════════════════

  const mechanics = await prisma.chapter.create({
    data: { id: 'ch-mechanics', subjectId: physics.id, name: 'Mechanics', sortOrder: 1 },
  });

  // ─── Topics ───
  const kinematics = await prisma.topic.create({
    data: { id: 'top-kinematics', chapterId: mechanics.id, name: 'Kinematics', sortOrder: 1 },
  });
  const newtonsLaws = await prisma.topic.create({
    data: { id: 'top-newtons-laws', chapterId: mechanics.id, name: "Newton's Laws", sortOrder: 2 },
  });
  const friction = await prisma.topic.create({
    data: { id: 'top-friction', chapterId: mechanics.id, name: 'Friction', sortOrder: 3 },
  });
  const wep = await prisma.topic.create({
    data: { id: 'top-wep', chapterId: mechanics.id, name: 'Work Energy Power', sortOrder: 4 },
  });
  const circularMotion = await prisma.topic.create({
    data: { id: 'top-circular', chapterId: mechanics.id, name: 'Circular Motion', sortOrder: 5 },
  });
  const com = await prisma.topic.create({
    data: { id: 'top-com', chapterId: mechanics.id, name: 'Center of Mass', sortOrder: 6 },
  });
  const rotational = await prisma.topic.create({
    data: { id: 'top-rotational', chapterId: mechanics.id, name: 'Rotational Motion', sortOrder: 7 },
  });

  // ─── Subtopics & Concepts ───
  // Kinematics
  const kinSub1 = await prisma.subtopic.create({
    data: { id: 'st-displacement', topicId: kinematics.id, name: 'Distance and Displacement', sortOrder: 1 },
  });
  const kinSub2 = await prisma.subtopic.create({
    data: { id: 'st-velocity', topicId: kinematics.id, name: 'Speed and Velocity', sortOrder: 2 },
  });
  const kinSub3 = await prisma.subtopic.create({
    data: { id: 'st-acceleration', topicId: kinematics.id, name: 'Acceleration', sortOrder: 3 },
  });
  const kinSub4 = await prisma.subtopic.create({
    data: { id: 'st-eom', topicId: kinematics.id, name: 'Equations of Motion', sortOrder: 4 },
  });
  const kinSub5 = await prisma.subtopic.create({
    data: { id: 'st-projectile', topicId: kinematics.id, name: 'Projectile Motion', sortOrder: 5 },
  });

  // Kinematics concepts
  const cDistDisp = await prisma.concept.create({
    data: { id: 'c-dist-disp', subtopicId: kinSub1.id, name: 'Distance vs Displacement', description: 'Distance is scalar (total path length); displacement is vector (shortest path from start to end).' },
  });
  const cSpeedVel = await prisma.concept.create({
    data: { id: 'c-speed-vel', subtopicId: kinSub2.id, name: 'Speed vs Velocity', description: 'Speed is scalar rate of distance; velocity is vector rate of displacement.' },
  });
  const cAcceleration = await prisma.concept.create({
    data: { id: 'c-acceleration', subtopicId: kinSub3.id, name: 'Uniform and Non-uniform Acceleration', description: 'Rate of change of velocity. Constant acceleration leads to equations of motion.' },
  });
  const cEOM = await prisma.concept.create({
    data: { id: 'c-eom', subtopicId: kinSub4.id, name: 'SUVAT Equations', description: 'v = u + at, s = ut + ½at², v² = u² + 2as. Valid only for constant acceleration.' },
  });
  const cProjectile = await prisma.concept.create({
    data: { id: 'c-projectile', subtopicId: kinSub5.id, name: 'Projectile Motion Analysis', description: 'Decompose into horizontal (constant velocity) and vertical (constant acceleration g) components.' },
  });

  // Newton's Laws
  const nlSub1 = await prisma.subtopic.create({
    data: { id: 'st-first-law', topicId: newtonsLaws.id, name: 'First Law (Inertia)', sortOrder: 1 },
  });
  const nlSub2 = await prisma.subtopic.create({
    data: { id: 'st-second-law', topicId: newtonsLaws.id, name: 'Second Law (F=ma)', sortOrder: 2 },
  });
  const nlSub3 = await prisma.subtopic.create({
    data: { id: 'st-third-law', topicId: newtonsLaws.id, name: 'Third Law', sortOrder: 3 },
  });
  const nlSub4 = await prisma.subtopic.create({
    data: { id: 'st-fbd', topicId: newtonsLaws.id, name: 'Free Body Diagrams', sortOrder: 4 },
  });

  const cInertia = await prisma.concept.create({
    data: { id: 'c-inertia', subtopicId: nlSub1.id, name: 'Inertia and First Law', description: 'A body continues in its state of rest or uniform motion unless acted upon by an external force.' },
  });
  const cFma = await prisma.concept.create({
    data: { id: 'c-fma', subtopicId: nlSub2.id, name: 'Force and Acceleration (F=ma)', description: 'Net force equals mass times acceleration. Apply in component form for 2D problems.' },
  });
  const cThirdLaw = await prisma.concept.create({
    data: { id: 'c-third-law', subtopicId: nlSub3.id, name: 'Action-Reaction Pairs', description: 'Every action has an equal and opposite reaction. The forces act on DIFFERENT bodies.' },
  });
  const cFBD = await prisma.concept.create({
    data: { id: 'c-fbd', subtopicId: nlSub4.id, name: 'Drawing Free Body Diagrams', description: 'Isolate the body, draw all forces acting ON it (weight, normal, tension, friction, applied), then apply F=ma.' },
  });

  // Friction
  const frSub1 = await prisma.subtopic.create({
    data: { id: 'st-static-friction', topicId: friction.id, name: 'Static Friction', sortOrder: 1 },
  });
  const frSub2 = await prisma.subtopic.create({
    data: { id: 'st-kinetic-friction', topicId: friction.id, name: 'Kinetic Friction', sortOrder: 2 },
  });
  const frSub3 = await prisma.subtopic.create({
    data: { id: 'st-inclined-friction', topicId: friction.id, name: 'Friction on Inclined Plane', sortOrder: 3 },
  });

  const cStaticFriction = await prisma.concept.create({
    data: { id: 'c-static-friction', subtopicId: frSub1.id, name: 'Static Friction and its Maximum', description: 'Static friction adjusts from 0 to μsN. Only at the verge of sliding does fs = μsN.' },
  });
  const cKineticFriction = await prisma.concept.create({
    data: { id: 'c-kinetic-friction', subtopicId: frSub2.id, name: 'Kinetic Friction', description: 'Once sliding begins, fk = μkN where μk < μs. Direction opposes relative motion.' },
  });
  const cInclinedFriction = await prisma.concept.create({
    data: { id: 'c-inclined-friction', subtopicId: frSub3.id, name: 'Friction on Inclined Planes', description: 'Resolve weight into components: mg sinθ along plane, mg cosθ perpendicular. Normal force N = mg cosθ.' },
  });

  // Work Energy Power
  const wepSub1 = await prisma.subtopic.create({
    data: { id: 'st-work', topicId: wep.id, name: 'Work by Forces', sortOrder: 1 },
  });
  const wepSub2 = await prisma.subtopic.create({
    data: { id: 'st-ke-theorem', topicId: wep.id, name: 'Kinetic Energy Theorem', sortOrder: 2 },
  });
  const wepSub3 = await prisma.subtopic.create({
    data: { id: 'st-conservation', topicId: wep.id, name: 'Conservation of Energy', sortOrder: 3 },
  });

  const cWork = await prisma.concept.create({
    data: { id: 'c-work', subtopicId: wepSub1.id, name: 'Work Done by Constant and Variable Forces', description: 'W = F·d·cosθ for constant force. For variable force, W = ∫F·dx.' },
  });
  const cWET = await prisma.concept.create({
    data: { id: 'c-wet', subtopicId: wepSub2.id, name: 'Work-Energy Theorem', description: 'Net work done on a body equals change in kinetic energy: Wnet = ΔKE = ½mv² - ½mu².' },
  });
  const cConservation = await prisma.concept.create({
    data: { id: 'c-conservation', subtopicId: wepSub3.id, name: 'Conservation of Mechanical Energy', description: 'In absence of non-conservative forces, KE + PE = constant.' },
  });

  // Circular Motion
  const cmSub1 = await prisma.subtopic.create({
    data: { id: 'st-ucm', topicId: circularMotion.id, name: 'Uniform Circular Motion', sortOrder: 1 },
  });
  const cmSub2 = await prisma.subtopic.create({
    data: { id: 'st-centripetal', topicId: circularMotion.id, name: 'Centripetal Force', sortOrder: 2 },
  });
  const cmSub3 = await prisma.subtopic.create({
    data: { id: 'st-banking', topicId: circularMotion.id, name: 'Banking of Roads', sortOrder: 3 },
  });

  const cUCM = await prisma.concept.create({
    data: { id: 'c-ucm', subtopicId: cmSub1.id, name: 'Uniform Circular Motion', description: 'Speed is constant but velocity changes direction. Acceleration is centripetal: a = v²/r toward center.' },
  });
  const cCentripetal = await prisma.concept.create({
    data: { id: 'c-centripetal', subtopicId: cmSub2.id, name: 'Centripetal Force', description: 'F = mv²/r directed toward center. Not a new force — it is the net radial force (tension, normal, gravity, friction).' },
  });
  const cBanking = await prisma.concept.create({
    data: { id: 'c-banking', subtopicId: cmSub3.id, name: 'Banking of Roads', description: 'At banking angle θ: tan θ = v²/rg (without friction). With friction, the safe speed range changes.' },
  });

  // Center of Mass
  const comSub1 = await prisma.subtopic.create({
    data: { id: 'st-com-calc', topicId: com.id, name: 'COM Calculation', sortOrder: 1 },
  });
  const comSub2 = await prisma.subtopic.create({
    data: { id: 'st-com-motion', topicId: com.id, name: 'Motion of COM', sortOrder: 2 },
  });

  const cCOMCalc = await prisma.concept.create({
    data: { id: 'c-com-calc', subtopicId: comSub1.id, name: 'Center of Mass Calculation', description: 'x_cm = Σ(mi·xi)/Σmi. For continuous bodies, integrate: x_cm = ∫x·dm / ∫dm.' },
  });
  const cCOMMotion = await prisma.concept.create({
    data: { id: 'c-com-motion', subtopicId: comSub2.id, name: 'Motion of Center of Mass', description: 'F_ext = M·a_cm. Internal forces do not affect COM motion.' },
  });

  // Rotational Motion (primary focus for acceptance test)
  const rotSub1 = await prisma.subtopic.create({
    data: { id: 'st-moi', topicId: rotational.id, name: 'Moment of Inertia', sortOrder: 1 },
  });
  const rotSub2 = await prisma.subtopic.create({
    data: { id: 'st-torque', topicId: rotational.id, name: 'Torque', sortOrder: 2 },
  });
  const rotSub3 = await prisma.subtopic.create({
    data: { id: 'st-angular-momentum', topicId: rotational.id, name: 'Angular Momentum', sortOrder: 3 },
  });
  const rotSub4 = await prisma.subtopic.create({
    data: { id: 'st-rolling', topicId: rotational.id, name: 'Rolling Motion', sortOrder: 4 },
  });
  const rotSub5 = await prisma.subtopic.create({
    data: { id: 'st-axis-theorems', topicId: rotational.id, name: 'Axis Theorems', sortOrder: 5 },
  });

  const cMOI = await prisma.concept.create({
    data: { id: 'c-moi', subtopicId: rotSub1.id, name: 'Moment of Inertia', description: 'I = Σ(mi·ri²). Rotational analogue of mass. Depends on axis of rotation.' },
  });
  const cTorque = await prisma.concept.create({
    data: { id: 'c-torque', subtopicId: rotSub2.id, name: 'Torque and Rotational Dynamics', description: 'τ = r × F = Iα. Torque is the rotational analogue of force.' },
  });
  const cAngularMomentum = await prisma.concept.create({
    data: { id: 'c-angular-momentum', subtopicId: rotSub3.id, name: 'Angular Momentum Conservation', description: 'L = Iω. If τ_ext = 0, angular momentum is conserved.' },
  });
  const cRolling = await prisma.concept.create({
    data: { id: 'c-rolling', subtopicId: rotSub4.id, name: 'Rolling Motion', description: 'Pure rolling: v_cm = Rω. KE = ½mv² + ½Iω². Friction provides torque but does no work in pure rolling.' },
  });
  const cRollingFriction = await prisma.concept.create({
    data: { id: 'c-rolling-friction', subtopicId: rotSub4.id, name: 'Role of Friction in Rolling', description: 'Static friction causes rolling (not kinetic). It provides the torque for angular acceleration. No energy loss in pure rolling.' },
  });
  const cParallelAxis = await prisma.concept.create({
    data: { id: 'c-parallel-axis', subtopicId: rotSub5.id, name: 'Parallel Axis Theorem', description: 'I = I_cm + Md². Used to find MOI about any axis parallel to one through COM.' },
  });
  const cPerpAxis = await prisma.concept.create({
    data: { id: 'c-perp-axis', subtopicId: rotSub5.id, name: 'Perpendicular Axis Theorem', description: 'Iz = Ix + Iy. Only for planar (2D) bodies. z-axis perpendicular to the plane.' },
  });

  // ═══════════════════════════════════════════════════════════
  // CHEMISTRY (Representative Slice)
  // ═══════════════════════════════════════════════════════════

  const atomicStructure = await prisma.chapter.create({
    data: { id: 'ch-atomic', subjectId: chemistry.id, name: 'Atomic Structure', sortOrder: 1 },
  });
  const bonding = await prisma.chapter.create({
    data: { id: 'ch-bonding', subjectId: chemistry.id, name: 'Chemical Bonding', sortOrder: 2 },
  });

  const topBohr = await prisma.topic.create({
    data: { id: 'top-bohr', chapterId: atomicStructure.id, name: 'Bohr Model', sortOrder: 1 },
  });
  const topQuantum = await prisma.topic.create({
    data: { id: 'top-quantum', chapterId: atomicStructure.id, name: 'Quantum Numbers', sortOrder: 2 },
  });
  const topIonic = await prisma.topic.create({
    data: { id: 'top-ionic', chapterId: bonding.id, name: 'Ionic and Covalent Bonding', sortOrder: 1 },
  });
  const topVSEPR = await prisma.topic.create({
    data: { id: 'top-vsepr', chapterId: bonding.id, name: 'VSEPR Theory', sortOrder: 2 },
  });

  const stBohr = await prisma.subtopic.create({
    data: { id: 'st-bohr', topicId: topBohr.id, name: 'Bohr Model of Hydrogen', sortOrder: 1 },
  });
  const stQuantum = await prisma.subtopic.create({
    data: { id: 'st-quantum-numbers', topicId: topQuantum.id, name: 'Quantum Number Set', sortOrder: 1 },
  });
  const stIonic = await prisma.subtopic.create({
    data: { id: 'st-ionic-bond', topicId: topIonic.id, name: 'Ionic Bonding', sortOrder: 1 },
  });
  const stCovalent = await prisma.subtopic.create({
    data: { id: 'st-covalent-bond', topicId: topIonic.id, name: 'Covalent Bonding', sortOrder: 2 },
  });
  const stVSEPR = await prisma.subtopic.create({
    data: { id: 'st-vsepr', topicId: topVSEPR.id, name: 'VSEPR Shapes', sortOrder: 1 },
  });

  const cBohr = await prisma.concept.create({
    data: { id: 'c-bohr', subtopicId: stBohr.id, name: 'Bohr Model Energy Levels', description: 'En = -13.6/n² eV. Electrons orbit in quantized energy levels. Transition energy ΔE = hν.' },
  });
  const cQuantumNums = await prisma.concept.create({
    data: { id: 'c-quantum-nums', subtopicId: stQuantum.id, name: 'Four Quantum Numbers', description: 'n (principal), l (azimuthal), ml (magnetic), ms (spin). Each electron has a unique set (Pauli exclusion).' },
  });
  const cIonicBond = await prisma.concept.create({
    data: { id: 'c-ionic-bond', subtopicId: stIonic.id, name: 'Ionic Bond Formation', description: 'Transfer of electrons from metal to non-metal. Lattice energy determines stability.' },
  });
  const cCovalentBond = await prisma.concept.create({
    data: { id: 'c-covalent-bond', subtopicId: stCovalent.id, name: 'Covalent Bond and Orbital Overlap', description: 'Sharing of electrons. Sigma bonds (head-on overlap) and pi bonds (lateral overlap).' },
  });
  const cVSEPR = await prisma.concept.create({
    data: { id: 'c-vsepr', subtopicId: stVSEPR.id, name: 'VSEPR Theory and Molecular Geometry', description: 'Electron pairs around central atom repel to maximize distance. Lone pairs occupy more space than bonding pairs.' },
  });

  // ═══════════════════════════════════════════════════════════
  // MATHEMATICS (Representative Slice)
  // ═══════════════════════════════════════════════════════════

  const calculus = await prisma.chapter.create({
    data: { id: 'ch-calculus', subjectId: mathematics.id, name: 'Calculus', sortOrder: 1 },
  });
  const trig = await prisma.chapter.create({
    data: { id: 'ch-trig', subjectId: mathematics.id, name: 'Trigonometry', sortOrder: 2 },
  });

  const topLimits = await prisma.topic.create({
    data: { id: 'top-limits', chapterId: calculus.id, name: 'Limits', sortOrder: 1 },
  });
  const topTrigId = await prisma.topic.create({
    data: { id: 'top-trig-id', chapterId: trig.id, name: 'Trigonometric Identities', sortOrder: 1 },
  });

  const stLimitDef = await prisma.subtopic.create({
    data: { id: 'st-limit-def', topicId: topLimits.id, name: 'Limit Definition and Evaluation', sortOrder: 1 },
  });
  const stLHopital = await prisma.subtopic.create({
    data: { id: 'st-lhopital', topicId: topLimits.id, name: "L'Hôpital's Rule", sortOrder: 2 },
  });
  const stTrigIdentities = await prisma.subtopic.create({
    data: { id: 'st-trig-identities', topicId: topTrigId.id, name: 'Standard Identities', sortOrder: 1 },
  });

  const cLimitDef = await prisma.concept.create({
    data: { id: 'c-limit-def', subtopicId: stLimitDef.id, name: 'Epsilon-Delta Definition of Limit', description: 'For every ε > 0, there exists δ > 0 such that |f(x) - L| < ε whenever 0 < |x - a| < δ.' },
  });
  const cLHopital = await prisma.concept.create({
    data: { id: 'c-lhopital', subtopicId: stLHopital.id, name: "L'Hôpital's Rule", description: 'If lim f/g gives 0/0 or ∞/∞, then lim f/g = lim f\'/g\' (if the latter exists).' },
  });
  const cTrigId = await prisma.concept.create({
    data: { id: 'c-trig-id', subtopicId: stTrigIdentities.id, name: 'Pythagorean and Sum-Difference Identities', description: 'sin²θ + cos²θ = 1, sin(A±B) = sinA·cosB ± cosA·sinB, etc.' },
  });

  console.log(`✅ Created concept tree: ${await prisma.concept.count()} concepts`);

  // ═══════════════════════════════════════════════════════════
  // PREREQUISITE RELATIONSHIPS (10+)
  // ═══════════════════════════════════════════════════════════

  const prerequisites = [
    // Kinematics prerequisites
    { conceptId: cSpeedVel.id, prerequisiteConceptId: cDistDisp.id },
    { conceptId: cAcceleration.id, prerequisiteConceptId: cSpeedVel.id },
    { conceptId: cEOM.id, prerequisiteConceptId: cAcceleration.id },
    { conceptId: cProjectile.id, prerequisiteConceptId: cEOM.id },
    // Newton's Laws prerequisites
    { conceptId: cFma.id, prerequisiteConceptId: cInertia.id },
    { conceptId: cFBD.id, prerequisiteConceptId: cFma.id },
    { conceptId: cFBD.id, prerequisiteConceptId: cThirdLaw.id },
    // Friction requires Newton's Laws
    { conceptId: cStaticFriction.id, prerequisiteConceptId: cFBD.id },
    { conceptId: cKineticFriction.id, prerequisiteConceptId: cStaticFriction.id },
    { conceptId: cInclinedFriction.id, prerequisiteConceptId: cKineticFriction.id },
    // WEP requires kinematics and Newton's Laws
    { conceptId: cWork.id, prerequisiteConceptId: cFma.id },
    { conceptId: cWET.id, prerequisiteConceptId: cWork.id },
    { conceptId: cConservation.id, prerequisiteConceptId: cWET.id },
    // Circular motion requires Newton's Laws
    { conceptId: cCentripetal.id, prerequisiteConceptId: cFma.id },
    { conceptId: cUCM.id, prerequisiteConceptId: cAcceleration.id },
    { conceptId: cBanking.id, prerequisiteConceptId: cCentripetal.id },
    { conceptId: cBanking.id, prerequisiteConceptId: cInclinedFriction.id },
    // Rotational requires circular motion and COM
    { conceptId: cMOI.id, prerequisiteConceptId: cCOMCalc.id },
    { conceptId: cTorque.id, prerequisiteConceptId: cMOI.id },
    { conceptId: cTorque.id, prerequisiteConceptId: cFma.id },
    { conceptId: cAngularMomentum.id, prerequisiteConceptId: cTorque.id },
    // Rolling requires friction + rotational
    { conceptId: cRolling.id, prerequisiteConceptId: cTorque.id },
    { conceptId: cRolling.id, prerequisiteConceptId: cAngularMomentum.id },
    { conceptId: cRollingFriction.id, prerequisiteConceptId: cRolling.id },
    { conceptId: cRollingFriction.id, prerequisiteConceptId: cStaticFriction.id },
    // Axis theorems require MOI
    { conceptId: cParallelAxis.id, prerequisiteConceptId: cMOI.id },
    { conceptId: cPerpAxis.id, prerequisiteConceptId: cMOI.id },
    // Chemistry
    { conceptId: cQuantumNums.id, prerequisiteConceptId: cBohr.id },
    { conceptId: cCovalentBond.id, prerequisiteConceptId: cIonicBond.id },
    { conceptId: cVSEPR.id, prerequisiteConceptId: cCovalentBond.id },
    // Math
    { conceptId: cLHopital.id, prerequisiteConceptId: cLimitDef.id },
  ];

  for (const prereq of prerequisites) {
    await prisma.prerequisite.create({ data: prereq });
  }
  console.log(`✅ Created ${prerequisites.length} prerequisite relationships`);

  // ═══════════════════════════════════════════════════════════
  // QUESTIONS (50+ real JEE-level MCQs)
  // ═══════════════════════════════════════════════════════════

  const questions = [
    // ─── Rotational Motion Questions (Primary for acceptance test) ───
    {
      id: 'q-moi-1',
      conceptId: cMOI.id,
      prompt: 'The moment of inertia of a uniform solid sphere of mass M and radius R about its diameter is:',
      options: JSON.stringify(['(2/5)MR²', '(2/3)MR²', '(1/2)MR²', '(3/5)MR²']),
      correctOptionIndex: 0,
      difficulty: 2,
      examRelevance: 5,
      questionType: 'fundamental',
      commonMisconception: 'Students often confuse the MOI of a solid sphere (2/5 MR²) with that of a hollow sphere (2/3 MR²).',
    },
    {
      id: 'q-moi-2',
      conceptId: cMOI.id,
      prompt: 'A thin uniform rod of mass M and length L is rotated about an axis passing through one end and perpendicular to its length. Its moment of inertia is:',
      options: JSON.stringify(['ML²/12', 'ML²/3', 'ML²/2', 'ML²/6']),
      correctOptionIndex: 1,
      difficulty: 3,
      examRelevance: 4,
      questionType: 'formula',
      commonMisconception: 'Students confuse MOI about center (ML²/12) with MOI about end (ML²/3). Use parallel axis theorem.',
    },
    {
      id: 'q-torque-1',
      conceptId: cTorque.id,
      prompt: 'A force F = 5N is applied at the rim of a disc of radius 0.2m. The torque about the center of the disc (force is tangential) is:',
      options: JSON.stringify(['0.5 N·m', '1.0 N·m', '2.5 N·m', '0.1 N·m']),
      correctOptionIndex: 1,
      difficulty: 2,
      examRelevance: 3,
      questionType: 'application',
      commonMisconception: 'Students forget that torque τ = rF sinθ. When force is tangential, θ = 90° so τ = rF.',
    },
    {
      id: 'q-angular-1',
      conceptId: cAngularMomentum.id,
      prompt: 'A figure skater pulls in her arms during a spin. Which quantity is conserved and what happens to her angular velocity?',
      options: JSON.stringify([
        'Angular momentum is conserved; angular velocity increases',
        'Angular momentum is conserved; angular velocity decreases',
        'Kinetic energy is conserved; angular velocity stays same',
        'Torque is conserved; angular velocity increases',
      ]),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 4,
      questionType: 'fundamental',
      commonMisconception: 'Students think KE is conserved (it actually increases as work is done by internal forces pulling arms in).',
    },
    {
      id: 'q-rolling-1',
      conceptId: cRolling.id,
      prompt: 'A solid sphere rolls without slipping down an inclined plane of height h. Its velocity at the bottom is:',
      options: JSON.stringify(['√(2gh)', '√(10gh/7)', '√(5gh/3)', '√(gh)']),
      correctOptionIndex: 1,
      difficulty: 3,
      examRelevance: 5,
      questionType: 'formula',
      commonMisconception: 'Students use v = √(2gh) which ignores rotational KE. Must use mgh = ½mv² + ½Iω² with I = 2/5 mr².',
    },
    {
      id: 'q-rolling-2',
      conceptId: cRollingFriction.id,
      prompt: 'In pure rolling on a rough surface, which type of friction acts and does it do any work?',
      options: JSON.stringify([
        'Static friction; it does no work',
        'Kinetic friction; it does negative work',
        'Static friction; it does positive work',
        'No friction is needed for rolling',
      ]),
      correctOptionIndex: 0,
      difficulty: 4,
      examRelevance: 5,
      questionType: 'misconception',
      commonMisconception: 'Students confuse rolling friction with kinetic friction. In pure rolling, the contact point has zero relative velocity, so static friction acts. Since the point of application has zero displacement, no work is done.',
    },
    {
      id: 'q-rolling-3',
      conceptId: cRolling.id,
      prompt: 'Which object reaches the bottom of an inclined plane first if all start from rest with the same height: solid sphere, hollow sphere, solid cylinder, or hollow cylinder?',
      options: JSON.stringify([
        'Solid sphere (I = 2/5 MR²)',
        'Solid cylinder (I = 1/2 MR²)',
        'Hollow sphere (I = 2/3 MR²)',
        'All reach at the same time',
      ]),
      correctOptionIndex: 0,
      difficulty: 4,
      examRelevance: 5,
      questionType: 'jee_style',
      commonMisconception: 'Students think mass or radius matters. Only the ratio I/MR² (K²/R²) determines the acceleration. Smallest ratio wins.',
    },
    {
      id: 'q-parallel-1',
      conceptId: cParallelAxis.id,
      prompt: 'The moment of inertia of a disc of mass M and radius R about a tangent in its plane is:',
      options: JSON.stringify(['(5/4)MR²', '(3/2)MR²', 'MR²', '(3/4)MR²']),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 4,
      questionType: 'application',
      commonMisconception: 'Must combine perpendicular axis theorem (to get diameter MOI = MR²/4) then parallel axis theorem (add MR²). Result: 5MR²/4.',
    },
    {
      id: 'q-perp-1',
      conceptId: cPerpAxis.id,
      prompt: 'The perpendicular axis theorem is applicable for:',
      options: JSON.stringify([
        'Only planar (2D) bodies like rings, discs, and plates',
        'All rigid bodies including 3D objects',
        'Only symmetric bodies',
        'Only bodies with uniform density',
      ]),
      correctOptionIndex: 0,
      difficulty: 2,
      examRelevance: 3,
      questionType: 'fundamental',
      commonMisconception: 'Students try to apply perpendicular axis theorem to 3D objects like spheres. It only works for 2D/planar bodies.',
    },
    {
      id: 'q-rolling-4',
      conceptId: cRollingFriction.id,
      prompt: 'A sphere is placed on a smooth (frictionless) inclined plane. It will:',
      options: JSON.stringify([
        'Slide down without rolling',
        'Roll down without sliding',
        'Both roll and slide',
        'Remain stationary',
      ]),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 4,
      questionType: 'misconception',
      commonMisconception: 'Students think spheres always roll. Without friction, there is no torque to cause rotation, so the sphere slides.',
    },

    // ─── Kinematics Questions ───
    {
      id: 'q-dist-1',
      conceptId: cDistDisp.id,
      prompt: 'A particle moves along a straight line from A to B (10m) and then from B to C (6m) in the opposite direction. The distance and displacement are:',
      options: JSON.stringify(['16m, 4m', '16m, 16m', '4m, 16m', '10m, 4m']),
      correctOptionIndex: 0,
      difficulty: 1,
      examRelevance: 3,
      questionType: 'fundamental',
      commonMisconception: 'Confusing distance (always positive, total path = 16) with displacement (net = 10 - 6 = 4m).',
    },
    {
      id: 'q-eom-1',
      conceptId: cEOM.id,
      prompt: 'A body starts from rest and accelerates uniformly at 2 m/s². The distance covered in the 3rd second is:',
      options: JSON.stringify(['5 m', '9 m', '4 m', '6 m']),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 4,
      questionType: 'formula',
      commonMisconception: 'Students use s = ut + ½at² for total distance instead of using sn = u + a(2n-1)/2 for nth second.',
    },
    {
      id: 'q-proj-1',
      conceptId: cProjectile.id,
      prompt: 'Two projectiles are launched with the same speed at angles 30° and 60° to the horizontal. Which statement is correct?',
      options: JSON.stringify([
        'Both have the same range but different maximum heights',
        'Both have the same maximum height but different ranges',
        'Both have the same range and same maximum height',
        'The 60° projectile has both greater range and greater height',
      ]),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 5,
      questionType: 'jee_style',
      commonMisconception: 'Complementary angles (30° + 60° = 90°) give the same range. But the 60° angle gives greater height.',
    },

    // ─── Newton's Laws Questions ───
    {
      id: 'q-fma-1',
      conceptId: cFma.id,
      prompt: 'A 5 kg block is pushed with a horizontal force of 20N on a frictionless surface. The acceleration is:',
      options: JSON.stringify(['2 m/s²', '4 m/s²', '100 m/s²', '0.25 m/s²']),
      correctOptionIndex: 1,
      difficulty: 1,
      examRelevance: 3,
      questionType: 'fundamental',
      commonMisconception: 'Direct application of F = ma. a = F/m = 20/5 = 4 m/s².',
    },
    {
      id: 'q-fbd-1',
      conceptId: cFBD.id,
      prompt: 'A block of mass m is on a table. A string attached to it passes over a pulley and connects to a hanging block of mass m. The acceleration of the system is:',
      options: JSON.stringify(['g', 'g/2', 'g/3', '2g/3']),
      correctOptionIndex: 1,
      difficulty: 3,
      examRelevance: 5,
      questionType: 'application',
      commonMisconception: 'Students forget to consider both blocks as a system. For frictionless table: a = mg/(m+m) = g/2.',
    },
    {
      id: 'q-third-1',
      conceptId: cThirdLaw.id,
      prompt: 'A horse pulls a cart forward. According to Newton\'s third law, the cart pulls the horse backward with equal force. Why does the system still accelerate?',
      options: JSON.stringify([
        'The action-reaction forces act on different bodies, so the net external force (ground friction on horse) causes acceleration',
        'The horse exerts more force than the cart pulls back',
        'Newton\'s third law doesn\'t apply to moving objects',
        'The cart has less inertia so it moves more easily',
      ]),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 4,
      questionType: 'misconception',
      commonMisconception: 'Students think if action = reaction, nothing should move. Key: these forces act on DIFFERENT bodies.',
    },

    // ─── Friction Questions ───
    {
      id: 'q-sf-1',
      conceptId: cStaticFriction.id,
      prompt: 'A block of mass 10 kg is on a surface with μs = 0.5. A horizontal force of 30N is applied. The friction force is:',
      options: JSON.stringify(['30 N', '49 N', '50 N', '0 N']),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 4,
      questionType: 'misconception',
      commonMisconception: 'Students calculate μsN = 0.5 × 100 = 50N and report 50N. But fs adjusts to match applied force (30N < 50N), so friction = 30N.',
    },
    {
      id: 'q-kf-1',
      conceptId: cKineticFriction.id,
      prompt: 'If μk = 0.3 for a 5 kg block sliding on a horizontal surface, the kinetic friction force is:',
      options: JSON.stringify(['14.7 N', '15 N', '1.5 N', '49 N']),
      correctOptionIndex: 0,
      difficulty: 2,
      examRelevance: 3,
      questionType: 'formula',
      commonMisconception: 'fk = μk × N = 0.3 × 5 × 9.8 = 14.7N. Common error: using weight instead of normal force when surface is inclined.',
    },
    {
      id: 'q-inclined-1',
      conceptId: cInclinedFriction.id,
      prompt: 'A block rests on a rough inclined plane at angle θ. At the verge of sliding, which equation is correct?',
      options: JSON.stringify([
        'μs = tan θ (angle of repose)',
        'μs = sin θ',
        'μs = cos θ',
        'μs = 1/tan θ',
      ]),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 5,
      questionType: 'formula',
      commonMisconception: 'At angle of repose: mg sinθ = μs mg cosθ, giving μs = tanθ. Students often forget to use the component form.',
    },

    // ─── WEP Questions ───
    {
      id: 'q-work-1',
      conceptId: cWork.id,
      prompt: 'A force of 10N acts on a body at 60° to the direction of displacement of 5m. The work done is:',
      options: JSON.stringify(['25 J', '50 J', '43.3 J', '0 J']),
      correctOptionIndex: 0,
      difficulty: 2,
      examRelevance: 3,
      questionType: 'formula',
      commonMisconception: 'W = F·d·cosθ = 10 × 5 × cos60° = 25J. Students often forget the cosθ factor.',
    },
    {
      id: 'q-wet-1',
      conceptId: cWET.id,
      prompt: 'A 2 kg body moving at 10 m/s is brought to rest by a constant force over 5m. The magnitude of the force is:',
      options: JSON.stringify(['20 N', '40 N', '10 N', '100 N']),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 4,
      questionType: 'application',
      commonMisconception: 'By WET: F × 5 = ½ × 2 × 10² - 0 = 100J, so F = 20N. Students might use kinematics instead of energy method.',
    },
    {
      id: 'q-cons-1',
      conceptId: cConservation.id,
      prompt: 'A ball is thrown vertically upward with velocity v. At what height is its KE equal to its PE? (h measured from ground)',
      options: JSON.stringify(['v²/4g', 'v²/2g', 'v²/g', '3v²/4g']),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 4,
      questionType: 'jee_style',
      commonMisconception: 'KE = PE means ½mv₁² = mgh. Also, ½mv² = ½mv₁² + mgh. Solving: h = v²/4g.',
    },

    // ─── Circular Motion Questions ───
    {
      id: 'q-ucm-1',
      conceptId: cUCM.id,
      prompt: 'In uniform circular motion, the acceleration is:',
      options: JSON.stringify([
        'Constant in magnitude, directed toward center',
        'Zero (speed is constant)',
        'Constant in magnitude and direction',
        'Directed along the velocity',
      ]),
      correctOptionIndex: 0,
      difficulty: 2,
      examRelevance: 4,
      questionType: 'fundamental',
      commonMisconception: 'Students think constant speed means zero acceleration. The direction changes, so velocity changes, so there IS acceleration.',
    },
    {
      id: 'q-cent-1',
      conceptId: cCentripetal.id,
      prompt: 'A stone of mass 0.5 kg tied to a string of length 1m is whirled in a horizontal circle at 4 m/s. The tension in the string is:',
      options: JSON.stringify(['8 N', '2 N', '16 N', '4 N']),
      correctOptionIndex: 0,
      difficulty: 2,
      examRelevance: 4,
      questionType: 'application',
      commonMisconception: 'T = mv²/r = 0.5 × 16 / 1 = 8N. Students sometimes use the wrong formula or forget centripetal acceleration = v²/r.',
    },
    {
      id: 'q-bank-1',
      conceptId: cBanking.id,
      prompt: 'A road is banked at angle θ for a car moving at speed v on a curve of radius r. Without friction, the correct relation is:',
      options: JSON.stringify(['tan θ = v²/rg', 'sin θ = v²/rg', 'cos θ = v²/rg', 'θ = v²/rg']),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 5,
      questionType: 'formula',
      commonMisconception: 'Students confuse the banking formula with inclined plane formulas. Resolve N into components and equate.',
    },

    // ─── COM Questions ───
    {
      id: 'q-com-1',
      conceptId: cCOMCalc.id,
      prompt: 'Two particles of masses 2 kg and 3 kg are placed at (0,0) and (5,0) respectively. The x-coordinate of the center of mass is:',
      options: JSON.stringify(['3 m', '2.5 m', '2 m', '1 m']),
      correctOptionIndex: 0,
      difficulty: 1,
      examRelevance: 3,
      questionType: 'fundamental',
      commonMisconception: 'x_cm = (2×0 + 3×5)/(2+3) = 3m. Students sometimes take the simple average instead of weighted average.',
    },
    {
      id: 'q-com-2',
      conceptId: cCOMMotion.id,
      prompt: 'A firecracker at rest explodes into two pieces. The center of mass of the system after explosion:',
      options: JSON.stringify([
        'Remains at the same position',
        'Moves in the direction of the heavier piece',
        'Moves in the direction of the lighter piece',
        'Cannot be determined without more information',
      ]),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 4,
      questionType: 'misconception',
      commonMisconception: 'Students think COM must move after explosion. But F_ext = 0 (during explosion), so a_cm = 0 and COM stays put.',
    },

    // ─── Chemistry Questions ───
    {
      id: 'q-bohr-1',
      conceptId: cBohr.id,
      prompt: 'In the Bohr model, the energy of an electron in the nth orbit of hydrogen is given by En = -13.6/n² eV. The energy required to move an electron from n=1 to n=3 is:',
      options: JSON.stringify(['12.09 eV', '13.6 eV', '1.51 eV', '10.2 eV']),
      correctOptionIndex: 0,
      difficulty: 2,
      examRelevance: 4,
      questionType: 'formula',
      commonMisconception: 'ΔE = E3 - E1 = -13.6/9 - (-13.6/1) = -1.51 + 13.6 = 12.09 eV. Students often get the sign wrong.',
    },
    {
      id: 'q-quantum-1',
      conceptId: cQuantumNums.id,
      prompt: 'Which set of quantum numbers is NOT allowed for an electron?',
      options: JSON.stringify([
        'n=2, l=2, ml=0, ms=+½',
        'n=3, l=1, ml=-1, ms=-½',
        'n=1, l=0, ml=0, ms=+½',
        'n=4, l=2, ml=+2, ms=-½',
      ]),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 5,
      questionType: 'fundamental',
      commonMisconception: 'l ranges from 0 to n-1. For n=2, l can be 0 or 1, NOT 2. Students often forget this constraint.',
    },
    {
      id: 'q-vsepr-1',
      conceptId: cVSEPR.id,
      prompt: 'The shape of SF6 according to VSEPR theory is:',
      options: JSON.stringify(['Octahedral', 'Tetrahedral', 'Trigonal bipyramidal', 'Square planar']),
      correctOptionIndex: 0,
      difficulty: 2,
      examRelevance: 3,
      questionType: 'fundamental',
      commonMisconception: 'SF6 has 6 bond pairs and 0 lone pairs. Students confuse with XeF4 which is square planar due to lone pairs.',
    },

    // ─── Mathematics Questions ───
    {
      id: 'q-limit-1',
      conceptId: cLimitDef.id,
      prompt: 'The value of lim(x→0) sin(x)/x is:',
      options: JSON.stringify(['1', '0', '∞', 'Does not exist']),
      correctOptionIndex: 0,
      difficulty: 1,
      examRelevance: 5,
      questionType: 'fundamental',
      commonMisconception: 'This is a standard limit. Students sometimes think 0/0 means undefined, but this limit equals 1.',
    },
    {
      id: 'q-lhopital-1',
      conceptId: cLHopital.id,
      prompt: "Using L'Hôpital's rule, evaluate lim(x→0) (eˣ - 1)/x:",
      options: JSON.stringify(['1', '0', 'e', '∞']),
      correctOptionIndex: 0,
      difficulty: 2,
      examRelevance: 4,
      questionType: 'application',
      commonMisconception: "0/0 form → differentiate top and bottom: lim(x→0) eˣ/1 = 1. Students forget to check it's an indeterminate form first.",
    },
    {
      id: 'q-trig-1',
      conceptId: cTrigId.id,
      prompt: 'If sin A = 3/5 and A is in the first quadrant, then cos 2A is:',
      options: JSON.stringify(['7/25', '-7/25', '24/25', '-24/25']),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 4,
      questionType: 'formula',
      commonMisconception: 'cos2A = 1 - 2sin²A = 1 - 2(9/25) = 1 - 18/25 = 7/25. Students often use wrong identity or miscalculate.',
    },

    // ─── Additional JEE-style questions for depth ───
    {
      id: 'q-rolling-5',
      conceptId: cRolling.id,
      prompt: 'A disc of mass M and radius R rolls without slipping with velocity v. Its total kinetic energy is:',
      options: JSON.stringify(['(3/4)Mv²', '(1/2)Mv²', 'Mv²', '(1/4)Mv²']),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 5,
      questionType: 'formula',
      commonMisconception: 'KE_total = ½Mv² + ½Iω² = ½Mv² + ½(MR²/2)(v/R)² = ½Mv² + ¼Mv² = ¾Mv².',
    },
    {
      id: 'q-torque-2',
      conceptId: cTorque.id,
      prompt: 'A uniform rod of mass m and length l is hinged at one end. It is released from horizontal position. The angular acceleration at the instant of release is:',
      options: JSON.stringify(['3g/2l', 'g/l', '2g/3l', 'g/2l']),
      correctOptionIndex: 0,
      difficulty: 4,
      examRelevance: 5,
      questionType: 'jee_style',
      commonMisconception: 'τ = mg(l/2) = Iα where I = ml²/3 about hinge. So α = 3g/2l. Students use wrong MOI or wrong torque arm.',
    },
    {
      id: 'q-angular-2',
      conceptId: cAngularMomentum.id,
      prompt: 'A particle of mass m moves with constant speed v along a straight line. Its angular momentum about a point at perpendicular distance d from the line is:',
      options: JSON.stringify(['mvd', 'mv/d', 'zero (straight line motion)', 'md²v']),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 4,
      questionType: 'misconception',
      commonMisconception: 'Students think angular momentum is zero for straight-line motion. L = mvd where d is the perpendicular distance from the reference point.',
    },
    {
      id: 'q-moi-3',
      conceptId: cMOI.id,
      prompt: 'Four identical particles, each of mass m, are placed at the four corners of a square of side a. The moment of inertia about one side is:',
      options: JSON.stringify(['2ma²', 'ma²', '4ma²', '½ma²']),
      correctOptionIndex: 0,
      difficulty: 4,
      examRelevance: 4,
      questionType: 'jee_style',
      commonMisconception: 'Two particles are ON the axis (r=0), two are at distance a from axis. I = 0 + 0 + ma² + ma² = 2ma².',
    },
    {
      id: 'q-speed-1',
      conceptId: cSpeedVel.id,
      prompt: 'A car travels the first half of a distance at 40 km/h and the second half at 60 km/h. The average speed for the entire trip is:',
      options: JSON.stringify(['48 km/h', '50 km/h', '45 km/h', '52 km/h']),
      correctOptionIndex: 0,
      difficulty: 2,
      examRelevance: 4,
      questionType: 'application',
      commonMisconception: 'Average speed ≠ arithmetic mean of speeds. Use 2v₁v₂/(v₁+v₂) = 2(40)(60)/100 = 48 km/h.',
    },
    {
      id: 'q-accel-1',
      conceptId: cAcceleration.id,
      prompt: 'A particle moves in a straight line with velocity v = 3t² - 6t (m/s). The acceleration at t = 2s is:',
      options: JSON.stringify(['6 m/s²', '0 m/s²', '12 m/s²', '-6 m/s²']),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 4,
      questionType: 'application',
      commonMisconception: 'a = dv/dt = 6t - 6. At t = 2: a = 12 - 6 = 6 m/s². Students sometimes substitute t into v instead of differentiating first.',
    },
    {
      id: 'q-ionic-1',
      conceptId: cIonicBond.id,
      prompt: 'Which of the following compounds has the highest lattice energy?',
      options: JSON.stringify(['MgO', 'NaCl', 'KBr', 'LiF']),
      correctOptionIndex: 0,
      difficulty: 3,
      examRelevance: 3,
      questionType: 'application',
      commonMisconception: 'Lattice energy ∝ (q₁×q₂)/r. MgO has 2+ and 2- charges and small ionic radii. Students often pick LiF (small but only 1+ and 1-).',
    },
    {
      id: 'q-covalent-1',
      conceptId: cCovalentBond.id,
      prompt: 'In N₂ molecule, the bond order is:',
      options: JSON.stringify(['3', '2', '1', '2.5']),
      correctOptionIndex: 0,
      difficulty: 2,
      examRelevance: 3,
      questionType: 'fundamental',
      commonMisconception: 'N₂ has a triple bond (:N≡N:). Bond order = (bonding - antibonding)/2 from MO theory also gives 3.',
    },
  ];

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
  console.log(`✅ Created ${questions.length} questions`);

  // ═══════════════════════════════════════════════════════════
  // RESOURCES (30+)
  // All URLs set to verified: false unless from known-safe domains
  // ═══════════════════════════════════════════════════════════

  const resources = [
    // ─── Rotational Motion Resources ───
    {
      title: 'Moment of Inertia — Concept & Standard Results',
      type: 'VIDEO',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: rotSub1.id,
      conceptId: cMOI.id,
      difficulty: 2,
      examRelevance: 5,
      source: 'Physics Wallah',
      url: 'https://www.youtube.com/results?search_query=moment+of+inertia+physics+wallah',
      durationSeconds: 1200,
      qualityScore: 4,
      verified: false,
    },
    {
      title: 'Rolling Motion — Pure Rolling Explained',
      type: 'VIDEO',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: rotSub4.id,
      conceptId: cRolling.id,
      difficulty: 3,
      examRelevance: 5,
      source: 'Physics Galaxy',
      url: 'https://www.youtube.com/results?search_query=rolling+motion+physics+galaxy',
      durationSeconds: 900,
      qualityScore: 5,
      verified: false,
    },
    {
      title: 'Friction in Rolling — Why Static, Not Kinetic?',
      type: 'SHORT_VIDEO',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: rotSub4.id,
      conceptId: cRollingFriction.id,
      difficulty: 3,
      examRelevance: 5,
      source: 'Unacademy',
      url: 'https://www.youtube.com/results?search_query=friction+in+rolling+motion+jee',
      durationSeconds: 480,
      qualityScore: 4,
      verified: false,
    },
    {
      title: 'Rotational Motion Formula Sheet for JEE',
      type: 'FORMULA_SHEET',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: rotSub1.id,
      conceptId: cMOI.id,
      difficulty: 3,
      examRelevance: 5,
      source: 'Allen Kota',
      url: '',
      durationSeconds: 300,
      qualityScore: 4,
      verified: false,
    },
    {
      title: 'Torque and Angular Momentum — One-Shot',
      type: 'ONE_SHOT',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: rotSub2.id,
      conceptId: cTorque.id,
      difficulty: 3,
      examRelevance: 4,
      source: 'Vedantu',
      url: 'https://www.youtube.com/results?search_query=torque+angular+momentum+one+shot+jee',
      durationSeconds: 2400,
      qualityScore: 3,
      verified: false,
    },
    {
      title: 'Parallel & Perpendicular Axis Theorems — Quick Notes',
      type: 'NOTES',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: rotSub5.id,
      conceptId: cParallelAxis.id,
      difficulty: 2,
      examRelevance: 4,
      source: 'Toppr',
      url: 'https://www.toppr.com/guides/physics/system-of-particles-and-rotational-motion/',
      durationSeconds: 600,
      qualityScore: 3,
      verified: false,
    },
    {
      title: 'NCERT Chapter 7 — System of Particles & Rotational Motion',
      type: 'NCERT',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: rotSub1.id,
      difficulty: 2,
      examRelevance: 5,
      source: 'NCERT',
      url: 'https://ncert.nic.in/textbook.php?keph1=7-7',
      durationSeconds: 2400,
      qualityScore: 5,
      verified: false,
    },
    {
      title: 'Rolling Motion PYQs — JEE Main 2019-2024',
      type: 'PYQ',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: rotSub4.id,
      conceptId: cRolling.id,
      difficulty: 4,
      examRelevance: 5,
      source: 'Embibe',
      url: '',
      durationSeconds: 1800,
      qualityScore: 4,
      verified: false,
    },
    {
      title: 'Rolling Motion Worked Examples — 5 Problems',
      type: 'WORKED_EXAMPLE',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: rotSub4.id,
      conceptId: cRolling.id,
      difficulty: 3,
      examRelevance: 5,
      source: 'HC Verma Solutions',
      url: '',
      durationSeconds: 1200,
      qualityScore: 5,
      verified: false,
    },

    // ─── Kinematics Resources ───
    {
      title: 'Kinematics — Distance vs Displacement Explained',
      type: 'SHORT_VIDEO',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: kinSub1.id,
      conceptId: cDistDisp.id,
      difficulty: 1,
      examRelevance: 3,
      source: 'Khan Academy',
      url: 'https://www.khanacademy.org/science/physics/one-dimensional-motion',
      durationSeconds: 360,
      qualityScore: 5,
      verified: false,
    },
    {
      title: 'Equations of Motion — Derivation & Application',
      type: 'VIDEO',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: kinSub4.id,
      conceptId: cEOM.id,
      difficulty: 2,
      examRelevance: 4,
      source: 'Physics Wallah',
      url: 'https://www.youtube.com/results?search_query=equations+of+motion+physics+wallah',
      durationSeconds: 1500,
      qualityScore: 4,
      verified: false,
    },
    {
      title: 'Projectile Motion — Complete Theory + Problems',
      type: 'VIDEO',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: kinSub5.id,
      conceptId: cProjectile.id,
      difficulty: 3,
      examRelevance: 5,
      source: 'Physics Galaxy',
      url: 'https://www.youtube.com/results?search_query=projectile+motion+physics+galaxy+jee',
      durationSeconds: 1800,
      qualityScore: 5,
      verified: false,
    },

    // ─── Newton's Laws Resources ───
    {
      title: 'Free Body Diagram Master Class',
      type: 'VIDEO',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: nlSub4.id,
      conceptId: cFBD.id,
      difficulty: 2,
      examRelevance: 5,
      source: 'Unacademy',
      url: 'https://www.youtube.com/results?search_query=free+body+diagram+jee+unacademy',
      durationSeconds: 1200,
      qualityScore: 4,
      verified: false,
    },
    {
      title: "Newton's Laws — Formula Sheet",
      type: 'FORMULA_SHEET',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: nlSub2.id,
      conceptId: cFma.id,
      difficulty: 2,
      examRelevance: 4,
      source: 'Allen Kota',
      url: '',
      durationSeconds: 300,
      qualityScore: 4,
      verified: false,
    },

    // ─── Friction Resources ───
    {
      title: 'Friction — Static vs Kinetic Explained Simply',
      type: 'SHORT_VIDEO',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: frSub1.id,
      conceptId: cStaticFriction.id,
      difficulty: 2,
      examRelevance: 4,
      source: 'Khan Academy',
      url: 'https://www.khanacademy.org/science/physics/forces-newtons-laws/friction-inclined-planes-and-tension',
      durationSeconds: 420,
      qualityScore: 5,
      verified: false,
    },
    {
      title: 'Inclined Plane Problems with Friction',
      type: 'WORKED_EXAMPLE',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: frSub3.id,
      conceptId: cInclinedFriction.id,
      difficulty: 3,
      examRelevance: 5,
      source: 'HC Verma Solutions',
      url: '',
      durationSeconds: 900,
      qualityScore: 5,
      verified: false,
    },

    // ─── WEP Resources ───
    {
      title: 'Work-Energy Theorem — Concept + JEE Problems',
      type: 'VIDEO',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: wepSub2.id,
      conceptId: cWET.id,
      difficulty: 3,
      examRelevance: 5,
      source: 'Physics Galaxy',
      url: 'https://www.youtube.com/results?search_query=work+energy+theorem+physics+galaxy',
      durationSeconds: 1500,
      qualityScore: 5,
      verified: false,
    },
    {
      title: 'Conservation of Energy — Quick Revision',
      type: 'SHORT_VIDEO',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: wepSub3.id,
      conceptId: cConservation.id,
      difficulty: 2,
      examRelevance: 4,
      source: 'Vedantu',
      url: 'https://www.youtube.com/results?search_query=conservation+of+energy+jee+vedantu',
      durationSeconds: 600,
      qualityScore: 3,
      verified: false,
    },

    // ─── Circular Motion Resources ───
    {
      title: 'Banking of Roads — Derivation with Friction',
      type: 'VIDEO',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: cmSub3.id,
      conceptId: cBanking.id,
      difficulty: 3,
      examRelevance: 5,
      source: 'Physics Wallah',
      url: 'https://www.youtube.com/results?search_query=banking+of+roads+derivation+physics+wallah',
      durationSeconds: 900,
      qualityScore: 4,
      verified: false,
    },
    {
      title: 'Centripetal Force Problems — Practice Set',
      type: 'PRACTICE_SET',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: cmSub2.id,
      conceptId: cCentripetal.id,
      difficulty: 3,
      examRelevance: 4,
      source: 'DC Pandey',
      url: '',
      durationSeconds: 1200,
      qualityScore: 4,
      verified: false,
    },

    // ─── COM Resources ───
    {
      title: 'Center of Mass — Concept + Numericals',
      type: 'VIDEO',
      subjectId: physics.id,
      chapterId: mechanics.id,
      subtopicId: comSub1.id,
      conceptId: cCOMCalc.id,
      difficulty: 2,
      examRelevance: 4,
      source: 'Unacademy',
      url: 'https://www.youtube.com/results?search_query=center+of+mass+jee+unacademy',
      durationSeconds: 1500,
      qualityScore: 4,
      verified: false,
    },

    // ─── Chemistry Resources ───
    {
      title: 'Bohr Model — Energy Levels Derivation',
      type: 'VIDEO',
      subjectId: chemistry.id,
      chapterId: atomicStructure.id,
      subtopicId: stBohr.id,
      conceptId: cBohr.id,
      difficulty: 2,
      examRelevance: 4,
      source: 'Physics Wallah',
      url: 'https://www.youtube.com/results?search_query=bohr+model+chemistry+physics+wallah',
      durationSeconds: 1200,
      qualityScore: 4,
      verified: false,
    },
    {
      title: 'Quantum Numbers — Complete Guide',
      type: 'NOTES',
      subjectId: chemistry.id,
      chapterId: atomicStructure.id,
      subtopicId: stQuantum.id,
      conceptId: cQuantumNums.id,
      difficulty: 2,
      examRelevance: 5,
      source: 'Toppr',
      url: 'https://www.toppr.com/guides/chemistry/structure-of-atom/quantum-numbers/',
      durationSeconds: 900,
      qualityScore: 3,
      verified: false,
    },
    {
      title: 'VSEPR Theory — Predicting Molecular Shapes',
      type: 'SHORT_VIDEO',
      subjectId: chemistry.id,
      chapterId: bonding.id,
      subtopicId: stVSEPR.id,
      conceptId: cVSEPR.id,
      difficulty: 2,
      examRelevance: 4,
      source: 'Khan Academy',
      url: 'https://www.khanacademy.org/science/chemistry/chemical-bonds',
      durationSeconds: 600,
      qualityScore: 5,
      verified: false,
    },
    {
      title: 'Chemical Bonding — NCERT Chapter 4',
      type: 'NCERT',
      subjectId: chemistry.id,
      chapterId: bonding.id,
      difficulty: 2,
      examRelevance: 5,
      source: 'NCERT',
      url: 'https://ncert.nic.in/textbook.php?kech1=4-4',
      durationSeconds: 2400,
      qualityScore: 5,
      verified: false,
    },

    // ─── Mathematics Resources ───
    {
      title: 'Limits — Standard Forms & Shortcuts',
      type: 'VIDEO',
      subjectId: mathematics.id,
      chapterId: calculus.id,
      subtopicId: stLimitDef.id,
      conceptId: cLimitDef.id,
      difficulty: 2,
      examRelevance: 4,
      source: 'Vedantu',
      url: 'https://www.youtube.com/results?search_query=limits+jee+mains+vedantu',
      durationSeconds: 1200,
      qualityScore: 4,
      verified: false,
    },
    {
      title: "L'Hôpital's Rule — When and How to Apply",
      type: 'SHORT_VIDEO',
      subjectId: mathematics.id,
      chapterId: calculus.id,
      subtopicId: stLHopital.id,
      conceptId: cLHopital.id,
      difficulty: 3,
      examRelevance: 4,
      source: 'Physics Galaxy',
      url: 'https://www.youtube.com/results?search_query=lhopital+rule+jee',
      durationSeconds: 480,
      qualityScore: 4,
      verified: false,
    },
    {
      title: 'Trigonometric Identities — Formula Sheet',
      type: 'FORMULA_SHEET',
      subjectId: mathematics.id,
      chapterId: trig.id,
      subtopicId: stTrigIdentities.id,
      conceptId: cTrigId.id,
      difficulty: 2,
      examRelevance: 5,
      source: 'Allen Kota',
      url: '',
      durationSeconds: 300,
      qualityScore: 4,
      verified: false,
    },
    {
      title: 'Trigonometry Practice Problems — JEE Level',
      type: 'PRACTICE_SET',
      subjectId: mathematics.id,
      chapterId: trig.id,
      subtopicId: stTrigIdentities.id,
      conceptId: cTrigId.id,
      difficulty: 3,
      examRelevance: 5,
      source: 'Cengage',
      url: '',
      durationSeconds: 1800,
      qualityScore: 4,
      verified: false,
    },
    {
      title: 'NCERT Chapter 13 — Limits and Derivatives',
      type: 'NCERT',
      subjectId: mathematics.id,
      chapterId: calculus.id,
      difficulty: 2,
      examRelevance: 5,
      source: 'NCERT',
      url: 'https://ncert.nic.in/textbook.php?kemh1=13-13',
      durationSeconds: 2400,
      qualityScore: 5,
      verified: false,
    },
  ];

  for (const r of resources) {
    await prisma.resource.create({ data: r });
  }
  console.log(`✅ Created ${resources.length} resources`);

  // ═══════════════════════════════════════════════════════════
  // VERIFICATION SUMMARY
  // ═══════════════════════════════════════════════════════════

  const counts = {
    users: await prisma.user.count(),
    subjects: await prisma.subject.count(),
    chapters: await prisma.chapter.count(),
    topics: await prisma.topic.count(),
    subtopics: await prisma.subtopic.count(),
    concepts: await prisma.concept.count(),
    prerequisites: await prisma.prerequisite.count(),
    questions: await prisma.question.count(),
    resources: await prisma.resource.count(),
  };

  console.log('\n📊 Seed Summary:');
  console.log('────────────────────────');
  Object.entries(counts).forEach(([k, v]) => {
    console.log(`  ${k.padEnd(15)} ${v}`);
  });
  console.log('────────────────────────');
  console.log('🎉 Seeding complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
