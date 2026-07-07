import fourMathDomains from './fourMathDomains.js';
import howDigitalSatMathWorks from './howDigitalSatMathWorks.js';
import studyWithSatDuel from './studyWithSatDuel.js';

export const STUDY_GUIDE_LESSONS = [
    howDigitalSatMathWorks,
    fourMathDomains,
    studyWithSatDuel,
];

export const STUDY_GUIDE_LESSON_BY_SLUG = Object.fromEntries(
    STUDY_GUIDE_LESSONS.map((lesson) => [lesson.slug, lesson]),
);
