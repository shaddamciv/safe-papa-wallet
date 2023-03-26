// EnzymeFinanceVault.sol
pragma solidity ^0.8.13;

// Import Enzyme Finance contracts
import "lib/protocol/contracts/release/core/fund-deployer/FundDeployer.sol";
import "@enzymefinance/protocol/contracts/IFund.sol";

contract EnzymeFinanceVault {
    FundDeployer public fundDeployer;
    address public owner;
    // Constructor
    constructor(address _fundDeployerAddress) {
        fundDeployer = FundDeployer(_fundDeployerAddress);
        owner = msg.sender;
    }

    // Create a new fund
    function createNewFund(string memory _name, 
                           string memory _symbol,
                           address _dai) public {
        require(msg.sender == owner, "Only the owner can create a new fund");

        address newFund = fundDeployer.createNewFund(owner, _dai, shares_action_time_lock, fee_manager_config_data, policy_manager_config_data,)
        fund = IFund(newFund);

        // Set fund parameters
        fund.setExposureSettings(
            [0xToken1Address, 0xToken2Address], // Array of token addresses
            [100000000, 50000000], // Array of token amounts
            true // Is the fund private?
        );

        // Activate fund
        fund.activate();

        // Deposit tokens into the fund
        fund.invest(0xToken1Address, 100000000);
        fund.invest(0xToken2Address, 50000000);
    }

    // Get the value of the fund
    function getFundValue() public view returns (uint256) {
        return aggregation.getFundValue(fund);
    }

    // Withdraw tokens from the fund
    function withdrawFromFund(address _tokenAddress, uint256 _amount) public {
        require(msg.sender == owner, "Only the owner can withdraw tokens");

        fund.withdraw(_tokenAddress, _amount);
    }
}
// EnzymeFinanceVault.sol
pragma solidity ^0.8.0;

// Import Enzyme Finance contracts
import "@enzymefinance/protocol/contracts/IAggregation.sol";
import "@enzymefinance/protocol/contracts/IFundDeployer.sol";
import "@enzymefinance/protocol/contracts/IFund.sol";

contract EnzymeFinanceVault {
    IAggregation public aggregation;
    IFundDeployer public fundDeployer;
    IFund public fund;
    address public owner;

    // Constructor
    constructor() {
        aggregation = IAggregation(0xAggregationAddress);
        fundDeployer = IFundDeployer(0xFundDeployerAddress);
        owner = msg.sender;
    }

    // Create a new fund
    function createNewFund(string memory _name, string memory _symbol) public {
        require(msg.sender == owner, "Only the owner can create a new fund");

        address newFund = fundDeployer.createFund(_name, _symbol);
        fund = IFund(newFund);

        // Set fund parameters
        fund.setExposureSettings(
            [0xToken1Address, 0xToken2Address], // Array of token addresses
            [100000000, 50000000], // Array of token amounts
            true // Is the fund private?
        );

        // Activate fund
        fund.activate();

        // Deposit tokens into the fund
        fund.invest(0xToken1Address, 100000000);
        fund.invest(0xToken2Address, 50000000);
    }

    // Get the value of the fund
    function getFundValue() public view returns (uint256) {
        return aggregation.getFundValue(fund);
    }

    // Withdraw tokens from the fund
    function withdrawFromFund(address _tokenAddress, uint256 _amount) public {
        require(msg.sender == owner, "Only the owner can withdraw tokens");

        fund.withdraw(_tokenAddress, _amount);
    }
}
