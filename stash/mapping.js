/**
 * Converts a Stash Scene object to a Schema.org VideoObject (JSON-LD)
 * @param {Object} scene - The scene record from Stash API
 * @returns {Object} JSON-LD VideoObject
 */
function mapStashSceneToSchema(scene) {
  // Helper to convert seconds to ISO 8601 duration (PT#H#M#S)
  const formatDuration = (seconds) => {
    if (!seconds) return undefined;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `PT${h > 0 ? h + 'H' : ''}${m > 0 ? m + 'M' : ''}${s}S`;
  };

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": scene.title || "Untitled Scene",
    "description": scene.details || "",
    "thumbnailUrl": [scene.paths?.screenshot || scene.paths?.preview],
    "uploadDate": scene.date || new Date().toISOString().split('T')[0],
    "duration": formatDuration(scene.file?.duration),
    "contentUrl": scene.paths?.stream || "",
    "keywords": scene.tags?.map(t => t.name).join(", "),
    
    // Mapping the Studio
    "productionCompany": scene.studio ? {
      "@type": "Organization",
      "name": scene.studio.name,
      "url": scene.studio.url
    } : undefined,

    // Mapping Performers
    "actor": scene.performers?.map(performer => ({
      "@type": "Person",
      "name": performer.name,
      "url": performer.url,
      "image": performer.image_path
    })),

    // Mapping Internal Rating (Stash uses 1-5)
    "aggregateRating": scene.rating10 ? {
      "@type": "AggregateRating",
      "ratingValue": scene.rating10 / 2, // Converting 10-point scale to 5-star if needed
      "bestRating": "5",
      "worstRating": "1"
    } : undefined
  };
}

/**
 * Converts a Schema.org VideoObject (JSON-LD) back to a Stash Scene input
 * @param {Object} jsonLd - The JSON-LD VideoObject
 * @returns {Object} Stash-compatible scene record
 */
function mapSchemaToStashScene(jsonLd) {
  // Helper to convert ISO 8601 duration (PT#H#M#S) back to total seconds
  const parseISODuration = (duration) => {
    if (!duration) return null;
    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!matches) return null;
    
    const hours = parseInt(matches[1] || 0);
    const minutes = parseInt(matches[2] || 0);
    const seconds = parseInt(matches[3] || 0);
    
    return (hours * 3600) + (minutes * 60) + seconds;
  };

  return {
    title: jsonLd.name,
    details: jsonLd.description,
    date: jsonLd.uploadDate,
    
    // Stash expects IDs for associations usually, 
    // but here we map the names/objects for metadata usage
    studio: jsonLd.productionCompany ? {
      name: jsonLd.productionCompany.name
    } : null,

    // Convert Schema 'actor' array back to Stash 'performers'
    performers: Array.isArray(jsonLd.actor) 
      ? jsonLd.actor.map(p => ({ name: p.name })) 
      : [],

    // Convert comma-separated keywords back to Stash tag objects
    tags: jsonLd.keywords 
      ? jsonLd.keywords.split(',').map(tag => ({ name: tag.trim() })) 
      : [],

    // Stash stores duration in seconds
    duration: parseISODuration(jsonLd.duration),

    // Map rating back to Stash's 1-10 or 1-5 scale
    rating10: jsonLd.aggregateRating?.ratingValue 
      ? parseFloat(jsonLd.aggregateRating.ratingValue) * 2 
      : null,

    url: jsonLd.contentUrl
  };
}

