// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target; // Target amount we want to achieve
        uint256 deadline;
        uint256 amountCollected;
        string image; // type is string because we will be putting an URL of the image.
        address[] donators; // Array of address to store the addresses of the donators
        uint[] donations; // Array of numbers type to store the amount of the donations
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        // In solidity require is used to test or check that is everything okay?
        require(
            campaign.deadline < block.timestamp,
            "The deadline should be a date in future."
        ); // -> This will check if we creating a campaign and the start date and the end date of the campaign is same
        // block.timestamp -> It represents the current time

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1; // -> This is going to be the index of the msot newly campaign
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id]; // to access campaigns created through mapping

        campaign.donators.push(msg.sender); // We want to push the address of the person that donated
        campaign.donations.push(amount); // We want to push the amount that a donator has donated

        (bool sent, ) = payable(campaign.owner).call{value: amount}(""); // -> This line means that the funds are transfering to the owners account
        // sent -> sent is the variable that's going to let us know if the transaction has been sent or not

        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    // This function is going to give us a list of all the people that donated to a campaign
    function getDonaters(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations); // -> This is returning the amount which is funded and the address from which it is funded
    }

    // Function to get a list of all campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        // Campaign memory -> this means we want to return an array of Campaigns and we want to get them from the memory
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }
        return allCampaigns;
    }
}
