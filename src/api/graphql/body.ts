/**
 * Get UTXOs from Address
 */
export function getCurrentBalanceForAddressBody() {
  return `
    query currentBalanceForAddress (
    $addresses: [String!]
    ){
        utxos(
             where: { address: { _in: $addresses }}
        ) {
            address
            value
            index
            tokens{
                quantity
                asset {
                  assetName
                  policyId
            }
          }
        }
    }
   `;
}
