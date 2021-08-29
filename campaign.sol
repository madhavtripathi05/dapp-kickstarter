// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recepient;
        bool complete;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;
    address[] public approvers;

    constructor(uint256 min) {
        minimumContribution = min;
        manager = msg.sender;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers.push(msg.sender);
    }

    function createRequest(
        string memory _description,
        uint256 _value,
        address _recepient
    ) public restricted {
        Request memory request = Request({
            description: _description,
            value: _value,
            recepient: _recepient,
            complete: false
        });
        requests.push(request);
    }
}
