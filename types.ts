export enum ScriptType {
  POWERSHELL = 'POWERSHELL',
  BATCH = 'BATCH'
}

export type Language = 'en' | 'fa';

export interface GeneratorOptions {
  path: string;
  force: boolean;
  recurse: boolean;
}

export interface AnalysisResult {
  isSafe: boolean;
  message: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}