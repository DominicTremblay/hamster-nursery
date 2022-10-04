const { ethers } = require('hardhat');

async function main() {
  // fetch contract
  const HamsterNursery = await ethers.getContractFactory('HamsterNursery');
  // deployed the contract
  const hamsterNursery = await HamsterNursery.deploy();
  // we need to wait for confirmation the the contract is deployed on the blockchain
  await hamsterNursery.deployed();
  console.log('Address:', hamsterNursery.address);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
