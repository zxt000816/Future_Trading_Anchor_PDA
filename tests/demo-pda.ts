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

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  

  function randomPhoneNumber() {
    const areaCode = randomString(3, '0123456789');
    const num1 = randomString(3, '0123456789');
    const num2 = randomString(4, '0123456789');
    return areaCode + '-' + num1 + '-' + num2;
  }

  function randomAddress() {
    return randomString(30);
  }

  return [
    {
      name: randomString(20),
      phone: randomString(11),
      birthDay: randomString(8),
      address1: randomString(30),
      address2: randomString(30),
      address3: randomString(30),
      subPhone: randomString(11),
    },
    {
      name: randomString(20),
      phone: randomString(11),
      birthDay: randomString(8),
      address1: randomString(30),
      address2: randomString(30),
      address3: randomString(30),
      subPhone: randomString(11),
    },
    {
      item: randomString(20),
      kind: randomString(20),
      formalDay: randomString(8),
      areaFlatUnit: randomString(20),
      address1: randomString(30),
      address2: randomString(30),
      address3: randomString(30),
      option: getRandomInt(0, 100000),
      flatPrice: getRandomInt(0, 100000),
      contractPrice: getRandomInt(0, 100000),
      firstYn: Math.random() >= 0.5,
      firstPrice: getRandomInt(0, 100000),
      firstEndCount: getRandomInt(0, 1000),
      secondYn: Math.random() >= 0.5,
      secondPrice: getRandomInt(0, 100000),
      secondEndCount: getRandomInt(0, 1000),
      thirdYn: Math.random() >= 0.5,
      thirdPrice: getRandomInt(0, 100000),
      thirdEndCount: getRandomInt(0, 1000),
      returnDate: randomString(8)
    }
  ];
}

let [seller_info, buyer_info, contract_info] = generateRandomObjectV2();
console.log("seller_info: ", seller_info);

describe("demo-pda", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.DemoPda as Program<DemoPda>;
  const publicKey = anchor.AnchorProvider.local().wallet.publicKey;
  console.log("publicKey: ", publicKey.toString());
  let sellerPDA, buyerPDA, contractPDA;

  console.log("utf8.encode(seller_info.name): ", utf8.encode(seller_info.name));
  console.log("utf8.encode(seller_info.phone): ", utf8.encode(seller_info.phone));

  it("seller pda is initialized!", async () => {
    [sellerPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [
        utf8.encode(seller_info.phone),
        publicKey.toBuffer()
      ],
      program.programId
    );
    console.log("sellerPDA: ", sellerPDA.toString());

    await program.methods.createUser(seller_info).accounts({
      user: sellerPDA,
      wallet: publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).rpc();

    const sellerAccount = await program.account.userAccount.fetch(sellerPDA);
    console.log("sellerAccount", sellerAccount);
  });

  it("buyer pda is initialized!", async () => {
    [buyerPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [
        utf8.encode(buyer_info.phone),
        publicKey.toBuffer()
      ],
      program.programId
    );
    console.log("buyerPDA: ", buyerPDA.toString());

    await program.methods.createUser(buyer_info).accounts({
      user: buyerPDA,
      wallet: publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).rpc();

    const buyerAccount = await program.account.userAccount.fetch(buyerPDA);
    console.log("buyerAccount: ", buyerAccount);
  });

  contract_info['sellerPhone'] = seller_info.phone;
  contract_info['buyerPhone'] = buyer_info.phone;

  it("contract pda is initialized!", async () => {
    [contractPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [
        utf8.encode(contract_info.sellerPhone),
        utf8.encode(contract_info.buyerPhone),
        utf8.encode(contract_info.returnDate),
        publicKey.toBuffer()
      ],
      program.programId
    );
    console.log("contractPDA: ", contractPDA.toString());

    await program.methods.createContract(contract_info).accounts({
      contract: contractPDA,
      wallet: publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).rpc();

    const contractAccount = await program.account.contractAccount.fetch(contractPDA);
    console.log("contractAccount: ", contractAccount);
  });

});
