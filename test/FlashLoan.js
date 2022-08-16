const {expect} = require('chai'); 
const {ethers} = require('hardhat')

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}
const ether = tokens; // this will be able to inherit tokens function and transfer it into ether. 


describe('FlashLoan', () => {
    let token, flashLoan, flashLoanReceiver
  let deployer, user1
    beforeEach(async () => {
        // setup accounts 
        accounts = await ethers.getSigners()
        deployer = accounts[0]



        // load accounts
        const FlashLoan = await ethers.getContractFactory('FlashLoan')
        const FlashLoanReceiver = await ethers.getContractFactory('FlashLoanReceiver');
        const Token = await ethers.getContractFactory('Token')

        //deploy token
        token = await Token.deploy('JAVSWB', 'JAV', '10000000');
        //deploy flash loan pool
        flashLoan = await FlashLoan.deploy(token.address)
        
        //approve tokens first when using transferFrom method in smart contract 
        let transaction = await token.connect(deployer).approve(flashLoan.address, tokens(10000000))
        await transaction.wait()

        //deposity tokens in the pool
         transaction = await flashLoan.connect(deployer).depositTokens(tokens(10000000))
        await transaction.wait();

        // deploy flash loan Receiver
        flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.address)
        

    })

    describe('Deployment',  () => {
        it('sends token to flash loan pool contract', async   () => { // verify we have funds in this flash loan to borrow
            // expect(1+1).to.equal(2) will test if it is working
            // require(amount > 0, 'must depost atleast one token')
            expect(await token.balanceOf(flashLoan.address)).to.equal(tokens(10000000))
        })
    })

    describe('Borrowing Funds', () => {
        it('borrows funds from the pool', async () => {
            let amount = tokens(100); 
            let transaction = await flashLoanReceiver.connect(deployer).executeFlashLoan(amount)
            let result = await transaction.wait();

            await expect(transaction).to.emit(flashLoanReceiver, 'LoanReceived').withArgs(token.address, amount);// gets to emit the event we create on the sol contract
            
        })
    })

})