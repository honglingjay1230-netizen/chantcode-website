export type FamilyVideo = {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  embedUrl?: string;
  contentUrl?: string;
};

export type FamilyStory = {
  slug: string;
  title: string;
  description: string;
  childAge?: string;
  startingPoint: string;
  practice: string;
  duration: string;
  parentObservation: string;
  video?: FamilyVideo;
  transcript: string[];
  importantContext: string[];
  datePublished: string;
  dateModified: string;
};

// Add a story only after the family has provided permission and every field
// below is supported by real notes, media, and context from the pilot.
export const familyStories: FamilyStory[] = [];

export function getFamilyStory(slug: string) {
  return familyStories.find((story) => story.slug === slug);
}

export function familyStoryPath(slug: string) {
  return `/families/${slug}`;
}
