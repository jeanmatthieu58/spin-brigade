// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/SpinBrigade.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        SpinBrigade spinBrigade = new SpinBrigade();
        
        console.log("SpinBrigade deployed to:", address(spinBrigade));
        console.log("Owner set to:", spinBrigade.owner());
        console.log("Standard spin price:", spinBrigade.STANDARD_SPIN_PRICE());
        console.log("Premium spin price:", spinBrigade.PREMIUM_SPIN_PRICE());
        
        vm.stopBroadcast();
    }
}
