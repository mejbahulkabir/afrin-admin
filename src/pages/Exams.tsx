import { EntityManager } from "../components/EntityManager";

export function Exams() {
  return (
    <EntityManager
      title="Defence Exams"
      apiPath="/api/exams"
      fields={[
        { key: "slug", label: "Slug", required: true },
        { key: "name", label: "Short name", required: true, placeholder: "e.g. NDA & NA" },
        { key: "full", label: "Full name", placeholder: "e.g. National Defence Academy & Naval Academy" },
        { key: "branch", label: "Branch", placeholder: "e.g. Army · Navy · Air Force" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "eligibility", label: "Eligibility", type: "textarea" },
        { key: "order", label: "Display order", type: "number" },
      ]}
      listColumns={["slug", "name", "branch"]}
    />
  );
}
