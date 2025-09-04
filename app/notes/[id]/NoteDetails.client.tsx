'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetails.module.css';
import { Note } from '@/types/note';

export default function NoteDetailsClient() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, isLoading, isError,error } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

 
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;



  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data?.title}</h2>
        </div>
        <p className={css.content}>{data?.content}</p>
        <small className='tag'>Tag: {data?.tag}</small>
      <br />
        <small className='date'>Created: {data?.createdAt}</small>
      </div>
    </div>
  );
}
