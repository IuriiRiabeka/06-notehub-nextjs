import axios  from 'axios';
import type { AxiosResponse } from 'axios';
import { Note, NoteInput } from '@/types/note';
axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`;


export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { data }: AxiosResponse<FetchNotesResponse> = await axios.get("/notes", {
    params,
  });
  return data;
};
export const createNote = async (note: NoteInput): Promise<Note> => {
  
  const { data }: AxiosResponse<Note> = await axios.post("/notes", note);
  return data;
};  

export const deleteNote = async (id: string): Promise<{ success: boolean }> => {
  const { data }: AxiosResponse<{ success: boolean }> = await axios.delete(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data }: AxiosResponse<Note> = await axios.get(`/notes/${id}`);
  return data;
};
