// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0; 
// import './RealEstate.sol'; // can use functions in here to get stuff from it 
interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _id) external; // the interface is a way to only get certain functions from teh contract we are trying to talk to on the blockchain 
    // function will take money from sellers wallet and put it into buyers waller
}

contract Escrow {
    address public nftAddress; 
    uint256 public nftID;
    uint256 public purchasePrice; 
    uint256 public escrowAmount; 
    address payable public seller; 
    address payable public buyer; 
    address public lender; 
    address public inspector;
    mapping(address => bool) public approval; // address will store if it has been approved or failed to pass approval
    
    modifier onlyBuyer() {
        require(msg.sender == buyer, 'Only the Buyer can Call this function'); //msg.sender is the address of person who sent in ether
        _;
    }
    modifier onlyInspector() {
        require(msg.sender == inspector, 'Only the Buyer can Call this function'); //msg.sender is the address of person who sent in ether
        _;
    }
    bool public inspectionPassed = false;
    
    receive() external payable {} // smart contract is able to receive funds in general 

    
    constructor( // make sure to label in order the deployment in the tests
        address _nftAddress, 
        uint256 _nftID, 
        uint256 _purchasePrice, 
        uint256 _escrowAmount, 
        address payable _seller,
        address payable _buyer,
        address _inspector, 
        address _lender
        ) {
        nftAddress = _nftAddress;
        nftID = _nftID;
        purchasePrice = _purchasePrice;
        escrowAmount = _escrowAmount;
        buyer = _buyer; 
        seller = _seller;
        inspector = _inspector;
        lender = _lender;

    }

   
    
    function depositEarnist() public payable onlyBuyer { //payable will allow eth to be used at this function to send into it, receives ether into smart contract
        // msg.value allows for us to know the amount of ether being sent to this function 
        require(msg.value >= escrowAmount); //msg.value is the amount of ether sent into function of smart contract   
    }

    function updateInspectionStatus(bool _passed) public onlyInspector {
        inspectionPassed = _passed;
    }

    function getBalance() public view returns(uint) {
        return address(this).balance; // (this) refers to smart contract. address() turns it into an address and then we can check .balance of the ether smart contract
    }

    function approveSale() public {
        approval[msg.sender] = true; // will cause the address of the sender to switch when called
    }

    // cancel sale(handle earnest deposit) 
    // -> if inspection status is not approved, then refund, otherwise send to seller
    function cancelSale() public {
        if(inspectionPassed == false) {
            payable(buyer).transfer(address(this).balance);
        } else {
            payable(seller).transfer(address(this).balance);
        }
    }

    
    // transfer ownership of propery 
    function finalizeSale() public {
        require(inspectionPassed, 'Must pass inspection');
        require(approval[buyer], 'must be approved by buyer');
        require(approval[seller], 'must be approved by seller');// each one will require the approval of all addresses in order for it to occur
        require(approval[lender], 'must be approved by lender');
        require(address(this).balance >= purchasePrice, 'Must have enough ether for sale');

        (bool success, ) = payable(seller).call{value : address(this).balance}(""); // use this to transfer securely with a mesage in the ("") however the .call will be able to transfer funds to the seller through the payable function.
        require(success);
        // transfer ownership of property 
        IERC721(nftAddress).transferFrom(seller, buyer, nftID);
    }



}