export type FileWorkerResponse = {
  success: boolean;
  file: Uint8Array;
  error?: string;
}
