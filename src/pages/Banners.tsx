import { EntityManager } from "../components/EntityManager";

export function Banners() {
  return (
    <EntityManager
      title="Banners"
      apiPath="/api/banners?all=1"
      description="Hero banner shown at the top of the homepage; CTA banner shown above the footer. Multiple hero banners are supported (the first active one is used)."
      fields={[
        { key: "slot", label: "Slot", type: "select", options: ["hero", "cta"], required: true, helper: "Where this banner appears" },
        { key: "image", label: "Image URL", required: true, helper: "Public URL of the background image (Unsplash, Cloudinary, S3, etc.)" },
        { key: "eyebrow", label: "Eyebrow", placeholder: "e.g. Admissions Open · Batch 2026" },
        { key: "title", label: "Title", placeholder: "e.g. Become the officer" },
        { key: "titleHighlight", label: "Title highlight", placeholder: "e.g. India is waiting for. (rendered on a second line with gradient)" },
        { key: "subtitle", label: "Subtitle", type: "textarea" },
        { key: "ctaLabel", label: "Primary CTA label", placeholder: "e.g. Apply for Admission" },
        { key: "ctaHref", label: "Primary CTA href", placeholder: "e.g. /admission" },
        { key: "secondaryLabel", label: "Secondary CTA label (hero only)", placeholder: "e.g. Explore Courses" },
        { key: "secondaryHref", label: "Secondary CTA href (hero only)", placeholder: "e.g. /courses" },
        { key: "active", label: "Active", type: "boolean" },
        { key: "order", label: "Display order", type: "number" },
      ]}
      listColumns={["slot", "title", "active", "order"]}
      emptyDefaults={{ active: true }}
    />
  );
}
