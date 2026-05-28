"use client";

import { FormField, Input } from "@/components/shared/FormField";
import { StaffStudent } from "@/lib/types";

type StudentSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
  results: StaffStudent[];
  onSelect: (student: StaffStudent) => void;
  selectedId?: string;
};

export function StudentSearch({
  query,
  onQueryChange,
  results,
  onSelect,
  selectedId,
}: StudentSearchProps) {
  return (
    <div className="space-y-3">
      <FormField label="Search students" htmlFor="student-search">
        <Input
          id="student-search"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Name, email, or cohort"
        />
      </FormField>
      {query && (
        <ul className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2">
          {results.length === 0 ? (
            <li className="px-2 py-2 text-sm text-slate-500">No students found</li>
          ) : (
            results.map((student) => (
              <li key={student.id}>
                <button
                  type="button"
                  onClick={() => onSelect(student)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-slate-50 ${
                    selectedId === student.id ? "bg-sky-50 font-semibold text-sky-800" : "text-slate-800"
                  }`}
                >
                  {student.name}
                  <span className="ml-2 text-xs text-slate-500">{student.cohort}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
