// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Campaign {
    struct Request {
        address recepient;
        bool complete;
        string description;
        uint256 value;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;

    constructor(uint256 min) {
        minimumContribution = min;
        manager = msg.sender;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public restricted {
        uint256 idx = requests.length;
        // A way to create a new array element:
        requests.push();
        Request storage newRequest = requests[idx];
        // Alternative:
        // Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recepient = payable(recipient);
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 requestId) public {
        Request storage currentRequest = requests[requestId];
        require(approvers[msg.sender]);
        require(!currentRequest.approvals[msg.sender]);
        currentRequest.approvals[msg.sender] = true;
        currentRequest.approvalCount++;
    }
}
