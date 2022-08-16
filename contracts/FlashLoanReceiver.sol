//SPDX-License-Identifier: Unlicense 
pragma solidity ^0.8.0;

import 'hardhat/console.sol'; 
import './FlashLoan.sol';
import './Token.sol';

contract FlashLoanReceiver {
    FlashLoan private pool; //reates flash loan instance 
    address private owner; 

    event LoanReceived(address token, uint256 amount);

    constructor(address _poolAddress) {
        pool = FlashLoan(_poolAddress);
        owner = msg.sender;// only devs can have access to these functions individually 
    }

    function executeFlashLoan(uint _amount) external{ 
        require(msg.sender == owner, 'Only owner can execute the flash loan');
        // calls flashLoan() in flashloan.sol contract
        pool.flashLoan(_amount);
    }

    function receiveTokens(address _tokenAddress, uint256 _amount) external {
        require(msg.sender == address(pool), 'sender must be pool');// must be from pool contract 
        // alows us to see amount of address
        // require funds received
        require(Token(_tokenAddress).balanceOf(address(this)) == _amount, 'Failed to get loan');
        // emit event
        emit LoanReceived(_tokenAddress, _amount);

        // do stuff with the money received from flashloan contract 
        

        // does some calculations 
        // console.log('Token address', _tokenAddress, 'Amount', _amount);// gives us address of token
        //console.log('token', Token(_tokenAddress).balanceOf(address(this)));

        // return money to pool 
        require(Token(_tokenAddress).transfer(msg.sender, _amount), ' transfer of tokens failed'); // paid money back? 
    }

}