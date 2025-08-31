'use client';

import { Formik, Form, Field, ErrorMessage as FormikError } from 'formik';
import * as Yup from 'yup';
import type { NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag | '';
}

interface NoteFormProps {
  onCancel: () => void;
  onSubmit: (note: { title: string; content: string; tag: NoteTag }) => void;
  submitting?: boolean;
}

const schema = Yup.object({
  title: Yup.string().min(3).max(50).required('Title is required'),
  content: Yup.string().max(500, 'Max 500 characters'),
  tag: Yup.mixed<NoteTag>().oneOf(TAGS as readonly NoteTag[], 'Choose a valid tag').required('Tag is required'),
});

export default function NoteForm({ onCancel, onSubmit, submitting }: NoteFormProps) {
  const initialValues: NoteFormValues = { title: '', content: '', tag: '' };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values, helpers) => {
        onSubmit({ title: values.title, content: values.content, tag: values.tag as NoteTag });
        helpers.setSubmitting(false);
      }}
    >
      {({ isSubmitting, isValid }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <FormikError name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
            <FormikError name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="">Select tag</option>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <FormikError name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={!!submitting || isSubmitting || !isValid}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
