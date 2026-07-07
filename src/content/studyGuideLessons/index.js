import howDigitalSatMathWorks from './howDigitalSatMathWorks.js';

export const STUDY_GUIDE_LESSONS = [
    howDigitalSatMathWorks,
];

export const STUDY_GUIDE_LESSON_BY_SLUG = Object.fromEntries(
    STUDY_GUIDE_LESSONS.map((lesson) => [lesson.slug, lesson]),
);
