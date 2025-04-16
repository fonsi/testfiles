import { FileGeneratorData } from "@/shared/fileGenerator"; 

export type PdfGeneratorData = FileGeneratorData & {
  title?: string;
  content?: string;
}