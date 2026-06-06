import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Check, X } from "lucide-react";
import { api, ApiError } from "../lib/api";
import { Button } from "../components/ui/button";
import { Card, CardBody } from "../components/ui/card";
import { formatDate } from "../lib/utils";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message?: string;
  handled: boolean;
  createdAt: string;
}

export function ContactSubmissions() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/forms/contact"],
    queryFn: () => api.get<ContactSubmission[]>("/api/forms/contact"),
  });

  const toggle = useMutation({
    mutationFn: ({ id, handled }: { id: string; handled: boolean }) =>
      api.patch(`/api/forms/contact/${id}`, { handled }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/forms/contact"] }),
    onError: (err: ApiError) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/api/forms/contact/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/forms/contact"] });
      toast.success("Deleted");
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Contact Inbox</h1>
        <p className="mt-1 text-sm text-slate-600">Messages submitted via the contact form on the website.</p>
      </div>

      {isLoading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : !data || data.length === 0 ? (
        <Card>
          <CardBody className="text-sm text-slate-500">No messages yet.</CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.map((s) => (
            <Card key={s.id} className={s.handled ? "opacity-70" : ""}>
              <CardBody>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900">{s.name}</h3>
                      {s.handled ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Handled</span>
                      ) : (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">New</span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {s.email} · {s.phone} · {formatDate(s.createdAt)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toggle.mutate({ id: s.id, handled: !s.handled })}
                    >
                      {s.handled ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                      {s.handled ? "Mark unhandled" : "Mark handled"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (confirm("Delete this submission?")) remove.mutate(s.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {s.subject ? <div className="mt-3 text-sm font-medium text-slate-900">{s.subject}</div> : null}
                {s.message ? <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{s.message}</p> : null}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
