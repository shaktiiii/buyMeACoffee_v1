// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MyContract {
    uint256 totalCoffee; 
    address payable public  owner; 

    constructor () payable {
        owner = payable(msg.sender);
    }

    event NewCoffee(
        address indexed from, 
        uint256 timestamp, 
        string message, 
        string name
    );

    struct Coffee {
        address sender; 
        string message; 
        string name; 
        uint256 timeStamp; 
    }

    Coffee[] coffee; 

    function getAllCoffee()  public view  returns (Coffee[] memory) {
        return coffee; 
    }

    function getTotalCoffee() public view returns (uint256){
        return totalCoffee; 
    }

    function buyCoffee(string memory _name, string memory _message) payable public {
        require(msg.value  == 0.01 ether, "You need to pay 0.01 ehters");
        
        totalCoffee += 1; 
        coffee.push(Coffee(msg.sender, _message, _name, block.timestamp)); 

        (bool success, ) = owner.call{value: msg.value}(""); 
        require(success, "failed to send Ehter to owner"); 

        emit NewCoffee(msg.sender, block.timestamp, _message, _name); 
    }

}