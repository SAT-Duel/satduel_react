import React from 'react';
import {Button, Field, Input, ModalShell} from '../ui';

const JoinClassModal = ({ visible, onCancel, onOk, classCode, setClassCode }) => {
  return (
    <ModalShell
      open={visible}
      title="Join Class"
      onClose={onCancel}
      footer={(
        <>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button onClick={onOk}>Join Class</Button>
        </>
      )}
    >
      <p className="mb-4 text-sm leading-6 text-slate-500">
        Enter the 6-digit class code provided by your teacher
      </p>
      <Field label="Class Code">
        <Input
          placeholder="ABC123"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value.toUpperCase())}
          maxLength={6}
          className="uppercase tracking-[0.2em]"
        />
      </Field>
    </ModalShell>
  );
};

export default JoinClassModal;
