import test from 'node:test';
import assert from 'node:assert/strict';
import {annotationSegments, applyAnnotation, selectedTextRange} from './practiceTestAnnotations.js';

test('annotation ranges remain stable and replace overlapping marks', () => {
    const first = {id: 'one', field: 'passage', start: 2, end: 6, color: 'yellow', underline: 'none'};
    const replacement = {id: 'two', field: 'passage', start: 4, end: 9, color: 'blue', underline: 'solid'};
    const marks = applyAnnotation([first], replacement);

    assert.deepEqual(marks, [replacement]);
    assert.deepEqual(annotationSegments('0123456789', marks, 'passage'), [
        {text: '0123', mark: null},
        {text: '45678', mark: replacement},
        {text: '9', mark: null},
    ]);
    assert.deepEqual(selectedTextRange('Practice text', 'text'), {start: 9, end: 13});
    assert.deepEqual(selectedTextRange('word then word', 'word', 8), {start: 10, end: 14});
});
