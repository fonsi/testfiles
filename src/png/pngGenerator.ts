import { FileGeneratorData } from "@/shared/fileGenerator";

export type PngGeneratorData = FileGeneratorData & {
  width: number;
  height: number;
} 