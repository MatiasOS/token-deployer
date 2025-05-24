# AL TOKE TOKEN Smart contracts

This repo contains the Smart Contracts used in AL TOKE TOKEN. Those Smart contract are not fully tested, don't use on production or mainnets.

## AlTokeOFT

This smart contract extends [LayerZero's OFT](https://docs.layerzero.network/v2/developers/evm/oft/quickstart).
By default, the constructor calls mint tokens to a distributor address. The distributor address is an EOA or a Smart Contract.

## Merkle distributor

This smart contract handles the initial distribution of AlTokeOFT. It uses merkle proof from [Open Zeppelin](https://docs.openzeppelin.com/contracts/5.x/api/utils#MerkleProof)
