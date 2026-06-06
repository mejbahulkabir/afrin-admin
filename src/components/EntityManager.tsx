import { useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api, ApiError } from "../lib/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardBody } from "./ui/card";
import { Modal } from "./ui/modal";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "array" | "select";

export interface FieldConfig {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  helper?: string;
}

export interface EntityRecord {
  id: string;
  [key: string]: unknown;
}

interface Props {
  title: string;
  apiPath: string;
  fields: FieldConfig[];
  listColumns?: string[];
  emptyDefaults?: Record<string, unknown>;
  description?: ReactNode;
}

function makeEmpty(fields: FieldConfig[], overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === "boolean") out[f.key] = false;
    else if (f.type === "number") out[f.key] = 0;
    else if (f.type === "array") out[f.key] = [];
    else out[f.key] = "";
  }
  return { ...out, ...overrides };
}

function serialize(values: Record<string, unknown>, fields: FieldConfig[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = values[f.key];
    if (f.type === "number") out[f.key] = Number(v) || 0;
    else if (f.type === "array") {
      if (Array.isArray(v)) out[f.key] = v;
      else if (typeof v === "string") {
        const parts = v.split("\n").map((s) => s.trim()).filter(Boolean);
        out[f.key] = parts;
      } else out[f.key] = [];
    } else if (f.type === "boolean") out[f.key] = !!v;
    else if (v === "" || v === undefined || v === null) {
      if (f.required) out[f.key] = "";
    } else {
      out[f.key] = v;
    }
  }
  return out;
}

function preview(value: unknown): string {
  if (value == null) return "";
  if (Array.isArray(value)) return `${value.length} items`;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const s = String(value);
  return s.length > 80 ? s.slice(0, 78) + "…" : s;
}

export function EntityManager({
  title,
  apiPath,
  fields,
  listColumns,
  emptyDefaults,
  description,
}: Props) {
  const qc = useQueryClient();
  const queryKey = [apiPath];

  const { data, isLoading } = useQuery<EntityRecord[]>({
    queryKey,
    queryFn: () => api.get<EntityRecord[]>(apiPath),
  });

  const [editing, setEditing] = useState<EntityRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [values, setValues] = useState<Record<string, unknown>>(makeEmpty(fields, emptyDefaults));

  const openCreate = () => {
    setValues(makeEmpty(fields, emptyDefaults));
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (rec: EntityRecord) => {
    const v: Record<string, unknown> = {};
    for (const f of fields) v[f.key] = rec[f.key] ?? (f.type === "array" ? [] : f.type === "boolean" ? false : "");
    setValues(v);
    setEditing(rec);
    setCreating(false);
  };

  const close = () => {
    setEditing(null);
    setCreating(false);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = serialize(values, fields);
      if (editing) {
        return api.put<EntityRecord>(`${apiPath}/${editing.id}`, payload);
      }
      return api.post<EntityRecord>(apiPath, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success(editing ? "Updated" : "Created");
      close();
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`${apiPath}/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success("Deleted");
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const cols = listColumns ?? fields.slice(0, 4).map((f) => f.key);
  const colLabels = cols.map((k) => fields.find((f) => f.key === k)?.label ?? k);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New
        </Button>
      </div>

      <Card>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="p-6 text-sm text-slate-500">Loading…</div>
          ) : !data || data.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">No items yet. Click <strong>New</strong> to add one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    {colLabels.map((label) => (
                      <th key={label} className="px-4 py-3 font-medium">
                        {label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((rec) => (
                    <tr key={rec.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                      {cols.map((k) => (
                        <td key={k} className="px-4 py-3 align-top text-slate-700">
                          {preview(rec[k])}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <Button variant="secondary" size="sm" onClick={() => openEdit(rec)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              if (confirm("Delete this item?")) deleteMutation.mutate(rec.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal open={creating || !!editing} onClose={close} title={editing ? `Edit ${title.replace(/s$/, "")}` : `New ${title.replace(/s$/, "")}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
          className="space-y-3"
        >
          {fields.map((f) => (
            <div key={f.key} className="space-y-1">
              <Label htmlFor={f.key}>
                {f.label}
                {f.required ? <span className="text-red-500"> *</span> : null}
              </Label>
              {f.type === "textarea" ? (
                <Textarea
                  id={f.key}
                  rows={4}
                  value={String(values[f.key] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                />
              ) : f.type === "array" ? (
                <Textarea
                  id={f.key}
                  rows={4}
                  value={Array.isArray(values[f.key]) ? (values[f.key] as string[]).join("\n") : String(values[f.key] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  placeholder="One item per line"
                />
              ) : f.type === "select" ? (
                <select
                  id={f.key}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  value={String(values[f.key] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                >
                  <option value="">— select —</option>
                  {(f.options ?? []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : f.type === "boolean" ? (
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    id={f.key}
                    type="checkbox"
                    checked={!!values[f.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Enabled
                </label>
              ) : (
                <Input
                  id={f.key}
                  type={f.type === "number" ? "number" : "text"}
                  value={String(values[f.key] ?? "")}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [f.key]: f.type === "number" ? e.target.valueAsNumber || 0 : e.target.value }))
                  }
                  placeholder={f.placeholder}
                />
              )}
              {f.helper ? <p className="text-xs text-slate-500">{f.helper}</p> : null}
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
