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
  3: "Video 3", // <-- EDIT VIDEO 3 TITLE HERE
  4: "Video 4", // <-- EDIT VIDEO 4 TITLE HERE
  5: "Video 5"  // <-- EDIT VIDEO 5 TITLE HERE
};

// Paste a YouTube, Vimeo, or MP4 link for each video.
// Leave "" until you have it. An empty slot shows a placeholder and stays locked.
// MP4 seeking lock works for a file link such as "safety.mp4" or a full https URL.
// YouTube and Vimeo play, but their players cannot be kept from skipping.
const VIDEOS = {
  1: "welcome-video.mp4", // <!-- PASTE VIDEO 1 LINK HERE -->
  2: "", // <!-- PASTE VIDEO 2 LINK HERE -->
  3: "", // <!-- PASTE VIDEO 3 LINK HERE -->
  4: "", // <!-- PASTE VIDEO 4 LINK HERE -->
  5: ""  // <!-- PASTE VIDEO 5 LINK HERE --> (e.g. "my-video.mp4")
};

// Same Formspree form as the retail site, so the same owner is notified.
// Replace the URL only if sign-offs should go somewhere else.
const FORMSPREE_URL = "https://formspree.io/f/mjyylepr"; // <-- EDIT FORMSPREE ENDPOINT HERE
