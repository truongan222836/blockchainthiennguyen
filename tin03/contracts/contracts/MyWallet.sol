// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.28;

contract MyWallet {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    function deposite() external payable {}

    function withdraw(uint256 value) external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(msg.sender).transfer(value);
    }
}