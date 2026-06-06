import { EntityManager } from "../components/EntityManager";

export function Stats() {
  return (
    <EntityManager
      title="Stats"
      apiPath="/api/stats"
      fields={[
        { key: "label", label: "Label", required: true, placeholder: "e.g. Aspirants trained" },
        { key: "value", label: "Value", type: "number", required: true },
        { key: "suffix", label: "Suffix", placeholder: 'e.g. "+" or "%"' },
        { key: "order", label: "Display order", type: "number" },
      ]}
      listColumns={["label", "value", "suffix", "order"]}
    />
  );
}
