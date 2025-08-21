// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/SpinBrigade.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        SpinBrigade spinBrigade = new SpinBrigade();
        
        console.log("===============================================");
        console.log("🚀 Spin Brigade Deployment Complete!");
        console.log("===============================================");
        console.log("SpinBrigade deployed to:", address(spinBrigade));
        console.log("Deployer:", msg.sender);
        console.log("Network Chain ID:", block.chainid);
        console.log("===============================================");
        console.log("📋 Contract Details:");
        console.log("- Total Recipes:", spinBrigade.TOTAL_RECIPES());
        console.log("- Spin Price:", spinBrigade.spinPrice());
        console.log("- Premium Price:", spinBrigade.premiumSpinPrice());
        console.log("===============================================");
        console.log("🔗 Next Steps:");
        console.log("1. Update frontend contract address");
        console.log("2. Get MON tokens from faucet");
        console.log("3. Test the dApp!");
        console.log("===============================================");
        
        vm.stopBroadcast();
    }
}
