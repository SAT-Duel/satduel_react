import assert from 'node:assert/strict';
import test from 'node:test';
import {incompleteOnboardingSections, needsFullOnboarding} from './onboarding.js';

test('only incomplete accounts without a confirmed grade need full onboarding', () => {
    assert.equal(needsFullOnboarding({onboarding_required: true, grade_selected: false}), true);
    assert.equal(needsFullOnboarding({onboarding_required: true}), true);
    assert.equal(needsFullOnboarding({onboarding_required: true, grade_selected: true}), false);
    assert.equal(needsFullOnboarding({onboarding_required: true, grade_selected: true, username_finalized: false}), true);
    assert.equal(needsFullOnboarding({onboarding_required: false, grade_selected: false}), false);
    assert.equal(needsFullOnboarding(), false);
});

test('the short modal contains only unfinished sections', () => {
    assert.deepEqual(incompleteOnboardingSections({
        sat_exam_date_selected: true,
        terms_accepted: false,
        marketing_opt_in: true,
    }), ['privacy']);
    assert.deepEqual(incompleteOnboardingSections({
        sat_exam_date_selected: false,
        terms_accepted: true,
        marketing_opt_in: false,
    }), ['sat-date']);
    assert.deepEqual(incompleteOnboardingSections({
        sat_exam_date_selected: true,
        terms_accepted: true,
        marketing_opt_in: false,
    }), []);
});
