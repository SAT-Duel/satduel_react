import fourMathDomains from './fourMathDomains.js';
import howDigitalSatMathWorks from './howDigitalSatMathWorks.js';
import interceptsAsStartingValues from './interceptsAsStartingValues.js';
import linearInequalities from './linearInequalities.js';
import equationsWithParameters from './equationsWithParameters.js';
import completingTheSquare from './completingTheSquare.js';
import discriminantMeaning from './discriminantMeaning.js';
import factoringPatterns from './factoringPatterns.js';
import noAndInfiniteSolutions from './noAndInfiniteSolutions.js';
import oneVariableEquations from './oneVariableEquations.js';
import parallelAndPerpendicularLines from './parallelAndPerpendicularLines.js';
import quadraticForms from './quadraticForms.js';
import quadraticFormula from './quadraticFormula.js';
import quadraticSystems from './quadraticSystems.js';
import quadraticWordProblems from './quadraticWordProblems.js';
import slopeAsRateOfChange from './slopeAsRateOfChange.js';
import studyWithSatDuel from './studyWithSatDuel.js';
import systemsAsIntersections from './systemsAsIntersections.js';
import tablesToEquations from './tablesToEquations.js';
import parabolaTransformations from './parabolaTransformations.js';
import vertexAxisSymmetry from './vertexAxisSymmetry.js';
import wordProblemsToEquations from './wordProblemsToEquations.js';
import zerosInterceptsRoots from './zerosInterceptsRoots.js';

export const STUDY_GUIDE_LESSONS = [
    howDigitalSatMathWorks,
    fourMathDomains,
    studyWithSatDuel,
    oneVariableEquations,
    linearInequalities,
    equationsWithParameters,
    wordProblemsToEquations,
    noAndInfiniteSolutions,
    slopeAsRateOfChange,
    interceptsAsStartingValues,
    tablesToEquations,
    systemsAsIntersections,
    parallelAndPerpendicularLines,
    quadraticForms,
    factoringPatterns,
    completingTheSquare,
    quadraticFormula,
    discriminantMeaning,
    zerosInterceptsRoots,
    vertexAxisSymmetry,
    parabolaTransformations,
    quadraticWordProblems,
    quadraticSystems,
];

export const STUDY_GUIDE_LESSON_BY_SLUG = Object.fromEntries(
    STUDY_GUIDE_LESSONS.map((lesson) => [lesson.slug, lesson]),
);
