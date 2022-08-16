//SPDX-License-Identifier: Unlicense 
pragma solidity ^0.8.0;

import 'hardhat/console.sol'; 
import './Token.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';


interface IReceiver {
    function receiveTokens(address tokenAddress, uint256 amount) external; //anybody who takes flashloan outside of this contract must do this functions
}

contract FlashLoan is ReentrancyGuard {
    using SafeMath for uint256;
    Token public token;  // saves the contact we imported makes token into the Token we created
    uint256 public poolBalance; 


    constructor(address _tokenAddress)  {
        token = Token(_tokenAddress); // gotta make sure we use contract token in order to Tokenize the address
    }

    function depositTokens(uint256 _amount) external nonReentrant {
        require(_amount >0, 'Must depost atleast one token');
        token.transferFrom(msg.sender, address(this), _amount); // uses ERC20 transfer from method in that standard
        poolBalance = poolBalance.add(_amount);
    }

    function flashLoan(uint256 _borrowAmount) external nonReentrant {
        require(_borrowAmount > 0, 'Must borrow atleast 1 token'); // they need to give some first before we let them borrow
        
        uint256 balanceBefore = token.balanceOf(address(this));
        require(balanceBefore >= _borrowAmount, 'Not enough tokens in the pool');

        // assert by protocal that via the depost tokens function 
        assert(poolBalance == balanceBefore);//makes sure it is there before we do anything 

        // console.log('borrow amount', _borrowAmount);// hardhat lets us use console.log when we import it
        // send tokens to receiver 
            token.transfer(msg.sender, _borrowAmount);

        // get paid back 
            // 2 step process in flash loans, 2 contracts. when the developer executes flash loan contract, it will call contract in the flash loan pool. 
            // contracts fall back on each other by using functions in each one
        // use loan and get paid back
        IReceiver(msg.sender).receiveTokens(address(token), _borrowAmount);
        
        // ensure loan paid back 
        uint256 balanceAfter = token.balanceOf(address(this));
        require(balanceAfter >= balanceBefore, 'Flash Loan hasnt been paid back');

    // need to learn how to trande crypto on one marketplace with another market place

    } 


}