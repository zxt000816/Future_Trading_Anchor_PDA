import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { BN } from "bn.js";
import { assert } from "chai";
import { DemoPda } from "../target/types/demo_pda";

function generateRandomObjectV2() {
  function randomString(length:number, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  function randomPhoneNumber() {
    const areaCode = randomString(3, '0123456789');
    const num1 = randomString(3, '0123456789');
    const num2 = randomString(4, '0123456789');
    return areaCode + '-' + num1 + '-' + num2;
  }

  function randomAddress() {
    return randomString(100);
  }

  return {
    sellerName: randomString(20),
    sellerBirthDay: randomString(20),
    sellerAddress: randomAddress(),
    sellerPhone: randomPhoneNumber(),
    sellerSubPhone: randomPhoneNumber(),
    buyerName: randomString(20),
    buyerBirthDay: randomString(20),
    buyerAddress: randomAddress(),
    buyerPhone: randomPhoneNumber(),
    buyerSubPhone: randomPhoneNumber(),
    item: randomString(20),
    kind: randomString(20),
    formalDay: randomString(20),
    areaFlatUnit: randomString(20),
    address: randomAddress(),
    option: randomString(20),
    flatPrice: randomString(20),
    contractPrice: randomString(20),
    firstYn: randomString(20),
    firstPrice: randomString(20),
    firstEndCount: randomString(20),
    secondYn: randomString(20),
    secondPrice: randomString(20),
    secondEndCount: randomString(20),
    thirdYn: randomString(20),
    thirdPrice: randomString(20),
    thirdEndCount: randomString(20),
    returnDate: randomString(20)
  };
}

describe("demo-pda", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DemoPda as Program<DemoPda>;
  let data = generateRandomObjectV2();

  // it("PDA Is initialized!", async () => {
  //   const publicKey = anchor.AnchorProvider.local().wallet.publicKey;
  //   const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  //   const [contractPDA] = await anchor.web3.PublicKey.findProgramAddress([
  //       utf8.encode(data.sellerName), 
  //       utf8.encode(data.buyerName),
  //       utf8.encode(data.item),
  //       utf8.encode(data.kind),
  //       utf8.encode(data.formalDay),
  //       utf8.encode(data.returnDate),
  //       publicKey.toBuffer()
  //     ],
  //     program.programId
  //   );
  //   console.log("contractPDA", contractPDA);
  //   await program.methods.createContract(data).accounts({
  //     contract: contractPDA,
  //     wallet: publicKey,
  //     systemProgram:  anchor.web3.SystemProgram.programId,
      
  //   }).rpc();
  //   const contractAccount = await program.account.contractAccount.fetch(contractPDA);
  //   console.log(contractAccount);
  //   // assert.equal(contractAccount.amount.toNumber(), 32);
  //   // assert.isTrue(contractAccount.from.equals(publicKey));
  //   // assert.isTrue(contractAccount.to.equals(toWallet.publicKey));
  // });

  it("Vec is initialized!", async () => {
    const publicKey = anchor.AnchorProvider.local().wallet.publicKey;
    const dataAccount = anchor.web3.Keypair.fromSeed(Buffer.from("11222233131111111111111111112222"));

    await program.methods.initialize().accounts({
      contractAccount: dataAccount.publicKey,
      wallet: publicKey,
      systemProgram:  anchor.web3.SystemProgram.programId,
    }).signers([dataAccount]).rpc();
    console.log("dataAccount", dataAccount.publicKey.toBase58());
    const dataAccountAccount = await program.account.contractVec.fetch(dataAccount.publicKey);
    console.log(dataAccountAccount);
    assert.equal(dataAccountAccount.contracts.length, 0);

    // let loop_times = 11;

    // let start = new Date().getTime();
    // for (let i = 0; i < loop_times; i++) {
    //   let data = generateRandomObjectV2();
    //   await program.methods.insert(data).accounts({
    //     contractAccount: dataAccount.publicKey,
    //   }).rpc();
    // }
    // let end = new Date().getTime();
    // let cost = end - start;
    // // 以分钟为单位
    // let minutes = cost / 1000 / 60;
    // console.log("minutes", minutes);
    // // 以秒为单位
    // let seconds = cost / 1000;
    // console.log("seconds", seconds);

    // // 计算 Transaction per second
    // let tps = loop_times / seconds;
    // console.log("tps", tps);
    
    
    // const dataAccountAccount2 = await program.account.contractVec.fetch(dataAccount.publicKey);
    // // console.log(dataAccountAccount2);
    // assert.equal(dataAccountAccount2.contracts.length, loop_times);
  });
});
