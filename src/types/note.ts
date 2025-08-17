export interface Note {
  id: string;
  title: string;
  content: string;
   createdAt: string;
  updatedAt: string;
  tag: Tag;
}
export type NoteId = Note["id"];
export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
