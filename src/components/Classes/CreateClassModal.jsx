import React from 'react';
import {Button, Field, Input, ModalShell, Textarea} from '../ui';

const CreateClassModal = ({ visible, onCancel, onCreate, className, setClassName, classDescription, setClassDescription }) => {
  return (
    <ModalShell
      open={visible}
      title="Create New Class"
      onClose={onCancel}
      footer={(
        <>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button onClick={onCreate}>Create Class</Button>
        </>
      )}
    >
      <p className="mb-4 text-sm leading-6 text-slate-500">
        Create a new class to organize your students and assignments
      </p>
      <div className="space-y-4">
        <Field label="Class Name">
          <Input
            placeholder="Period 3 SAT Reading"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
        </Field>
        <Field label="Class Description">
          <Textarea
            placeholder="Optional notes for students"
            value={classDescription}
            onChange={(e) => setClassDescription(e.target.value)}
            rows={3}
          />
        </Field>
      </div>
    </ModalShell>
  );
};

export default CreateClassModal;
