import axios from "axios";
import type { Note, NoteId,} from "../types/note";
export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`;

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;
  const { data } = await axios.get<NotesResponse>("/notes", { params });
  return data;
};

export const createNote = async (
  newNote: Omit<Note, "id" | "createdAt" | "updatedAt">
) => {
  const { data } = await axios.post<Note>("/notes", newNote);
  return data;
};

export const deleteNote = async (noteId: NoteId) => {
  const { data } = await axios.delete<Note>(`/notes/${noteId}`);
  return data;
};