export interface INativeToken {
  _id: string;
  assetName: string;
  policyId: string;
  assetId: string;
  fingerprint: string;
  quantity: number;
  type?: string;
  name?: string;
  decimals?: string;
  description?: string;
  metadataHash?: string;
  url?: string;
  logo?: string;
  ticker?: string;
}

export const NativeTokenSchema = {
  name: 'NativeToken',
  primaryKey: '_id',
  properties: {
    _id: 'uuid',
    assetName: 'string',
    policyId: 'string',
    assetId: 'string',
    fingerprint: 'string',
    quantity: 'int',
    type: 'string?',
    name: 'string?',
    decimals: 'string?',
    description: 'string?',
    metadataHash: 'string?',
    url: 'string?',
    logo: 'string?',
    ticker: 'string?',
  },
};
