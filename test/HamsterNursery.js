const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('HamsterNursery', () => {
  let hamsterNursery;

  beforeEach(async () => {
    // Get the contract
    const HamsterNursery = await ethers.getContractFactory('HamsterNursery');
    // deploy the contract
    hamsterNursery = await HamsterNursery.deploy();
    // wait for the contract to be deployed
    await hamsterNursery.deployed();
  });

  it('creates a hamster', async () => {
    await hamsterNursery.createHamster(
      'Bubbles',
      2,
      3
    );
    expect(await hamsterNursery.getCount()).to.be.equal(1);
  });
});
