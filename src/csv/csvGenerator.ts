import { FileGeneratorData } from "@/shared/fileGenerator";

export type CsvGeneratorData = FileGeneratorData & {
  columns?: number;
  rows?: number;
}; 