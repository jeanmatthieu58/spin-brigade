// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SpinBrigade {
    struct SpinResult {
        uint256 recipeId;
        uint256 timestamp;
        address user;
        uint8 spinType; // 0=free, 1=standard, 2=premium
    }
    
    mapping(address => SpinResult[]) public userSpins;
    mapping(address => uint256) public totalSpins;
    mapping(address => uint256) public premiumSpins;
    mapping(address => uint256) public lastFreeSpinDay;
    mapping(address => uint256) public lastSpinTime;
    mapping(address => uint256[]) public favoriteRecipes;
    
    uint256 public constant TOTAL_RECIPES = 8;
    uint256 public constant STANDARD_SPIN_PRICE = 0.001 ether;
    uint256 public constant PREMIUM_SPIN_PRICE = 0.01 ether;
    uint256 public constant COOLDOWN_PERIOD = 10; // 10 seconds
    
    uint256 public globalTotalSpins;
    uint256 public globalTotalRevenue;
    uint256 public globalTotalUsers;
    
    address public owner;
    
    string[8] public recipeNames = [
        "Spaghetti Carbonara",
        "Chocolate Chip Cookies", 
        "Beef Tacos",
        "Caesar Salad",
        "Margherita Pizza",
        "Chicken Curry",
        "Apple Pie",
        "Fish & Chips"
    ];
    
    event RecipeSpun(
        address indexed user,
        uint256 recipeId,
        string recipeName,
        uint8 spinType,
        uint256 timestamp
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier cooldownCheck() {
        require(
            block.timestamp >= lastSpinTime[msg.sender] + COOLDOWN_PERIOD,
            "Cooldown period active"
        );
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function dailyFreeSpin() external cooldownCheck {
        uint256 currentDay = block.timestamp / 86400;
        require(lastFreeSpinDay[msg.sender] < currentDay, "Free spin already used today");
        
        lastFreeSpinDay[msg.sender] = currentDay;
        _executeSpin(0); // 0 = free spin
    }
    
    function standardSpin() external payable cooldownCheck {
        require(msg.value >= STANDARD_SPIN_PRICE, "Insufficient payment for standard spin");
        
        globalTotalRevenue += msg.value;
        _executeSpin(1); // 1 = standard spin
    }
    
    function premiumSpin() external payable cooldownCheck {
        require(msg.value >= PREMIUM_SPIN_PRICE, "Insufficient payment for premium spin");
        
        globalTotalRevenue += msg.value;
        premiumSpins[msg.sender]++;
        _executeSpin(2); // 2 = premium spin
    }
    
    function _executeSpin(uint8 spinType) internal {
        // Generate pseudo-random recipe ID
        uint256 recipeId = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender,
            blockhash(block.number - 1),
            globalTotalSpins,
            spinType
        ))) % TOTAL_RECIPES + 1;
        
        // For premium spins, prefer premium recipes (5-8)
        if (spinType == 2) {
            recipeId = ((recipeId - 1) % 4) + 5; // Recipes 5-8
        } else {
            // For free/standard spins, prefer basic recipes (1-4) but can get premium
            if (recipeId > 4 && spinType != 2) {
                // 30% chance to get premium recipe on standard spin
                if (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 100 > 70) {
                    recipeId = ((recipeId - 1) % 4) + 1; // Convert to basic recipe
                }
            }
        }
        
        SpinResult memory newSpin = SpinResult({
            recipeId: recipeId,
            timestamp: block.timestamp,
            user: msg.sender,
            spinType: spinType
        });
        
        userSpins[msg.sender].push(newSpin);
        totalSpins[msg.sender]++;
        lastSpinTime[msg.sender] = block.timestamp;
        globalTotalSpins++;
        
        // Track if this is user's first spin
        if (totalSpins[msg.sender] == 1) {
            globalTotalUsers++;
        }
        
        emit RecipeSpun(
            msg.sender,
            recipeId,
            recipeNames[recipeId - 1],
            spinType,
            block.timestamp
        );
    }
    
    function getUserStats(address user) external view returns (
        uint256 _totalSpins,
        uint256 _premiumSpins,
        uint256 _level,
        bool _canFreeSpin,
        uint256 _cooldownRemaining,
        uint256[] memory _favoriteRecipes
    ) {
        _totalSpins = totalSpins[user];
        _premiumSpins = premiumSpins[user];
        _level = (_totalSpins / 10) + 1; // Level up every 10 spins
        
        uint256 currentDay = block.timestamp / 86400;
        _canFreeSpin = lastFreeSpinDay[user] < currentDay;
        
        uint256 timeSinceLastSpin = block.timestamp - lastSpinTime[user];
        _cooldownRemaining = timeSinceLastSpin >= COOLDOWN_PERIOD ? 0 : COOLDOWN_PERIOD - timeSinceLastSpin;
        
        _favoriteRecipes = favoriteRecipes[user];
    }
    
    function getGlobalStats() external view returns (
        uint256 _totalSpins,
        uint256 _totalRevenue,
        uint256 _totalUsers,
        uint256 _spinPrice,
        uint256 _premiumSpinPrice
    ) {
        return (
            globalTotalSpins,
            globalTotalRevenue,
            globalTotalUsers,
            STANDARD_SPIN_PRICE,
            PREMIUM_SPIN_PRICE
        );
    }
    
    function getUserSpins(address user) external view returns (SpinResult[] memory) {
        return userSpins[user];
    }
    
    function getRecipeName(uint256 recipeId) external view returns (string memory) {
        require(recipeId > 0 && recipeId <= TOTAL_RECIPES, "Invalid recipe ID");
        return recipeNames[recipeId - 1];
    }
    
    function addFavoriteRecipe(uint256 recipeId) external {
        require(recipeId > 0 && recipeId <= TOTAL_RECIPES, "Invalid recipe ID");
        
        // Check if already in favorites
        for (uint i = 0; i < favoriteRecipes[msg.sender].length; i++) {
            if (favoriteRecipes[msg.sender][i] == recipeId) {
                return; // Already in favorites
            }
        }
        
        favoriteRecipes[msg.sender].push(recipeId);
    }
    
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
