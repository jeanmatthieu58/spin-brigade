// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SpinBrigadeLite - Version Gas Optimisée
 * @dev Version minimale pour déploiement économique
 */
contract SpinBrigadeLite {
    
    // ==================== STORAGE OPTIMISÉ ====================
    
    struct Spin {
        uint32 recipeId;
        uint32 timestamp;
        bool isPremium;
    }
    
    mapping(address => Spin[]) public userSpins;
    mapping(address => uint32) public lastSpinTime;
    
    // Constants (pas de storage)
    uint8 public constant TOTAL_RECIPES = 8;
    uint8 public constant PREMIUM_START = 5;
    uint32 public constant COOLDOWN = 10;
    
    // Prix en wei (constants = pas de storage)
    uint256 public constant SPIN_PRICE = 0.001 ether;
    uint256 public constant PREMIUM_PRICE = 0.01 ether;
    
    // Stats globales (packed)
    uint32 public totalSpins;
    address public owner;
    
    // ==================== EVENTS ====================
    
    event Spun(address user, uint8 recipeId, bool premium);
    
    // ==================== MODIFIERS ====================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier cooldown() {
        require(block.timestamp >= lastSpinTime[msg.sender] + COOLDOWN, "Cooldown");
        _;
    }
    
    // ==================== CONSTRUCTOR ====================
    
    constructor() {
        owner = msg.sender;
    }
    
    // ==================== MAIN FUNCTIONS ====================
    
    /**
     * @dev Spin gratuit (une fois par jour)
     */
    function freeSpin() external cooldown {
        require(_canFreeSpin(msg.sender), "No free spin");
        
        uint8 recipeId = _randomRecipe(false);
        _processSpin(recipeId, false);
    }
    
    /**
     * @dev Spin payant standard
     */
    function spin() external payable cooldown {
        require(msg.value >= SPIN_PRICE, "Insufficient payment");
        
        uint8 recipeId = _randomRecipe(false);
        _processSpin(recipeId, false);
    }
    
    /**
     * @dev Spin premium
     */
    function premiumSpin() external payable cooldown {
        require(msg.value >= PREMIUM_PRICE, "Insufficient payment");
        
        uint8 recipeId = _randomRecipe(true);
        _processSpin(recipeId, true);
    }
    
    // ==================== INTERNAL ====================
    
    function _randomRecipe(bool premium) internal view returns (uint8) {
        uint256 seed = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            msg.sender,
            totalSpins
        )));
        
        if (premium) {
            return uint8(PREMIUM_START + (seed % (TOTAL_RECIPES - PREMIUM_START + 1)));
        } else {
            return uint8((seed % PREMIUM_START) + 1);
        }
    }
    
    function _processSpin(uint8 recipeId, bool premium) internal {
        userSpins[msg.sender].push(Spin({
            recipeId: recipeId,
            timestamp: uint32(block.timestamp),
            isPremium: premium
        }));
        
        lastSpinTime[msg.sender] = uint32(block.timestamp);
        totalSpins++;
        
        emit Spun(msg.sender, recipeId, premium);
    }
    
    function _canFreeSpin(address user) internal view returns (bool) {
        uint256 today = block.timestamp / 86400;
        Spin[] memory spins = userSpins[user];
        
        for (uint i = spins.length; i > 0; i--) {
            if (spins[i-1].timestamp / 86400 == today) {
                return false;
            }
            if (spins[i-1].timestamp / 86400 < today) {
                break;
            }
        }
        return true;
    }
    
    // ==================== VIEW FUNCTIONS ====================
    
    function getUserSpins(address user) external view returns (Spin[] memory) {
        return userSpins[user];
    }
    
    function getRecipeName(uint8 recipeId) external pure returns (string memory) {
        string[8] memory names = [
            "Spaghetti Carbonara",
            "Chocolate Cookies", 
            "Beef Tacos",
            "Caesar Salad",
            "Margherita Pizza",
            "Chicken Curry",
            "Apple Pie",
            "Fish & Chips"
        ];
        return names[recipeId - 1];
    }
    
    // ==================== ADMIN ====================
    
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
