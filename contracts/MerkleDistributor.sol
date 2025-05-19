// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity =0.8.22;

import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

error AlreadyClaimed();
error InvalidProof();

contract MerkleDistributor {
    using SafeERC20 for IERC20;

    address public immutable token;
    bytes32 public immutable merkleRoot;

    // This is a packed array of booleans.
    mapping(address => bool) private claimedBitMap;

    event Claimed(address account, uint256 amount);
    event Log(bytes32 indexed node);

    constructor(address token_, bytes32 merkleRoot_) {
        token = token_;
        merkleRoot = merkleRoot_;
    }

    function isClaimed(address index) public view returns (bool) {
        return claimedBitMap[index];
    }

    function _setClaimed(address index) private {
        claimedBitMap[index] = true;
    }

    function claim(address account, uint256 amount, bytes32[] calldata merkleProof)
        public
        virtual
    {
        if (isClaimed(account)) revert AlreadyClaimed();

        // Verify the merkle proof.
        bytes32 node = keccak256(bytes.concat(keccak256(abi.encode(account, amount))));
        emit Log(node);
        // return 
        if (!MerkleProof.verifyCalldata(merkleProof, merkleRoot, node)) revert InvalidProof();

        // Mark it claimed and send the token.
        _setClaimed(account);
        IERC20(token).safeTransfer(account, amount);

        emit Claimed(account, amount);
    }
}