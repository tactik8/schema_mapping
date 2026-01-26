/**
 * Converts a KaraKeep API record to a Schema.org NoteDigitalDocument.
 * Includes Highlights as nested Quotations.
 */
function convertKaraKeepToSchema(record, agentName = "KaraKeep User") {
  // Map highlights to Quotation types
  const highlights = record.highlights ? record.highlights.map(h => ({
    "@type": "Quotation",
    "text": h.text,
    "dateCreated": h.createdAt,
    "position": h.index // Useful for re-ordering snippets
  })) : [];

  return {
    "@context": "https://schema.org",
    "@type": "NoteDigitalDocument",
    "identifier": record.id,
    "name": record.title || record.content?.title || "Untitled",
    "author": {
      "@type": "Person",
      "name": agentName
    },
    "dateCreated": record.createdAt,
    "dateModified": record.modifiedAt,
    "text": record.note || "", 
    "abstract": record.summary || "", 
    "keywords": record.tags ? record.tags.map(t => t.name).join(", ") : "",
    
    // The "Subject" of your bookmarking activity
    "about": {
      "@type": "WebPage",
      "url": record.content?.url || record.url,
      "name": record.content?.title || record.title,
      "description": record.content?.description || "",
      "image": record.content?.bannerImageId ? `/api/v1/assets/${record.content.bannerImageId}` : null
    },

    // Nesting the specific highlights taken from the page
    "hasPart": highlights,

    // Capturing the interaction context
    "mainEntity": {
      "@type": "BookmarkAction",
      "startTime": record.createdAt,
      "actionStatus": "CompletedActionStatus",
      "result": record.favourited ? "Favourited" : "Saved"
    }
  };
}
