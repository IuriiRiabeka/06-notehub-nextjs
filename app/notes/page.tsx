import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import { HydrateClient } from '@/components/TanStackProvider/TanStackProvider';

const PER_PAGE = 12;

export default async function NotesPage() {
  const qc =  getQueryClient();
  await qc.prefetchQuery({
    queryKey: ['notes', { page: 1, perPage: PER_PAGE, search: '' }],
    queryFn: () => fetchNotes({ page: 1, perPage: PER_PAGE }),
  });
  const state = dehydrate(qc);

  return (
    <HydrateClient state={state}>
      <NotesClient />
    </HydrateClient>
  );
}
