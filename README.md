# Blockchain Development With Solidity

## 1. Seting Up the Environment

### 1.1 VS Code

* [install the Hardhat extension for VS Code](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity) 

### 1.2 Install the Front-End

* install react

> `npx create-react-app hamster_nursery` or `npx create-react-app@latest hamster_nursery`

> `cd hamster_nursery`

### 1.3 Set Up Hardhat

* create hardhat sample project

  > `npm install --save-dev hardhat@latest`

  > `npx hardhat`

* select `Create an empty hardhat.config.js`

* install hardhat libraries

> `npm install --save-dev @nomicfoundation/hardhat-toolbox`

The @nomicfoundation/hardhat-toolbox plugin bundles all the commonly used packages and Hardhat plugins to start developing with Hardhat. [more info on hardhat-toolbox](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox)

* require hardhat-toolbox at the top of hardhat.config.js

  > `require('@nomicfoundation/hardhat-toolbox');`

* create folders

* `mkdir contracts`
* `mkdir scripts`
* `mkdir tests`

### 1.4 Create the Contract

* create `HamsterNursery.sol` in the `contracts` folder 

* add console.log functionality

```js
  // SPDX-License-Identifier: MIT
  pragma solidity ^ 0.8 .17;

  import "hardhat/console.sol";

  contract HamsterNursery {

  }
```

#### 1.4.1 Create the Hamster Type

i. Add 2 `enums` for the hamster characteristics

```js
  contract HamsterNursery {
      enum ColorType {
          golden,
          beige,
          brown,
          black,
          blonde,
          chocolate,
          cream,
          dove,
          grey,
          lilac,
          sable,
          mink,
          rust,
          white
      }
      enum PatternType {
          banded,
          dominantspot,
          tortoiseshell,
          recessivedappled,
          cinnamon
      }
```

  ii. Create the Hamster type with a struct

```js
      struct Hamster {
          string name;
          ColorType color;
          PatternType pattern;
      }
```

  iii. Create an array of Hamsters

  > `Hamster[] public hamsters;`

#### 1.4.2 Write the createHamster function

```js
  function _createHamster(
      string memory _name,
      ColorType _color,
      PatternType _pattern
  ) private {
      // create the new hamster
      Hamster memory newHamster = Hamster(_name, _color, _pattern);
      // add the hamster to the array
      hamsters.push(newHamster);
  }
```

### 1.5 Compiling the Contract

* To compile the contract run the following command:

  > `npx hardhat compile`

* Compilation will add new folders `artifacts` and `cache`

* We can have a look at `HamsterNursery.json` we see that it contains the abi and the bytecode

### 1.6 Deploying the Contract

#### 1.6.1 Start the Hardhat Node 

* Your can test your smart contracts locally by running the Harhat Ethereum node. You get 20 test accounts with 10000 ETH each!

> WARNING: These accounts, and their private keys, are publicly known.

Any funds sent to them on Mainnet or any other live network WILL BE LOST.

* Run a local blockchain node with Hardhat.

* In a separate terminal window, run the following command:

  > `npx hardhat node`

#### 1.6.2 Creating the Deployment Script

i. Create a `01_deploy.js` file in the `script` folder and insert `const { ethers } = require('hardhat');` at the top

ii. Write the following script

```js
  const {
      ethers
  } = require('hardhat');

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
  }
```

iii. run the script

 `npx hardhat run --network localhost scripts/01_deploy.js`

#### 1.6.3 Creating Tests

i. Create `HamsterNursery.js` in the `Test` folder

ii. Add the following imports at the top of the file

```js
const {
    expect
} = require('chai');
const {
    ethers
} = require('hardhat');
```

iii. Write the describe block with a beforeEach to deploy the contract

```js
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

});
```

iv. Write the test for the createHamster function

```js
it('creates a hamster', async () => {
    await hamsterNursery.createHamster(
        'Bubbles',
        2,
        3
    );
    expect(await hamsterNursery.getCount()).to.be.equal(1);
});
```

* Note: we have to pass int values for the color and the pattern 

v. for the test to run, we need to declare the getCount function in the contract

```js
  function getCount() public view returns(uint) {
      return hamsters.length;
  }
```

#### 1.6.3 Add a Constructor

i. We would like to start with our array of of hamsters containing 2 hamsters. Let's add a constructor.

```js
  // add 2 hamsters
  constructor() {
      createHamster('Bubbles', ColorType.brown, PatternType.banded);
      createHamster('Fluffy', ColorType.cream, PatternType.cinnamon);
  }
```

ii. Let's create the test to check that we have our 2 hamsters

```js
  it('creates 2 hamsters when deployed', async () => {
      expect(await hamsterNursery.getCount()).to.be.equal(2);
  });
```

* note: we need to change our create a hamster test, because it should have 3 hamsters in the array instead of 1

#### 1.6.4 Write the multiplyHamster function

* We're going to create a new hamster out of 2 parent hamsters
* We're just using super simple formulas to generate the name, the color and the pattern
* We're going to allow the hamster to multiply only is we send 0.05 ETH!

```js
function multiplyHamster(Hamster memory hamster1, Hamster memory hamster2) public payable {

    require(msg.value >= 0.05 ether, "Please send at least 0.05 ETH");

    // creating a new color based on hamster1 and hamster2
    uint8 color1 = uint8(hamster1.color);
    uint8 color2 = uint8(hamster2.color);
    uint8 colorLength = uint8(type(ColorType).max) + 1;
    uint8 offSringcolor = (color1 + color2) % colorLength;

    //creating a new pattern based on hamster1 and hamster2
    uint8 pattern1 = uint8(hamster1.pattern);
    uint8 pattern2 = uint8(hamster2.pattern);
    uint8 patternLength = uint8(type(PatternType).max) + 1;
    uint8 offsringPattern = (pattern1 + pattern2) % patternLength;

    // create the offspring
    createHamster(
        string.concat(hamster1.name, hamster2.name),
        ColorType(offSringcolor),
        PatternType(offsringPattern)
    );
}
```

i. We'll need a getter function to test this out

```js
  function getHamsters() public view returns(Hamster[] memory) {
      return hamsters;
  }
```

ii. We can create the following tests

* the first test catch the fact that we don't send enough eth
* the second test checks we create an offspring

```js
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
```

iii. Make sure to redeploy the contract

  > `npx hardhat run --network localhost script/01_deploy.js`

## 2. Set Up the Front-End

### 2.1 Set Up dotenv

i. create a `.env` file at the root

ii. add the contract address to the .dotenv file

  > `REACT_APP_CONTRACT_ADDRESS=[contract address]`

* note: the contract address can be found on the local hardhat node

### 2.2 Set Up ABIS

i. create the `abis` folder under `src`

ii. create a file `HamsterNursery.json` in `abis`

iii. copy the abi array from `artifacts/contracts/HamsterNursery.sol/HamsterNursery.json` into `src/HamsterNursery.json`

iv. import the abi at the top of App.js 

 `import HAMSTER_NURSERY_ABI from './abis/HamsterNursery.json';`

### Connect ethers.js

* import ethers at the top of App.js `import { ethers } from 'ethers';`

### 2.3 Connect to the Blockchain with useEffect

i. Create a useEffect hook

```js
function App() {
    useEffect(() => {

    }, []);
```

ii. Connect to the Provider

```js
function App() {
    useEffect(() => {
        // connect to the provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
    }, []);
```

iii. Get the Smart Contract

```js
  useEffect(() => {
      // connect to the provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // talk to the smart contract
      const hamsterNursery = new ethers.Contract(
          process.env.REACT_APP_CONTRACT_ADDRESS,
          HAMSTER_NURSERY_ABI,
          provider
      );

      console.log('Contract Address:', hamsterNursery.address);
      getHamsters(hamsterNursery);
  }, []);
```

iv. Create a state to hold the hamster array

  > `const [hamsters, setHamsters] = useState([]);`

v. write a getHamters function 

```js
  const [hamsters, setHamsters] = useState([]);

  const getHamsters = async (contract) => {
      const hamsters = await contract.getHamsters();
      setHamsters(hamsters);
  };

  useEffect(() => {
      // connect to the provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // talk to the smart contract
      const hamsterNursery = new ethers.Contract(
          process.env.REACT_APP_CONTRACT_ADDRESS,
          HAMSTER_NURSERY_ABI,
          provider
      );

      console.log('Contract Address:', hamsterNursery.address);
      getHamsters(hamsterNursery);
  }, []);
```

vi. Display the Hamsters'names on the page

```js
const hamsterList = hamsters.map((hamsterArr) => < li key = {
            hamsterArr[0]
        } > {
            hamsterArr[0]
        } < /li>);

        return ( <
            div className = "App" >
            <
            h1 > Hamster Nursery < /h1>

            {
                hamsterList
            } <
            /div>
        );
```

## 3. Running the project

i. Clone the project and install the dependencies
ii. Run the hardhat local blockchain. Type the following in a separate window

> `npx hardhat node`

iii. Deploy the contrat. In an new terminal window, type

> `npx hardhat run --network localhost scripts/01_deploy.js`

- Get the address of the contract from the hardhat node

iv. Create `.env` file and add the contract address

> `REACT_APP_CONTRACT_ADDRESS=<your contract address>`

v. Running the tests

> `npx hardhat test`

vi. Run the Front-End

> `npm start`
