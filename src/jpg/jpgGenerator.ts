import { FileGeneratorData } from "@/shared/fileGenerator";

export type JpgGeneratorData = FileGeneratorData & {
  width: number;
  height: number;
}