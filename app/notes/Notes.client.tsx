'use client';

import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchNotes, createNote, deleteNote } from '@/lib/api';
import type { FetchNotesResponse } from '@/lib/api';
import type { Note } from '@/types/note';

import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

import css from './NotesPage.module.css';

const PER_PAGE = 12;

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 400);

  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => ['notes', { page, perPage: PER_PAGE, search: debouncedSearch }],
    [page, debouncedSearch]
  );

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey,
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearch || undefined }),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 1;
  const notes = data?.notes ?? [];

  // create
  const createMutation = useMutation({
    mutationFn: (values: Omit<Note, 'id'>) => createNote(values),
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  // delete
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const handleCreate = (values: Omit<Note, 'id'>) => {
    createMutation.mutate(values);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination pageCount={totalPages} currentPage={page} onPageChange={(p) => setPage(p)} />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && notes.length > 0 && (
        <NoteList notes={notes} onDelete={handleDelete} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSubmit={handleCreate}
            submitting={createMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
