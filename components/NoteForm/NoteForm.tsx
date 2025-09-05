'use client';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from "@tanstack/react-query";  
import { createNote } from "@/lib/api";

import type { NoteTag } from '@/types/note';

import { NoteInput } from '@/types/note';
import css from './NoteForm.module.css';

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required").
  min(3, "Title must be at least 3 characters").
  max(50, "Title must be at most 50 characters"),
  content: Yup.string().optional().max(500, "Content must be at most 500 characters"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Work", "Personal", "Meeting", "Shopping", "Todo"])
    .required("Tag is required"),
});
interface NoteFormProps {
  
  onCancel: () => void;
  
  

}
export default function NoteForm({ onCancel }: NoteFormProps) 
 {
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
        <ErrorMessage name="title" />

        <label>Content</label>
        <Field as="textarea" name="content" />
        <ErrorMessage name="content" />

        <label>Tag</label>
        <Field as="select" name="tag">
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Todo">Todo</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </Field>
        <ErrorMessage name="tag" />
<div className={css.actions}>
   <button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Create note"}
            </button>
            <button type="button" onClick={onCancel} disabled={mutation.isPending}>
              Cancel
            </button>
</div>
      </Form>
    </Formik>
    </div>
  );
}
