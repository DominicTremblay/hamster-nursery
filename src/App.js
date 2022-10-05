import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import HAMSTER_NURSERY_ABI from './abis/HamsterNursery.json';
import './App.css';

function App() {
  const [hamsters, setHamsters] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const getAccounts = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    setAccounts(accounts);
  };

  const getHamsters = async (contract) => {
    const hamsters = await contract.getHamsters();
    setHamsters(hamsters);
  };

  useEffect(() => {
    getAccounts().catch((err) => console.log(`Error: ${err.msg}`));

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

  const hamsterList = hamsters.map((hamsterArr) => (
    <li key={hamsterArr[0]}>{hamsterArr[0]}</li>
  ));

  return (
    <div className="App">
      <h1>Hamster Nursery</h1>

      {hamsterList}
    </div>
  );
}

export default App;
