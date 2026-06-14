import { useRole } from "../context/role-context";

interface PresenterNotesProps {
  notes: string[];
}

export function PresenterNotes({ notes }: PresenterNotesProps) {
  const { notesVisible, toggleNotes } = useRole();

  return (
    <div className="rounded-lg border border-warning/40 bg-warning/10">
      <button
        onClick={toggleNotes}
        className="flex w-full items-center gap-2 px-4 py-2 text-left"
      >
        <span className="text-sm font-semibold text-warning">
          &#x1f4cb; Presenter Notes
        </span>
        <span className="ml-auto text-xs font-medium text-warning/70 underline">
          {notesVisible ? "Hide" : "Show"}
        </span>
      </button>
      {notesVisible && (
        <ul className="space-y-1.5 px-4 pb-3">
          {notes.map((note, i) => (
            <li key={i} className="flex gap-2 text-sm text-warning">
              <span className="font-bold">{i + 1}.</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
