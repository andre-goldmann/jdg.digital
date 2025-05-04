export interface ConfigRowSimple {
  key: string;
  value: string;
}

export interface ConfigRow {
  Service: string;
  Property: string;
  Description: string;
  'Type/Range': string;
  Default: string;
  'Relevant constraints or dependencies': string;
  Category: string;
  Remarks: string;
}

export interface Configuration {
  service: string;
  tenant?: string;
  fileName: string;
}
