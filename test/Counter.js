// all test go here 

const {expect} = require('chai');
const {ethers} = require('hardhat'); // let us talk to the blockchain on the website. Connects to ethereum node. web3js is more for metamask interactions

describe('Counter that we want to test', () => {
    let counter; // we have to declare this variable to pass global counter contract

    beforeEach(async () => { // this will technically deploy contract in each describe hence before each
        const Counter = await ethers.getContractFactory('Counter')
         counter = await Counter.deploy('My Counter', 1)
    })

    describe('Deployment of contract', () => {
        

    // description of what the contract does
    it('sets the count', async () => {
        //    const Counter = await ethers.getContractFactory('Counter') // this is how we get the contract. pretty sure it gets it from the blockchain
        //    const counter = await Counter.deploy('MyCounter', 1)  // 'MyCounter', 1 is the constructor arugments that are required for teh contract to deploy
           const count = await counter.count() // we call the function here after deploying the contract. 
           expect(count).to.equal(1); // we are able to expect teh function to equal the number or variable in .equal()
           
           //fetch the count 
    
    
            //check count to make sure its what we expect
    
        })
    
        it('set the initial name', async () => {
            // const Counter = await ethers.getContractFactory('Counter') // this is how we get the contract. pretty sure it gets it from the blockchain
            // const counter = await Counter.deploy('MyCounter', 1)  // 'MyCounter', 1 is the constructor arugments that are required for teh contract to deploy
            const count = await counter.name() // we call the function here after deploying the contract. 
            expect(count).to.equal('My Counter'); // we are able to expect teh function to equal the number or variable in .equal()
            // this is too much recoding 
            //fetch the count 
     
     
             //check count to make sure its what we expect
     
         })
    })

    describe('Counting' , () => {
        let transaction

        it('reads the count from the "count" public variable ', async () => {
            expect(await counter.count()).to.equal(1)
        })
        
        it('reads the count from the "getCount()"  variable ',async  () => {
            expect(await counter.count()).to.equal(1)
        })

        it('increments the counts', async () => {
            transaction = await counter.increment();
            await transaction.wait();// need to await at the transaction for it to finish first
            expect(await counter.count()).to.equal(2);

            transaction = await counter.increment(); 
            await transaction.wait();
            expect(await counter.count()).to.equal(3);

        })
        
        it('decrements the counts', async () => {
            transaction = await counter.decrease(); // can call decrease function from smart contract
            await transaction.wait();// need to await at the transaction for it to finish first
            expect(await counter.count()).to.equal(0);

            //cannot decrement below 0
            await expect(counter.decrease()).to.be.reverted // will handle reversion 


        })


        it('reads the name from the "name" public variable ', async () => {
            expect(await counter.name()).to.equal('My Counter')
        })
        
        it('reads the name from the "getName()"  variable ',async  () => {
            expect(await counter.name()).to.equal('My Counter')
        })
        it('Updates the name', async () => {
            transaction = await counter.setName('New Name')
            await transaction.wait() // have to wait for this to finish 
            expect(await counter.name()).to.equal('New Name')
        })

    })




})

