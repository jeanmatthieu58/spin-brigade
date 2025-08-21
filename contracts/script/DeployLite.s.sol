// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/SpinBrigadeLite.sol";

contract DeployLiteScript is Script {
    function run() external {
        uint256 deployerPrivateKey = 0x1170c3edfb78f25122b34cd2cd83b71913552360a21915fbee197946e9f5b871;
        
        vm.startBroadcast(deployerPrivateKey);
        
        SpinBrigadeLite spinBrigade = new SpinBrigadeLite();
        
        console.log("===============================================");
        console.log("SpinBrigadeLite Deployment Complete!");
        console.log("===============================================");
        console.log("Contract deployed to:", address(spinBrigade));
        console.log("Deployer:", msg.sender);
        console.log("Total Recipes:", spinBrigade.TOTAL_RECIPES());
        console.log("Spin Price:", spinBrigade.SPIN_PRICE());
        console.log("Premium Price:", spinBrigade.PREMIUM_PRICE());
        console.log("===============================================");
        console.log("Explorer:");
        console.log("https://testnet-explorer.monad.xyz/address/");
        console.log(address(spinBrigade));
        console.log("===============================================");
        
        vm.stopBroadcast();
    }
}
