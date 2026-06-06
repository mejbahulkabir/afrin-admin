import { EntityManager } from "../components/EntityManager";

export function Faculty() {
  return (
    <EntityManager
      title="Faculty"
      apiPath="/api/faculty"
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "role", label: "Role", required: true, placeholder: "e.g. Director & SSB Mentor" },
        { key: "rank", label: "Service / rank", placeholder: "e.g. Indian Army" },
        { key: "experience", label: "Experience", placeholder: "e.g. 32+ yrs" },
        { key: "specialization", label: "Specialization", type: "textarea" },
        { key: "initials", label: "Initials", placeholder: "e.g. AM" },
        { key: "order", label: "Display order", type: "number" },
      ]}
      listColumns={["name", "role", "rank", "experience"]}
    />
  );
}
