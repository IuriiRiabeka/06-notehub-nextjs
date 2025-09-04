// components/ErrorMessage/ErrorMessage.tsx
import { ErrorMessage as FormikErrorMessage } from "formik";

interface ErrorMessageProps {
  name: string;
}

export default function ErrorMessage({ name }: ErrorMessageProps) {
  return (
    <FormikErrorMessage
      name={name}
      component="div"
      
    />
  );
}
