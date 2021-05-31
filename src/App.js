import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      highest_bid: 0,
      balance: 0,
      owner: null,
      highest_bidder: null,
      bid :0
};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      
      
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  
  bid = async () => {
	try {
    	  const { accounts, contract } = this.state;
    	  await contract.methods.bid().send({ from: accounts[0] , value: this.state.bid});
	} catch (error) {
	  alert(
             `Failed to bid. Check console for details.`,
          );
          console.error(error);
	}
  };
  
  withdraw = async () => {
	try {
    	  const { accounts, contract } = this.state;
    	  await contract.methods.withdraw().send({ from: accounts[0] });
	} catch (error) {
	  alert(
             `Failed to bid. Check console for details.`,
          );
          console.error(error);
	}
  };
  
    details = async () => {
      const { accounts, contract, web3 } = this.state;
      const highest_bid_return = await contract.methods.highestBid().call();
      const highest_bidder_return = await contract.methods.highestBidder().call();
      const balance_return = await web3.eth.getBalance(contract.options.address);
      this.setState({ highest_bid: highest_bid_return, highest_bidder: highest_bidder_return, balance: balance_return });
      
    }
    
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Smart contract</h1>
        <p>Highest bidder : {this.state.highest_bidder}</p>
        <p>Highest bid : {this.state.highest_bid}</p>
        <p>Contract balance : {this.state.balance}</p>
        <input value={this.state.bid} onChange={event => this.setState({bid: event.target.value.replace(/\D/,'')})}/>

        <button onClick = {this.bid}>Bid</button>
        <p>To withdraw your bid <button onClick = {this.withdraw}>Withdraw</button></p>
        <p>Press to reload the details<button onClick = {this.details}>Show details</button></p>
      </div>
    );
  }
}

export default App;
