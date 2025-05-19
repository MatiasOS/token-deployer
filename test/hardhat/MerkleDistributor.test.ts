import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { StandardMerkleTree } from '@openzeppelin/merkle-tree'
import { expect } from 'chai'
import { Contract, ContractFactory } from 'ethers'
import { deployments, ethers } from 'hardhat'

describe('MerkleDistributor Test', function () {
    // Declaration of variables to be used in the test suite
    let MerkleDistributor: ContractFactory
    let owner: SignerWithAddress
    let claimantA: SignerWithAddress
    let claimantB: SignerWithAddress
    let claimantC: SignerWithAddress
    const amountA = '100'
    const amountB = '200'
    const amountC = '300'
    const claimAmount = amountA + amountB + amountC
    let tree: StandardMerkleTree<string[]>
    let merkleDistributor: Contract

    // Constant representing a mock Endpoint ID for testing purposes
    const eidA = 1
    // Declaration of variables to be used in the test suite
    let AlTokeOFT: ContractFactory
    let EndpointV2Mock: ContractFactory
    let alTokeOFT: Contract
    let mockEndpointV2: Contract

    // Before hook for setup that runs once before all tests in the block
    before(async function () {
        // Contract factory for our tested contract
        MerkleDistributor = await ethers.getContractFactory('MerkleDistributor')

        // Fetching the first signer (account) from Hardhat's local Ethereum network
        const signers = await ethers.getSigners()
        owner = signers[0]
        claimantA = signers[1]
        claimantB = signers[2]
        claimantC = signers[3]

        const EndpointV2MockArtifact = await deployments.getArtifact('EndpointV2Mock')
        EndpointV2Mock = new ContractFactory(EndpointV2MockArtifact.abi, EndpointV2MockArtifact.bytecode, owner)
        mockEndpointV2 = await EndpointV2Mock.deploy(eidA)

        AlTokeOFT = await ethers.getContractFactory('AlTokeOFT')
        alTokeOFT = await AlTokeOFT.deploy(
            'AlTokeOFT',
            'ATK',
            mockEndpointV2.address,
            owner.address,
            owner.address,
            claimAmount // or Zero
        )

        const claims = [
            [claimantA.address, amountA],
            [claimantB.address, amountB],
            [claimantC.address, amountC],
        ]

        // console.log('claims: ', claims)
        tree = StandardMerkleTree.of(claims, ['address', 'uint256'])

        merkleDistributor = await MerkleDistributor.deploy(alTokeOFT.address, tree.root)

        await alTokeOFT.transfer(merkleDistributor.address, claimAmount)
    })

    it('Merkle tree should have the total distribution assigned', async function () {
        const merkleTreeBalance = await alTokeOFT.balanceOf(merkleDistributor.address)
        expect(merkleTreeBalance.toString()).to.equal(claimAmount)
        expect(await merkleDistributor.token()).to.equal(alTokeOFT.address)
    })

    it('Should be able to claim tokens', async function () {
        const claimantsProofs: { [key: string]: string[] } = {}
        const claimantLeafs: { [key: string]: string[] } = {}

        for (const [i, v] of tree.entries()) {
            // console.log('v:                ', v)
            // console.log('i:                ', i)
            // console.log('tree.leafHash(i): ', tree.leafHash(v))
            // console.log('tree.getProof(i): ', tree.getProof(v))
            claimantLeafs[v[0]] = v
            claimantsProofs[v[0]] = tree.getProof(i)
        }

        // console.log(tree.render())
        /* const R =*/ await merkleDistributor.connect(claimantA).claim(
            claimantA.address, // Claimant address
            amountA, // amount to claim
            claimantsProofs[claimantA.address] // proof
        )
        // const r = await R.wait()
        // console.log(r.events[0].args.node)

        const balanceOfA = await alTokeOFT.balanceOf(claimantA.address)
        expect(balanceOfA.toString()).to.equal(amountA)
    })

    it('Should fail to claim tokens multiple times')
})
