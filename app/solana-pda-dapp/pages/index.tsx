import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import {
	AnchorProvider, BN, Program, utils, web3
} from '@project-serum/anchor';
import {  Connection, PublicKey } from '@solana/web3.js';
import {AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
// import { program } from '@project-serum/anchor/dist/cjs/spl/associated-token';
import { randomEvent, getAllUsers, Contract } from './utils';

const network = "http://127.0.0.1:8899";
const connection = new Connection(network, "processed");

const idl = require('../public/idl.json');
const utf8 = utils.bytes.utf8

const concurrency = 500;

async function checkAccountExist(pda: web3.PublicKey) {
    const accountInfo = await connection.getAccountInfo(pda);
    const isExist = accountInfo != null;
    if (isExist) {
        return true;
    } else {
        return false;
    }
}

async function getProvider(anchor_wallet: AnchorWallet) {
    const provider = new AnchorProvider(
        connection, anchor_wallet, {"preflightCommitment": "processed"},
    );
    return provider;
}

async function createPDA(pda: web3.PublicKey, data: object, account: object, anchor_wallet: AnchorWallet, account_type: string) {
    const provider = await getProvider(anchor_wallet);
    const program = new Program(idl, idl.metadata.address, provider);

    const accountIsExist = await checkAccountExist(pda);
    if (!accountIsExist) {
        if (account_type == "user") {
            await program.methods.createUser(data).accounts(account).rpc();
            // console.log(`create new user pda: ${pda.toString()} successfully!`)
        } else if (account_type == "contract") {
            await program.methods.createContract(data).accounts(account).rpc();
            // console.log(`create new contract pda: ${pda.toString()} successfully!`)
        } 
    } else {
        // console.log(`${pda.toString()} already exist!`);
    }
}

async function generateThousandsContracts(anchorWallet: AnchorWallet, all_contracts: Array<[web3.PublicKey, web3.PublicKey, object]>) {
    const provider = await getProvider(anchorWallet);
    const program = new Program(idl, idl.metadata.address, provider);

    // let all_contracts = [];
    for (let i = 0; i < concurrency; i++) {
        let [seller_info, buyer_info, contract_info] = randomEvent();
        const [sellerPDA] = await web3.PublicKey.findProgramAddress(
            [
                utf8.encode(seller_info.phone),
                anchorWallet.publicKey.toBuffer()
            ],
            program.programId,
        );
        const [buyerPDA] = await web3.PublicKey.findProgramAddress(
            [
                utf8.encode(buyer_info.phone),
                anchorWallet.publicKey.toBuffer()
            ],
            program.programId,
        );

        all_contracts.push([sellerPDA, buyerPDA, contract_info]);
    }
    return all_contracts;
    
}

async function createTransactions(anchorWallet: AnchorWallet, sellerPDA: web3.PublicKey, buyerPDA: web3.PublicKey, contract_info: Contract) {
    const provider = await getProvider(anchorWallet);
    const program = new Program(idl, idl.metadata.address, provider);
    const [contractPDA] = await web3.PublicKey.findProgramAddress(
        [
          utf8.encode(contract_info.sellerPhone),
          utf8.encode(contract_info.buyerPhone),
          utf8.encode(contract_info.returnDate),
          anchorWallet.publicKey.toBuffer()
        ],
        program.programId
    );
    // console.log("contractPDA: ", contractPDA.toString());

    await createPDA(
        contractPDA,
        contract_info,
        {
            contract: contractPDA,
            wallet: anchorWallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
        },
        anchorWallet,
        "contract"
    );

    // const contractAccount = await program.account.contractAccount.fetch(contractPDA);
    // console.log("contractAccount: ", contractAccount);
}


async function initializeAllUsers(anchor_wallet: AnchorWallet): Promise<void> {
    const provider = await getProvider(anchor_wallet);
    const program = new Program(idl, idl.metadata.address, provider);

    let all_users = getAllUsers();
    let user_pda;
    console.log("all_users: ", all_users);
    
    let start_time = new Date().getTime();
    for (let i = 0; i < all_users.length; i++) {
        [user_pda] = await web3.PublicKey.findProgramAddress(
            [
                utf8.encode(all_users[i].phone),
                anchor_wallet.publicKey.toBuffer()
            ],
            program.programId,
        );
        await createPDA(
            user_pda, 
            all_users[i], 
            {
                user: user_pda,
                wallet: anchor_wallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            }, 
            anchor_wallet, 
            "user"
        );
    }
    let end_time = new Date().getTime();
    console.log("cost seconds: ", (end_time - start_time) / 1000);
}

const Home: NextPage = () => {
    const anchorWallet = useAnchorWallet();
    // if (anchorWallet) {
    //     generateThousandsContracts(anchorWallet).then((contracts) => {  
    //         all_contracts = contracts;
    //     });        
    // }
    // console.log("all_contracts: ", all_contracts);

    async function sendTransaction() {
        if (!anchorWallet) {
            return;
        }
        const provider = await getProvider(anchorWallet);
        const program = new Program(idl, idl.metadata.address, provider);

        let [seller_info, buyer_info, contract_info] = randomEvent();
        console.log("seller_info: ", seller_info);

        const [sellerPDA] = await web3.PublicKey.findProgramAddress(
            [
                utf8.encode(seller_info.phone), 
                anchorWallet.publicKey.toBuffer()
            ],
            program.programId,
        );
        console.log("sellerPDA: ", sellerPDA.toString());
        
        await createPDA(
            sellerPDA, 
            seller_info, 
            {
                user: sellerPDA,
                wallet: anchorWallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            }, 
            anchorWallet,
            "user"
        );
        const sellerAccount = await program.account.userAccount.fetch(sellerPDA.toString());
        console.log("sellerAccount: ", sellerAccount);

        const [buyerPDA] = await web3.PublicKey.findProgramAddress(
            [
                utf8.encode(buyer_info.phone), 
                anchorWallet.publicKey.toBuffer()
            ],
            program.programId,
        );
        console.log("buyerPDA: ", buyerPDA.toString());
        
        await createPDA(
            buyerPDA,
            buyer_info,
            {
                user: buyerPDA,
                wallet: anchorWallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            },
            anchorWallet,
            "user"
        );
        const buyerAccount = await program.account.userAccount.fetch(buyerPDA.toString());
        console.log("buyerAccount: ", buyerAccount);

        console.log("contract_info: ", contract_info);
        const [contractPDA] = await web3.PublicKey.findProgramAddress(
            [
              utf8.encode(contract_info.sellerPhone),
              utf8.encode(contract_info.buyerPhone),
              utf8.encode(contract_info.returnDate),
              anchorWallet.publicKey.toBuffer()
            ],
            program.programId
        );
        console.log("contractPDA: ", contractPDA.toString());

        await createPDA(
            contractPDA,
            contract_info,
            {
                contract: contractPDA,
                wallet: anchorWallet.publicKey,
                systemProgram: web3.SystemProgram.programId,
            },
            anchorWallet,
            "contract"
        );

        const contractAccount = await program.account.contractAccount.fetch(contractPDA);
        console.log("contractAccount: ", contractAccount);
    }

    async function sendTransactionV2() {
        if (!anchorWallet) {
            return;
        }
        
        let all_contracts: Array<[web3.PublicKey, web3.PublicKey, Contract]> = [];
        await generateThousandsContracts(anchorWallet, all_contracts);

        const promises = [];
        for(let i=0; i<concurrency; i++){
            let sellerPDA = all_contracts[i][0];
            let buyerPDA = all_contracts[i][1];
            let contract_info = all_contracts[i][2];
            promises.push(createTransactions(anchorWallet, sellerPDA, buyerPDA, contract_info));
        }
        
        const startTime = Date.now();
        
        await Promise.all(promises);
    
        const endTime = Date.now();
        const TPS = concurrency / ((endTime - startTime) / 1000);
        console.log("TPS: ", TPS);
    }
    
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to <a href="https://nextjs.org">Next.js!</a>
                </h1>

                <div className={styles.walletButtons}>
                    <WalletMultiButton />
                    <WalletDisconnectButton />
                </div>

                <p className={styles.description}>
                    <button onClick={sendTransactionV2}>Create Transaction V1</button>
                </p>
                
            </main>
        </div>
    );
};

export default Home;
