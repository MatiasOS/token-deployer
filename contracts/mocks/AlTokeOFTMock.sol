// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { AlTokeOFT } from "../AlTokeOFT.sol";

// @dev WARNING: This is for testing purposes only
contract AlTokeOFTMock is AlTokeOFT {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate,
        address _distributor,
        uint256 _amount
    ) AlTokeOFT(_name, _symbol, _lzEndpoint, _delegate, _distributor, _amount) {}

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
