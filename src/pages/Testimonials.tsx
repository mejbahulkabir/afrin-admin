import { EntityManager } from "../components/EntityManager";

export function Testimonials() {
  return (
    <EntityManager
      title="Testimonials"
      apiPath="/api/testimonials"
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "achievement", label: "Achievement", placeholder: "e.g. Recommended — IMA Dehradun" },
        { key: "batch", label: "Batch", placeholder: "e.g. NDA-148" },
        { key: "quote", label: "Quote", type: "textarea", required: true },
        { key: "initials", label: "Initials" },
        { key: "order", label: "Display order", type: "number" },
      ]}
      listColumns={["name", "achievement", "batch"]}
    />
  );
}
