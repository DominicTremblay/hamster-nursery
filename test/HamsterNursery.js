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
    await hamsterNursery.createHamster('Bubbles', 2, 3);
    expect(await hamsterNursery.getCount()).to.be.equal(3);
  });

  it('creates 2 hamsters when deployed', async () => {
    expect(await hamsterNursery.getCount()).to.be.equal(2);
  });

  it('requires 0.05 ETH to create an offspring', async () => {
    const hamsters = await hamsterNursery.getHamsters();
    await expect(
      hamsterNursery.multiplyHamster(hamsters[0], hamsters[1], {
        value: ethers.utils.parseEther('0.04999'),
      })
    ).to.be.revertedWith('Please send at least 0.05 ETH');
  });

  it('multiplies hamsters', async () => {
    const hamsters = await hamsterNursery.getHamsters();
    await hamsterNursery.multiplyHamster(hamsters[0], hamsters[1], {
      value: ethers.utils.parseEther('0.05'),
    });

    expect(await hamsterNursery.getCount()).to.be.equal(3);
  });
});
