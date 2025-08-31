import { dehydrate, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';
import { HydrateClient } from '@/components/TanStackProvider/TanStackProvider';

export default async function NoteDetailsPage({ params }: { params: { id: string } }) {
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ['note', params.id],
    queryFn: () => fetchNoteById(params.id),
  });
  const state = dehydrate(qc);

  return (
    <HydrateClient state={state}>
      <NoteDetailsClient />
    </HydrateClient>
  );
}
