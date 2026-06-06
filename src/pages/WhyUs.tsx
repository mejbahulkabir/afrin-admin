import { EntityManager } from "../components/EntityManager";

export function WhyUs() {
  return (
    <EntityManager
      title="Why-Us Cards"
      apiPath="/api/why-us"
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "desc", label: "Description", type: "textarea", required: true },
        { key: "order", label: "Display order", type: "number" },
      ]}
      listColumns={["title", "desc", "order"]}
    />
  );
}
