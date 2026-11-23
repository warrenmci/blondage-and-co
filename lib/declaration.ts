// The wording of the new client declaration lives here, in one place.
// Both the signing page and the emailed record are built from this file, so
// the email always shows exactly what the client agreed to.
//
// IMPORTANT: bump DECLARATION_VERSION whenever the wording changes, so each
// signed record shows which wording was in force when it was signed.
export const DECLARATION_VERSION = "2026-11-23.4";

export const BUSINESS_NAME = "Blondage & Co";

export const DECLARATION_TITLE = "Client Declaration & Consent";

export const DECLARATION_INTRO =
  "Welcome to Blondage & Co. Before your first appointment, please fill in your details, read the declaration below and sign.";

export interface DeclarationPoint {
  title: string;
  text: string;
}

export const DECLARATION_POINTS: DeclarationPoint[] = [
  {
    title: "Accuracy of information",
    text: "The hair history and allergy information I have provided is true and complete to the best of my knowledge.",
  },
  {
    title: "Consultation, risks & results",
    text: "My stylist will discuss my hair goals, suitability and price with me before my service begins. I understand that results can vary and that risks may include dryness, breakage or variation in colour or chemical results due to past treatments or the condition of my hair.",
  },
  {
    title: "Checking my result",
    text: "I will be shown my finished result before I leave. If there is anything I am not happy with, I will say so at the time so it can be addressed on the day.",
  },
  {
    title: "Concerns after my appointment",
    text: "If I notice a concern later, I will contact Blondage & Co within 7 days and allow the salon to assess my hair in person and put it right.",
  },
  {
    title: "Refunds & adjustments",
    text: "Payment is for my stylist's time, expertise and the products used. Refunds or partial refunds are not given for change of mind.",
  },
  {
    title: "Photos for salon records",
    text: "Photos of my hair may be taken before and after my service as a record of the work carried out. These are kept private unless I give permission below.",
  },
];

export const DECLARATION_AGREE_LABEL =
  "I have read, understood and agree to all of the above.";

export const SOCIAL_MEDIA_CONSENT_LABEL =
  "Optional: I am happy for photos of my hair to be shared on Blondage & Co's social media.";

export const DECLARATION_FOOTNOTE =
  "Nothing in this declaration limits your rights under the Consumer Guarantees Act 1993.";
