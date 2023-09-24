// This file contains all the web3 logic

import React, { useContext, createContext } from 'react';
import{ useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

//  StateContextProvider -> It allows us to wrap our entire application with the context provider still render all of the childern thta are inside of it                                    
export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0x4Cd9a7EDe72e58d9fBc4AE7e97928838182D1E61');
    // To connect to the contract we have to provide the address of the deployed smart contract in the useContract() function

    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign'); //-> This allow us to call the function and create a campaign by passing all the parameters to it 
    
    const address = useAddress();  // -> Address of the smart wallet
    const connect = useMetamask();

    // Function that accepts a form
    const publishCampaign = async (form) => {
        try {
            const data = await createCampaign([
                address, // owner
                form.title, //title
                form.description, // description
                form.target, 
                new Date(form.deadline).getTime(), // deadline
                form.image
            ])

            console.log("contract call success", data)

        } catch (error) {
            console.log("contract call failure", error)
        }
    }

    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns');

        const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner : campaign.owner,
            title : campaign.title,
            description : campaign.description,
            target : ethers.utils.formatEther(campaign.target.toString()),
            deadline : campaign.deadline.toNumber(),
            amountCollected : ethers.utils.formatEther(campaign.amountCollected.toString()),
            image : campaign.image,
            pId : i  
        }));

        return parsedCampaigns;
    }

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();

        const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

        return filteredCampaigns;
    }

    const donate = async (pId, amount) => {
        const data = await contract.call('donateToCampaign', pId, {value: ethers.utils.parseEther(amount)});

        return data;
    }

    const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', pId);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for(let i = 0; i < numberOfDonations; i++){
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }

        return parsedDonations;
    }

    return (
        <StateContext.Provider
            value={{       // Value -> Value is everything that we    want to share across all your components
                address,  // -> address of our smart wallet
                contract,
                connect,
                createCampaign: publishCampaign,
                // |-> This is the name of the contract call, so we need to refer to our publishCampaign function
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
            }}
        >
            { children }
        </StateContext.Provider>
    )
}

export const useStateContext = () => (StateContext);