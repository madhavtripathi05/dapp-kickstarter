// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(
        uint256 minimumAmount,
        string memory name,
        string memory description,
        string memory imageUrl
    ) public {
        address newCampaign = address(
            new Campaign(minimumAmount, name, description, imageUrl, msg.sender)
        );
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        address payable recepient;
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

    address public manager;
    mapping(address => bool) public approvers;
    uint256 public minimumContribution;
    uint256 public approversCount;
    string campaignName;
    string campaignDescription;
    string campaignImageUrl;
    Request[] public requests;

    constructor(
        uint256 minimumAmount,
        string memory name,
        string memory description,
        string memory imageUrl,
        address campaignCreatorAddress
    ) {
        manager = campaignCreatorAddress;
        minimumContribution = minimumAmount;
        campaignName = name;
        campaignDescription = description;
        campaignImageUrl = imageUrl;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
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

    function finalizeRequest(uint256 requestId) public restricted {
        Request storage currentRequest = requests[requestId];
        require(!currentRequest.complete);
        require(currentRequest.approvalCount >= (approversCount / 2));
        currentRequest.recepient.transfer(currentRequest.value);
        currentRequest.complete = true;
    }
}
