import fourMathDomains from './fourMathDomains.js';
import howDigitalSatMathWorks from './howDigitalSatMathWorks.js';
import linearInequalities from './linearInequalities.js';
import equationsWithParameters from './equationsWithParameters.js';
import noAndInfiniteSolutions from './noAndInfiniteSolutions.js';
import oneVariableEquations from './oneVariableEquations.js';
import studyWithSatDuel from './studyWithSatDuel.js';
import wordProblemsToEquations from './wordProblemsToEquations.js';

export const STUDY_GUIDE_LESSONS = [
    howDigitalSatMathWorks,
    fourMathDomains,
    studyWithSatDuel,
    oneVariableEquations,
    linearInequalities,
    equationsWithParameters,
    wordProblemsToEquations,
    noAndInfiniteSolutions,
];

export const STUDY_GUIDE_LESSON_BY_SLUG = Object.fromEntries(
    STUDY_GUIDE_LESSONS.map((lesson) => [lesson.slug, lesson]),
);
