import { EntityManager } from "../components/EntityManager";

export function GalleryImages() {
  return (
    <EntityManager
      title="Gallery Images"
      apiPath="/api/gallery?all=1"
      description="Photos shown in the gallery grids on the homepage and the Gallery page. Use any public image URL."
      fields={[
        { key: "src", label: "Image URL", required: true, helper: "Public URL of the image" },
        { key: "alt", label: "Alt text", placeholder: "Describe what's in the image" },
        { key: "caption", label: "Caption", placeholder: "Shown on hover" },
        { key: "active", label: "Active", type: "boolean" },
        { key: "order", label: "Display order", type: "number" },
      ]}
      listColumns={["src", "caption", "active", "order"]}
      emptyDefaults={{ active: true }}
    />
  );
}
