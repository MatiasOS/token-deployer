// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { AlTokeOFT } from "../AlTokeOFT.sol";

// @dev WARNING: This is for testing purposes only
contract MyOFTMock is AlTokeOFT {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
    ) AlTokeOFT(_name, _symbol, _lzEndpoint, _delegate, 0) {}

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
