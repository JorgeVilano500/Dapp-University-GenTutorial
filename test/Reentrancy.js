const {ethers} = require('hardhat');
const {expect} = require('chai');



describe('Reentrancy', () => {
    let deployer, bank
    beforeEach(async () => {
        // get signers for accounts 
        [deployer, user, attacker] = await ethers.getSigners();



        const Bank = await ethers.getContractFactory('Bank', deployer) //connects deployer to the contract
        bank = await Bank.deploy()

        await bank.deposit({value: ethers.utils.parseEther('100')})
        await bank.connect(user).deposit({value: ethers.utils.parseEther('50')}) // this will be deployed on behalf of the user address
    
        //deploy attacker 
        const Attacker = await ethers.getContractFactory('Attacker', attacker)
        attackerContract = await Attacker.deploy(bank.address)
    })

    describe('Facilitiates deposits and withdraws', () => {
        it('accepts deposits', async () => {
            // check that deposit took place
            const deployerBalance = await bank.balanceOf(deployer.address)
            expect(deployerBalance).to.equal(ethers.utils.parseEther('100'))
            const userBalance = await bank.balanceOf(user.address)
            expect(userBalance).to.equal(ethers.utils.parseEther('50'))
        })

        it('Accepts Withdraws', async () => {
            await bank.withdraw()

            const deployerBalance = await bank.balanceOf(deployer.address)
            const userBalance = await bank.balanceOf(user.address);

            expect(deployerBalance).to.eq(0);
            expect(userBalance).to.eq(ethers.utils.parseEther('50'))

        })

        it('allows attacker to drain funds from #withdraw()', async () => {
            console.log('Before--')
            // first need to see entire balance of bank 
            console.log(`Banks Balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(bank.address))}`) 

            console.log(`Atackers Balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))}`) 


            //perform the attack
            await attackerContract.attack({ value: ethers.utils.parseEther('10') })

            console.log('After--')
            console.log(`Banks Balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(bank.address))}`) 
            console.log(`Atackers Balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))}`) 

            //check balance has been drained
            expect(await ethers.provider.getBalance(bank.address)).to.eq(0);

        })

    })

})