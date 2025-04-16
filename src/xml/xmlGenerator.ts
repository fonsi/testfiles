import { FileGeneratorData } from "@/shared/fileGenerator";

export type XmlGeneratorData = FileGeneratorData & {
  elements?: number;
  attributes?: number;
}; 