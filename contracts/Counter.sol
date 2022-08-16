// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0; 

contract Counter {
    // contract code goes between here 
    uint public count; // unsigned integer for count. cannot be negative or any other sign in front of it 
    string public name;

    constructor(
        string memory _name,
         uint _initialCount
         ) { // can pass arguments upon deployment, will cause input to be required for deployment
        name = _name; 
        count= _initialCount;
    }

    uint[] public areas; 
    mapping(string => uint256) public areaMap; 
    uint areasCount = 0; 



    // calculate area 
    function calcArea(uint _x, uint _y, string memory _name) public  {
        uint area = _x * _y; 
        areas.push(area); 
        areaMap[_name] = area;
        areasCount ++;

        // return area;  // does not use gas because it is only a calculation to the BC. 
    }



    //store numerical value 
  function getCount()
   public view returns(uint)
    {
        return count;
    }

    // increase count 
    function increment() 
    public returns(uint newCount)
     {
        count++; // takes the value and incrememnts it by 1 
        return count; 
    }


    //decrease count 
    function decrease() 
    public  returns (uint)
     {
        count --; 
        return count;
    }
    
    

  
    //store name/ set name 
  function getName() 
  public view returns( string memory currentName) 
  {
        return name; 
    }

    //CRUD system here 
    // create, read, update, delete
    function setName(string memory _newName)
     public returns(string memory newName) 
     {
        name = _newName;
        return name;

    } // sets a new name after the constructor has set it when it loaded up the first time. 

    //user can add custom amount to counter 
    function addNum(uint256 _addNum) public returns(uint totalNum ) {//_addNum didnt need memory because? perhaps the memory allocation isnt as needed as the strings
        count =  count + _addNum;
        return count;
    }
    //user can decrease custome amount to counter
    function minusNum(uint256 _minusNum) public returns(uint totalNum) {
        count = count - _minusNum; 
        return count;// uses gas because this changes value of count on BC
    }



}

