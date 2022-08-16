//SPDX-License-Identifier: Unlicense 
pragma solidity ^0.8.0; 

import '@openzeppelin/contracts/utils/Address.sol'; 

// 1 way to protect from reentrancy 
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';


contract Bank is ReentrancyGuard {
    using Address for address payable;  // find out what this does
    mapping(address => uint256) public balanceOf; // uint is the amount the address has


    //deposit ether funds 
    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;// amount is added to the mapping


    }


    //withdraw either funds 
    function withdraw() external nonReentrant {// doesnt have to be payable since money isnt being sent here
        uint256 depositedAmount = balanceOf[msg.sender];
        payable(msg.sender).sendValue(depositedAmount);
        balanceOf[msg.sender] = 0;
    }


    // can figure out other stuff later for this bank contract





}