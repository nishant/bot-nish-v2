export interface OpenDataSoftReverseZipRecord {
  fields: {
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
  };
}

export interface OpenDataSoftReverseZipResponse {
  records: OpenDataSoftReverseZipRecord[];
}
