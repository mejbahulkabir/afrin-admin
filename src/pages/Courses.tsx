import { EntityManager } from "../components/EntityManager";

export function Courses() {
  return (
    <EntityManager
      title="Courses"
      apiPath="/api/courses"
      fields={[
        { key: "slug", label: "Slug", required: true, helper: "URL-safe identifier (e.g. nda-foundation)" },
        { key: "title", label: "Title", required: true },
        { key: "duration", label: "Duration", placeholder: "e.g. 12 Months" },
        { key: "mode", label: "Mode", type: "select", options: ["Online", "Offline", "Hybrid"] },
        { key: "level", label: "Level", type: "select", options: ["Foundation", "Intermediate", "Advanced"] },
        { key: "description", label: "Description", type: "textarea" },
        { key: "features", label: "Features", type: "array", helper: "One feature per line" },
        { key: "popular", label: "Featured / popular", type: "boolean" },
        { key: "order", label: "Display order", type: "number" },
      ]}
      listColumns={["slug", "title", "level", "mode"]}
    />
  );
}
