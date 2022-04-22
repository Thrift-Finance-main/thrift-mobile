type Delegate = {
  stakepoolId: string;
  metadata?: Metadata;
  metadataLabel?: string;
};

type Metadata = object | null;

type Asset = {
  unit: string;
  quantity: string;
};

type ProtocolParameter = {
  linearFee: {
    minFeeA: string;
    minFeeB: string;
  };
  minUtxo: any;
  poolDeposit: string;
  keyDeposit: string;
  maxTxSize: number;
  slot: string;
};

type Send = {
  address: string;
  amount?: number;
  assets?: Asset[];
  metadata?: Metadata;
  metadataLabel?: string;
};

type SendMultiple = {
  recipients: {
    address: string;
    amount?: number;
    assets?: Asset[];
  }[];
  metadata?: Metadata;
  metadataLabel?: string;
};
