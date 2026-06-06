import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Card, CardBody, CardHeader, CardTitle } from "../components/ui/card";

interface SiteSettings {
  name: string;
  shortName?: string;
  tagline?: string;
  description?: string;
  phone?: string;
  phoneRaw?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  mapsEmbed?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
  };
}

const EMPTY: SiteSettings = { name: "", socials: {} };

export function Site() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<SiteSettings | null>({
    queryKey: ["/api/site"],
    queryFn: () => api.get<SiteSettings | null>("/api/site"),
  });
  const [values, setValues] = useState<SiteSettings>(EMPTY);

  useEffect(() => {
    if (data) setValues({ ...EMPTY, ...data, socials: { ...EMPTY.socials, ...data.socials } });
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => api.put<SiteSettings>("/api/site", values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/site"] });
      toast.success("Site settings saved");
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const set = (key: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const setSocial = (key: keyof NonNullable<SiteSettings["socials"]>) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, socials: { ...v.socials, [key]: e.target.value } }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Site Settings</h1>
        <p className="mt-1 text-sm text-slate-600">Brand identity, contact details and social links shown across the site.</p>
      </div>

      {isLoading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-4"
        >
          <Card>
            <CardHeader><CardTitle>Brand</CardTitle></CardHeader>
            <CardBody className="grid gap-4 md:grid-cols-2">
              <Field label="Name" required>
                <Input value={values.name ?? ""} onChange={set("name")} required />
              </Field>
              <Field label="Short name">
                <Input value={values.shortName ?? ""} onChange={set("shortName")} />
              </Field>
              <Field label="Tagline" wide>
                <Input value={values.tagline ?? ""} onChange={set("tagline")} />
              </Field>
              <Field label="Description" wide>
                <Textarea rows={3} value={values.description ?? ""} onChange={set("description")} />
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
            <CardBody className="grid gap-4 md:grid-cols-2">
              <Field label="Phone (display)"><Input value={values.phone ?? ""} onChange={set("phone")} /></Field>
              <Field label="Phone (tel: link)"><Input value={values.phoneRaw ?? ""} onChange={set("phoneRaw")} /></Field>
              <Field label="Email"><Input type="email" value={values.email ?? ""} onChange={set("email")} /></Field>
              <Field label="WhatsApp number"><Input value={values.whatsapp ?? ""} onChange={set("whatsapp")} /></Field>
              <Field label="Address" wide><Textarea rows={2} value={values.address ?? ""} onChange={set("address")} /></Field>
              <Field label="Google Maps embed URL" wide><Textarea rows={2} value={values.mapsEmbed ?? ""} onChange={set("mapsEmbed")} /></Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Socials</CardTitle></CardHeader>
            <CardBody className="grid gap-4 md:grid-cols-2">
              <Field label="Facebook"><Input value={values.socials?.facebook ?? ""} onChange={setSocial("facebook")} /></Field>
              <Field label="Instagram"><Input value={values.socials?.instagram ?? ""} onChange={setSocial("instagram")} /></Field>
              <Field label="YouTube"><Input value={values.socials?.youtube ?? ""} onChange={setSocial("youtube")} /></Field>
              <Field label="Twitter"><Input value={values.socials?.twitter ?? ""} onChange={setSocial("twitter")} /></Field>
              <Field label="LinkedIn"><Input value={values.socials?.linkedin ?? ""} onChange={setSocial("linkedin")} /></Field>
            </CardBody>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, children, required, wide }: { label: string; children: React.ReactNode; required?: boolean; wide?: boolean }) {
  return (
    <div className={`space-y-1 ${wide ? "md:col-span-2" : ""}`}>
      <Label>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </Label>
      {children}
    </div>
  );
}
