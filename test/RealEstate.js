const {expect} = require('chai')
const {ethers} = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}
const ether = tokens; // this will be able to inherit tokens function and transfer it into ether. 

describe('RealEstate', () => {
    let realEstate, escrow; // gotta initialize global vraiables of escrow and real estate
    let deployer, buyer,  seller, inspector, lender
    let nftID = 1;
    let escrowAmount = ether(20)
    let purchasePrice = ether(100)
    
    beforeEach(async () => {
        // get accounts
        accounts = await ethers.getSigners()// gets accounts 
        deployer = accounts[0]
        seller = deployer// the person that deployed the contract will have an object in seller reasigned
        buyer = accounts[1]// buyer will be the person that put the contract up in the first place? 
        inspector = accounts[2]
        lender = accounts[3]


        // load contracts
        const RealEstate = await ethers.getContractFactory('RealEstate');
        const Escrow = await ethers.getContractFactory('Escrow');
        // deploy contracts 
         realEstate = await RealEstate.deploy() // remember to leave out let or var because then these are new variables.
        escrow = await Escrow.deploy(//remember to label in order the variables as in the constructor
            realEstate.address, // reads the address from the smart contract of the nft address uri 
            nftID,
            purchasePrice, // will be purchase price
            escrowAmount, // 20% down payment for this escrow transaction
            // 100000000000000000000 wei = 1 ether
            seller.address, 
            buyer.address,
            inspector.address, 
            lender.address
        )// we want to reassign varibales here not make new ones
        
        // seller approves NFT 
        transaction = await realEstate.connect(seller).approve(escrow.address, nftID)
            // seller connects to the realEstate contract and calls the approve function in order to approve the transation 
            await transaction.wait()
    })


    describe('deployment', () => {
        it('seller/deployer has NFT', async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)// we gotta do .address to get the actual address from the seller object
        })// checks to see if the nft has an owner
    })


    describe('Selling Real Estate', async () => {
        let balance, transaction;
        it('Excecutes a successful transaction', async () => {
          // expects seller to be nft onwer before the sale
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)// we gotta do .address to get the actual address from the seller object
            // buyer deposits earnist 
            // console.log('escrow Balance', ethers.utils.formatEther(balance))
            transaction = await escrow.connect(buyer).depositEarnist({value: escrowAmount}) //msg.value will be sent to the blockchain and the amount will be here. 
            // sends ether to smart contract above
            // checks if the ether was sent to the smart contract below
            balance = await escrow.getBalance()
            console.log('escrow Balance', ethers.utils.formatEther(balance))

            //Inspector updates status 
            transaction = await escrow.connect(inspector).updateInspectionStatus(true)
            await transaction.wait(); 
            console.log('inspector updates status')

            //buyer approves sale 
            transaction = await escrow.connect(buyer).approveSale()
            await transaction.wait()
            console.log('buyer approves sale')

            
            //seller approves sale 
            transaction = await escrow.connect(seller).approveSale()
            await transaction.wait()
            console.log('seller approves sale')


            // lender funds the sale 
            transaction = await lender.sendTransaction({to: escrow.address, value: ether(80)})

            //lender approves sale 
            transaction = await escrow.connect(lender).approveSale()
            await transaction.wait()
            console.log('lender approves sale')

            // finalize the sale 
            transaction = await escrow.connect(buyer).finalizeSale() // we gotta specify which address we are on to finalize the sale on the contract
            await transaction.wait()
            console.log('buyer finalize sale ')

            // expects buyer to be nft owner after 
            expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address); // we first check to see if address is the sellers then after purchase we check again to see if address is the buyers
            
            // expect seller to receive funds 
            balance = await ethers.provider.getBalance(seller.address)
            console.log('Seller balance', ethers.utils.formatEther(balance))
        
            expect(balance).to.be.above(ether(10099))
        
        })// checks to see if the nft has an owner
    } )





})


