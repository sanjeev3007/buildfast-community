/**
 * Link Preview types
 */

/** Request body for link preview API */
export interface LinkPreviewRequest {
  url: string;
}

/** Success response from link preview API */
export interface LinkPreviewSuccess {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
}

/** Error response from link preview API */
export interface LinkPreviewError {
  error: string;
}

export type LinkPreviewResponse = LinkPreviewSuccess | LinkPreviewError;
