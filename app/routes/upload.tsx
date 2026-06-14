import { useState, useRef } from "react";
import type { Route } from "./+types/upload";
import { useRole } from "../context/role-context";
import { PermissionGate } from "../components/permission-gate";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Upload Profile — Demo" }];
}

type Stage = "idle" | "parsing" | "review" | "saved";

interface ExtractedField {
  key: string;
  label: string;
  value: string;
  confidence: number;
}

const MOCK_EXTRACTED: ExtractedField[] = [
  { key: "employeeId", label: "Employee ID", value: "CRC0009", confidence: 0.95 },
  { key: "name", label: "Name", value: "Pitchaya Nuanjam", confidence: 0.98 },
  { key: "email", label: "Email", value: "pitchaya.n@crc.co.th", confidence: 0.9 },
  { key: "currentRole", label: "Current Role", value: "Senior Marketing Executive", confidence: 0.85 },
  { key: "department", label: "Department", value: "Marketing", confidence: 0.88 },
  { key: "businessUnit", label: "Business Unit", value: "CDS", confidence: 0.92 },
  { key: "jobFunction", label: "Function", value: "Marketing", confidence: 0.9 },
  { key: "jobLevel", label: "Job Level", value: "JG15", confidence: 0.6 },
  { key: "talentType", label: "Talent Type", value: "Pipeline", confidence: 0.55 },
  { key: "education", label: "Education", value: "BBA, Chulalongkorn University (2019)", confidence: 0.93 },
];

export default function Upload() {
  const { role } = useRole();

  return (
    <PermissionGate
      requires={(r) => r.canUpload}
      deniedMessage="Upload Restricted"
    >
      <UploadContent />
    </PermissionGate>
  );
}

function UploadContent() {
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [fields, setFields] = useState<ExtractedField[]>(MOCK_EXTRACTED);
  const [isExistingEmployee, setIsExistingEmployee] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setFileName(file.name);
    setStage("parsing");
    setTimeout(() => {
      const existingId = "CRC0009";
      const empIdField = MOCK_EXTRACTED.find((f) => f.key === "employeeId");
      setIsExistingEmployee(empIdField?.value === existingId);
      setStage("review");
    }, 2500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSave = () => {
    setStage("saved");
  };

  const handleReset = () => {
    setStage("idle");
    setFileName("");
    setFields(MOCK_EXTRACTED);
  };

  if (stage === "idle") {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-base-content">
            Upload / Update Profile
          </h2>
          <p className="text-sm text-base-content/60">
            Upload a CV/resume to create or update an employee profile. The
            system extracts structured data for HR review.
          </p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-base-300 bg-base-100 p-8 text-center transition-colors hover:border-primary hover:bg-primary/5"
        >
          <div className="mb-3 text-5xl">&#x1f4c4;</div>
          <p className="text-base font-medium text-base-content">
            Drag and drop a CV here, or click to browse
          </p>
          <p className="mt-1 text-sm text-base-content/50">
            Supports PDF, DOC, DOCX — max 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />
        </div>

        <div className="mt-4 alert alert-info">
          <div className="text-xs text-info-content">
            <strong>Demo note:</strong> File upload is simulated. Any file you
            select will trigger a mock extraction with pre-filled sample data.
            Real AI parsing will be available in Phase 2.
          </div>
        </div>
      </div>
    );
  }

  if (stage === "parsing") {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-base-200 bg-base-100 p-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base font-medium text-base-content">
            Parsing {fileName}...
          </p>
          <p className="mt-1 text-sm text-base-content/50">
            Extracting structured data using AI
            <span className="ml-1 badge badge-ghost badge-xs">mock</span>
          </p>
          <ul className="mt-4 space-y-1 text-xs text-base-content/40">
            <li>&#x2713; Reading document</li>
            <li>&#x2713; Extracting text content</li>
            <li>Identifying fields...</li>
          </ul>
        </div>
      </div>
    );
  }

  if (stage === "review") {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-base-content">
              Review Extracted Data
            </h2>
            <p className="text-sm text-base-content/60">
              Source: <span className="font-medium">{fileName}</span>
            </p>
          </div>
          <button
            onClick={handleReset}
            className="btn btn-ghost btn-sm"
          >
            &larr; Upload different file
          </button>
        </div>

        {/* Match indicator */}
        <div
          className={`mb-4 alert ${isExistingEmployee ? "alert-warning" : "alert-success"}`}
        >
          <div className="text-sm">
            {isExistingEmployee ? (
              <>
                <strong>Existing employee detected:</strong> Employee ID{" "}
                {fields.find((f) => f.key === "employeeId")?.value} already
                exists. Saving will <strong>update</strong> the current record.
              </>
            ) : (
              <>
                <strong>New employee:</strong> This Employee ID does not exist
                yet. Saving will <strong>create</strong> a new record.
              </>
            )}
          </div>
        </div>

        {/* Extracted fields */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-sm font-semibold text-base-content">
                Extracted Fields
              </h3>
              <span className="badge badge-ghost badge-sm">
                AI-extracted (mock)
              </span>
            </div>
            <p className="mb-4 text-xs text-base-content/50">
              Review and edit before saving. Fields with low confidence are
              flagged for attention.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.key}>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-xs font-medium text-base-content/60">
                      {field.label}
                    </label>
                    <ConfidenceBadge confidence={field.confidence} />
                  </div>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => {
                      setFields(
                        fields.map((f) =>
                          f.key === field.key
                            ? { ...f, value: e.target.value }
                            : f,
                        ),
                      );
                    }}
                    className={`input input-bordered input-sm w-full ${
                      field.confidence < 0.7
                        ? "input-warning border-warning"
                        : ""
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Competencies preview */}
            <div className="mt-4">
              <h4 className="mb-2 text-xs font-medium text-base-content/60">
                Competencies (extracted)
              </h4>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  { label: "Leadership", value: 3 },
                  { label: "Management", value: 2 },
                  { label: "Functional", value: 4 },
                  { label: "Future Skills", value: 3 },
                  { label: "Digital", value: 4 },
                  { label: "Culture & Values", value: 4 },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center justify-between rounded-md border border-base-200 px-2 py-1"
                  >
                    <span className="text-xs text-base-content/70">
                      {c.label}
                    </span>
                    <span className="text-xs font-semibold text-base-content">
                      {c.value}/5
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end gap-3">
          <button onClick={handleReset} className="btn btn-ghost btn-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary btn-sm"
          >
            {isExistingEmployee ? "Update Profile" : "Create Profile"}
          </button>
        </div>
      </div>
    );
  }

  // saved
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-success/30 bg-success/5 p-8 text-center">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-4xl text-success">
          &#x2713;
        </div>
        <h2 className="text-lg font-bold text-base-content">
          Profile {isExistingEmployee ? "Updated" : "Created"} Successfully
        </h2>
        <p className="mt-1 text-sm text-base-content/60">
          {isExistingEmployee ? (
            <>
              Employee{" "}
              <strong>{fields.find((f) => f.key === "name")?.value}</strong>{" "}
              (ID:{" "}
              {fields.find((f) => f.key === "employeeId")?.value}) has been
              updated.
            </>
          ) : (
            <>
              New employee{" "}
              <strong>{fields.find((f) => f.key === "name")?.value}</strong>{" "}
              (ID:{" "}
              {fields.find((f) => f.key === "employeeId")?.value}) has been
              created.
            </>
          )}
        </p>
        <div className="mt-2 text-xs text-base-content/40">
          Session-only — no data is persisted in this demo.
        </div>
        <button onClick={handleReset} className="btn btn-primary btn-sm mt-6">
          Upload Another
        </button>
      </div>
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  if (confidence >= 0.8) {
    return (
      <span className="badge badge-success badge-xs" title={`${pct}% confidence`}>
        {pct}%
      </span>
    );
  }
  if (confidence >= 0.65) {
    return (
      <span className="badge badge-warning badge-xs" title={`${pct}% confidence — review recommended`}>
        {pct}% &#x26a0;
      </span>
    );
  }
  return (
    <span className="badge badge-error badge-xs" title={`${pct}% confidence — please verify`}>
      {pct}% &#x26a0;
    </span>
  );
}
