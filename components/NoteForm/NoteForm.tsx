'use client';

import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from "@tanstack/react-query";  
import { createNote } from "@/lib/api";

import type { NoteTag, Note } from '@/types/note';

import { NoteInput } from '@/types/note';
import css from './NoteForm.module.css';

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Work", "Personal", "Meeting", "Shopping", "Todo"])
    .required("Tag is required"),
});
interface NoteFormProps {
  onSubmit: (values: NoteInput) => void;
  onCancel: () => void;
  submitting: boolean;
}
export default function NoteForm({ onSubmit, onCancel, submitting }: NoteFormProps)  {
  const queryClient = useQueryClient();

  const mutation = useMutation({
     mutationFn: (values: NoteInput) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });
  
  return (
    <div className={css.form}>
   <Formik<NoteInput>
        initialValues={{ title: "", content: "", tag: "Work" }}
        validationSchema={validationSchema}
        onSubmit={(values) =>{
     mutation.mutate({
            title: values.title,
            content: values.content,
            tag: values.tag,
          });
  }}
      >
       <Form className={css.form}>
        <label>Title</label>
        <Field name="title" />
        <ErrorMessage name="title" component="div" />

        <label>Content</label>
        <Field as="textarea" name="content" />
        <ErrorMessage name="content" component="div" />

        <label>Tag</label>
        <Field as="select" name="tag">
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="study">Study</option>
          <option value="other">Other</option>
        </Field>
        <ErrorMessage name="tag" component="div" />
<div className={css.actions}>
   <button type="submit" disabled={submitting || mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onCancel} disabled={submitting || mutation.isPending}>
              Cancel
            </button>
</div>
      </Form>
    </Formik>
    </div>
  );
}
