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
    event Error(string _message);
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool isComplete;
        uint256 approvalCount;
        uint256 donorsCount;
        mapping(address => bool) approvals;
    }
    address public manager;
    uint256 public minimumContribution;
    string campaignName;
    string campaignDescription;
    string campaignImageUrl;
    mapping(address => bool) public approvers;
    Request[] public requests;
    uint256 numRequests;
    uint256 public approversCount;

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
        require(msg.value >= minimumContribution);
        if (approvers[msg.sender] == false) {
            approvers[msg.sender] = true;
            approversCount++;
        } else {
            emit Error("Already a contributor");
        }
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public restricted {
        uint256 idx = requests.length;
        requests.push();
        Request storage newRequest = requests[idx];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = payable(recipient);
        newRequest.isComplete = false;
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
        require(!currentRequest.isComplete);
        require(currentRequest.approvalCount > (approversCount / 2));
        currentRequest.recipient.transfer(currentRequest.value);
        currentRequest.isComplete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            string memory
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager,
            campaignImageUrl
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}
