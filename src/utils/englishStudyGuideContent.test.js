import assert from 'node:assert/strict';
import test from 'node:test';
import {ENGLISH_STUDY_GUIDE_LESSONS} from '../content/englishStudyGuideLessons/index.js';
import {ENGLISH_STUDY_GUIDE_MODULES} from '../content/englishStudyGuideModules.js';

test('every published English curriculum page has complete lesson content', () => {
    const publishedPages = ENGLISH_STUDY_GUIDE_MODULES.flatMap((module) =>
        module.pages.filter((page) => page.slug),
    );
    const lessonsBySlug = new Map(ENGLISH_STUDY_GUIDE_LESSONS.map((lesson) => [lesson.slug, lesson]));

    assert.equal(new Set(lessonsBySlug.keys()).size, ENGLISH_STUDY_GUIDE_LESSONS.length);
    assert.deepEqual(
        publishedPages.map((page) => page.slug),
        ENGLISH_STUDY_GUIDE_LESSONS.map((lesson) => lesson.slug),
    );

    for (const page of publishedPages) {
        const lesson = lessonsBySlug.get(page.slug);
        assert.ok(lesson, `Missing lesson for ${page.slug}`);
        assert.equal(lesson.subject, 'english');
        assert.equal(lesson.goals.length, 3);
        assert.equal(lesson.openingCheck.choices.length, 4);
        assert.equal(lesson.workedExample.choices.length, 4);
        assert.equal(lesson.practiceSet.questions.length, 4);

        for (const question of lesson.practiceSet.questions) {
            assert.equal(question.choices.length, 4, `${question.id} should have four choices`);
            assert.ok(question.answer >= 0 && question.answer <= 3, `${question.id} has an invalid answer`);
            assert.equal(question.explanation.choices.length, 4, `${question.id} needs a reason for every choice`);
            assert.ok(question.explanation.whyCorrect);
            assert.ok(question.explanation.takeaway);
        }
    }
});
