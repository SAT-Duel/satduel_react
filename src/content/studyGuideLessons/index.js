import absoluteValueEquations from './absoluteValueEquations.js';
import fourMathDomains from './fourMathDomains.js';
import functionNotation from './functionNotation.js';
import howDigitalSatMathWorks from './howDigitalSatMathWorks.js';
import interceptsAsStartingValues from './interceptsAsStartingValues.js';
import linearInequalities from './linearInequalities.js';
import equationsWithParameters from './equationsWithParameters.js';
import equivalentExponentialForms from './equivalentExponentialForms.js';
import exponentialModelInterpretation from './exponentialModelInterpretation.js';
import exponentialTables from './exponentialTables.js';
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
import polynomialStructure from './polynomialStructure.js';
import radicalEquations from './radicalEquations.js';
import rationalEquations from './rationalEquations.js';
import vertexAxisSymmetry from './vertexAxisSymmetry.js';
import wordProblemsToEquations from './wordProblemsToEquations.js';
import zerosInterceptsRoots from './zerosInterceptsRoots.js';
import growthFactors from './growthFactors.js';
import linearVsExponential from './linearVsExponential.js';

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
    functionNotation,
    absoluteValueEquations,
    polynomialStructure,
    rationalEquations,
    radicalEquations,
    growthFactors,
    exponentialTables,
    linearVsExponential,
    equivalentExponentialForms,
    exponentialModelInterpretation,
];

export const STUDY_GUIDE_LESSON_BY_SLUG = Object.fromEntries(
    STUDY_GUIDE_LESSONS.map((lesson) => [lesson.slug, lesson]),
);
