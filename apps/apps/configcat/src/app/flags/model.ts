export interface ConfigFile {
  id: number;
  env: string;
  service: string;
  tenant: string;
  filename: string;
  path: string;
  stamp: string;
}

export interface Flag {
  config_id: number;
  property: string;
  value: string;
  description_id?: number;
}

export interface FlagDto {
  config: ConfigFile;
  property: string;
  value: string;
  description?: FlagDescription;
}

export interface FlagDescription {
  description: string;
  typerange: string;
  constraints: string;
  category: string;
  remarks: string;
}

export interface ConfigData {
  envs: Array<{value: string, label: string}>;
  services: Array<{value: string, label: string}>;
  tenants: Array<{value: string, label: string}>;
}
