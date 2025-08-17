import { toast, Toaster } from "react-hot-toast";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchNotes, createNote } from "../services/noteService";
import type { Note } from "../types/note";
import NoteList from "../NoteList/NoteList";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import NoteForm from "../NoteForm/NoteForm";
import type { NotesResponse } from "../services/noteService";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const perPage = 9;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery<NotesResponse>({
    queryKey: ["notes", currentPage, perPage, debouncedSearch],
    queryFn: async () => {
      const result = await fetchNotes(currentPage, perPage, debouncedSearch);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return result;
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
      toast.success("Note created");
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateNoteSubmit = (newNoteData: {
    title: string;
    content: string;
    tag: Note["tag"];
  }) => {
    createNoteMutation.mutate(newNoteData);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const hasResults = !!data?.notes?.length;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div>
      <header>
        <SearchBox onSearch={handleSearch} />
        <button onClick={handleOpenModal}>
          Create note +
        </button>
      </header>
      <main>
        {isLoading && <strong>Loading notes...</strong>}

        {createNoteMutation.isPending && (
          <strong>Creating note...</strong>
        )}

        {isError && <ErrorMessage message="Error loading notes" />}

        {isFetching && !isLoading && <span>Updating notes...</span>}

        {hasResults && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={(selectedItem) => setCurrentPage(selectedItem.selected + 1)}
          />
        )}

        <Toaster position="top-right" />

        {data && !isLoading && <NoteList notes={data.notes ?? []} />}

        {isModalOpen && (
          <Modal onClose={handleCloseModal}>
            <NoteForm
              onCancel={handleCloseModal}
              onSubmit={handleCreateNoteSubmit}
            />
          </Modal>
        )}
      </main>
    </div>
  );
}