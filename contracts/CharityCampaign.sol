// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityCampaign {
    struct Campaign {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 goalAmount;
        uint256 currentAmount;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
        bool isCompleted;
    }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        string message;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Donation[]) public campaignDonations;
    mapping(address => uint256[]) public userCampaigns;
    mapping(address => Donation[]) public userDonations;

    uint256 public campaignCount;
    uint256 public totalDonations;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 goalAmount
    );

    event DonationMade(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount,
        uint256 timestamp
    );

    event CampaignCompleted(uint256 indexed campaignId, uint256 totalAmount);

    modifier campaignExists(uint256 _campaignId) {
        require(campaigns[_campaignId].creator != address(0), "Campaign does not exist");
        _;
    }

    modifier campaignActive(uint256 _campaignId) {
        require(campaigns[_campaignId].isActive, "Campaign is not active");
        require(block.timestamp <= campaigns[_campaignId].endDate, "Campaign has ended");
        _;
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goalAmount,
        uint256 _endDate
    ) public returns (uint256) {
        require(_goalAmount > 0, "Goal amount must be greater than 0");
        require(_endDate > block.timestamp, "End date must be in the future");

        campaignCount++;
        
        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            title: _title,
            description: _description,
            creator: msg.sender,
            goalAmount: _goalAmount,
            currentAmount: 0,
            startDate: block.timestamp,
            endDate: _endDate,
            isActive: true,
            isCompleted: false
        });

        userCampaigns[msg.sender].push(campaignCount);

        emit CampaignCreated(campaignCount, msg.sender, _title, _goalAmount);

        return campaignCount;
    }

    function donate(uint256 _campaignId, string memory _message) 
        public 
        payable 
        campaignExists(_campaignId)
        campaignActive(_campaignId)
    {
        require(msg.value > 0, "Donation amount must be greater than 0");

        Campaign storage campaign = campaigns[_campaignId];
        campaign.currentAmount += msg.value;

        Donation memory newDonation = Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        });

        campaignDonations[_campaignId].push(newDonation);
        userDonations[msg.sender].push(newDonation);
        totalDonations += msg.value;

        emit DonationMade(_campaignId, msg.sender, msg.value, block.timestamp);

        // Check if goal is reached
        if (campaign.currentAmount >= campaign.goalAmount && !campaign.isCompleted) {
            campaign.isCompleted = true;
            campaign.isActive = false;
            emit CampaignCompleted(_campaignId, campaign.currentAmount);
        }
    }

    function getCampaign(uint256 _campaignId) 
        public 
        view 
        returns (
            uint256 id,
            string memory title,
            string memory description,
            address creator,
            uint256 goalAmount,
            uint256 currentAmount,
            uint256 startDate,
            uint256 endDate,
            bool isActive,
            bool isCompleted
        )
    {
        Campaign memory campaign = campaigns[_campaignId];
        return (
            campaign.id,
            campaign.title,
            campaign.description,
            campaign.creator,
            campaign.goalAmount,
            campaign.currentAmount,
            campaign.startDate,
            campaign.endDate,
            campaign.isActive,
            campaign.isCompleted
        );
    }

    function getCampaignDonations(uint256 _campaignId) 
        public 
        view 
        returns (Donation[] memory)
    {
        return campaignDonations[_campaignId];
    }

    function getUserCampaigns(address _user) 
        public 
        view 
        returns (uint256[] memory)
    {
        return userCampaigns[_user];
    }

    function getUserDonations(address _user) 
        public 
        view 
        returns (Donation[] memory)
    {
        return userDonations[_user];
    }

    function withdrawFunds(uint256 _campaignId) 
        public 
        campaignExists(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.creator == msg.sender, "Only creator can withdraw");
        require(campaign.isCompleted || block.timestamp > campaign.endDate, "Campaign is still active");
        require(campaign.currentAmount > 0, "No funds to withdraw");

        uint256 amount = campaign.currentAmount;
        campaign.currentAmount = 0;
        campaign.isActive = false;

        payable(campaign.creator).transfer(amount);
    }

    function getTotalCampaigns() public view returns (uint256) {
        return campaignCount;
    }

    function getTotalDonations() public view returns (uint256) {
        return totalDonations;
    }
}
