'use client';

export default function GlobalError({ error }: { error: Error }) {
  return <p>Something went wrong. {error.message}</p>;
}
