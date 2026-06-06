import { EntityManager } from "../components/EntityManager";

export function Blog() {
  return (
    <EntityManager
      title="Blog Posts"
      apiPath="/api/blog?all=1"
      fields={[
        { key: "slug", label: "Slug", required: true, helper: "URL-safe identifier" },
        { key: "title", label: "Title", required: true },
        { key: "category", label: "Category", placeholder: "e.g. Strategy / SSB / Fitness" },
        { key: "author", label: "Author" },
        { key: "date", label: "Date", placeholder: "YYYY-MM-DD" },
        { key: "readingTime", label: "Reading time", placeholder: "e.g. 6 min read" },
        { key: "excerpt", label: "Excerpt", type: "textarea" },
        { key: "content", label: "Content", type: "textarea" },
        { key: "published", label: "Published", type: "boolean" },
      ]}
      listColumns={["title", "category", "date", "published"]}
    />
  );
}
