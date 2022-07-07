/**
 * Get UTXOs from Address
 */
// eslint-disable-next-line import/prefer-default-export
export function getCurrentBalanceForAddressBody() {
  return `
    query currentBalanceForAddress (
    $address: String!
    ){
        utxos(
            where: { address: { _eq: $address }}
        ) {
            value
            transaction {
              block {
                number
                slotNo
                epochNo
                hash
              }
            }
            tokens{
                quantity
                asset {
                  assetName
                  policyId
                  assetId
                  fingerprint
                  name
                  decimals
                  description
                  metadataHash
                  url
                  logo
                  ticker 
                }
          }
        }
    }
   `;
}

export function submitTransactionBody(){
    return `
    mutation submitTransaction(
        $transaction: String!
    ) {
        submitTransaction(transaction: $transaction) {
            hash
        }
    }
   `
}
