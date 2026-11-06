// ===== SITE CONFIG =====
// Production Center training.
// Edit this file, save it, and refresh the browser. No build step.

// TEST_MODE shows a red "Mark as watched (TEST ONLY)" button on each video page.
// Empty video links still do not unlock. Set this to false before real training.
const TEST_MODE = true;

// Prefix for this site's sessionStorage keys.
// The retail training site uses video1_done / signoff_done with no prefix.
// Keeping "production" here means retail progress cannot carry over.
const SITE_KEY = "production";

// On-screen title for each video page. Change the words; keep the numbers.
const TITLES = {
  1: "Video 1", // <-- EDIT VIDEO 1 TITLE HERE
  2: "Video 2", // <-- EDIT VIDEO 2 TITLE HERE
};

// Paste a YouTube, Vimeo, or MP4 link for each video.
// Leave "" until you have it. An empty slot shows a placeholder and stays locked.
// MP4 seeking lock works for a file link such as "safety.mp4" or a full https URL.
// YouTube and Vimeo play, but their players cannot be kept from skipping.
const VIDEOS = {
  1: "welcome-video.mp4", // <!-- PASTE VIDEO 1 LINK HERE -->
  2: "production-hygiene.mp4", // <!-- PASTE VIDEO 2 LINK HERE -->
};

// Same Formspree form as the retail site, so the same owner is notified.
// Replace the URL only if sign-offs should go somewhere else.
const FORMSPREE_URL = "https://formspree.io/f/mjyylepr"; // <-- EDIT FORMSPREE ENDPOINT HERE
