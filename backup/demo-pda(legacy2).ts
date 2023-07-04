import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { BN } from "bn.js";
import { assert } from "chai";
import { DemoPda } from "../target/types/demo_pda";

// function generateRandomObjectV2() {
//   function randomString(length:number, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
//     let result = '';
//     for (let i = 0; i < length; i++) {
//       result += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return result;
//   }

//   function randomPhoneNumber() {
//     const areaCode = randomString(3, '0123456789');
//     const num1 = randomString(3, '0123456789');
//     const num2 = randomString(4, '0123456789');
//     return areaCode + '-' + num1 + '-' + num2;
//   }

//   function randomAddress() {
//     return randomString(100);
//   }

//   return {
//     sellerName: randomString(20),
//     sellerBirthDay: randomString(20),
//     sellerAddress: randomAddress(),
//     sellerPhone: randomPhoneNumber(),
//     sellerSubPhone: randomPhoneNumber(),
//     buyerName: randomString(20),
//     buyerBirthDay: randomString(20),
//     buyerAddress: randomAddress(),
//     buyerPhone: randomPhoneNumber(),
//     buyerSubPhone: randomPhoneNumber(),
//     item: randomString(20),
//     kind: randomString(20),
//     formalDay: randomString(20),
//     areaFlatUnit: randomString(20),
//     address: randomAddress(),
//     option: randomString(20),
//     flatPrice: randomString(20),
//     contractPrice: randomString(20),
//     firstYn: randomString(20),
//     firstPrice: randomString(20),
//     firstEndCount: randomString(20),
//     secondYn: randomString(20),
//     secondPrice: randomString(20),
//     secondEndCount: randomString(20),
//     thirdYn: randomString(20),
//     thirdPrice: randomString(20),
//     thirdEndCount: randomString(20),
//     returnDate: randomString(20)
//   };
// }



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
    return randomString(100);
  }

  return [
    {
      sellerName: randomString(20),
      sellerBirthDay: randomString(20),
      sellerAddress: randomAddress(),
      sellerPhone: randomPhoneNumber(),
      sellerSubPhone: randomPhoneNumber(),
    },
    {
      buyerName: randomString(20),
      buyerBirthDay: randomString(20),
      buyerAddress: randomAddress(),
      buyerPhone: randomPhoneNumber(),
      buyerSubPhone: randomPhoneNumber(),
    },
    {
      // item: randomString(20),
      // kind: randomString(20),
      // formalDay: randomString(20),
      // areaFlatUnit: randomString(20),
      // address: randomAddress(),
      // option: randomString(20),
      // flatPrice: randomString(20),
      // contractPrice: randomString(20),
      // firstYn: Math.random() >= 0.5,
      // firstPrice: getRandomInt(0, 100000),
      // firstEndCount: getRandomInt(0, 1000),
      // secondYn: Math.random() >= 0.5,
      // secondPrice: getRandomInt(0, 100000),
      // secondEndCount: getRandomInt(0, 1000),
      // thirdYn: Math.random() >= 0.5,
      // thirdPrice: getRandomInt(0, 100000),
      // thirdEndCount: getRandomInt(0, 1000),
      returnDate: randomString(20)
    }
  ];
}

function createKeyPair(name, phone) {
  return anchor.web3.Keypair.fromSeed(
    Buffer.from(
      `${name}${phone}`
    )
  );
}

let [seller_info, buyer_info, contract_info] = generateRandomObjectV2();
console.log("seller_info: ", seller_info);

describe("demo-pda", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.DemoPda as Program<DemoPda>;
  const publicKey = anchor.AnchorProvider.local().wallet.publicKey;
  console.log("publicKey: ", publicKey.toString());
  let sellerPDA, buyerPDA, contractPDA;

  let seller_identifier = `${seller_info.sellerName}${seller_info.sellerPhone}`;
  let buyer_identifier = `${buyer_info.buyerName}${buyer_info.buyerPhone}`;

  it("seller pda is initialized!", async () => {
    [sellerPDA] = await anchor.web3.PublicKey.findProgramAddress(
      [
        utf8.encode(seller_info.sellerName),
        // utf8.encode(seller_info.sellerPhone),
        publicKey.toBuffer()
      ],
      program.programId
    );
    console.log("sellerPDA: ", sellerPDA.toString());


    await program.methods.createSeller(seller_info).accounts({
      seller: sellerPDA,
      wallet: publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).rpc();

    const sellerAccount = await program.account.sellerAccount.fetch(sellerPDA);
    console.log("sellerAccount", sellerAccount);

  });

  // it("buyer pda is initialized!", async () => {
  //   [buyerPDA] = await anchor.web3.PublicKey.findProgramAddress(
  //     [
  //       // utf8.encode(buyer_info.buyerName),
  //       utf8.encode(buyer_info.buyerPhone),
  //       publicKey.toBuffer()
  //     ],
  //     program.programId
  //   );
  //   console.log("buyerPDA: ", utf8.encode(buyerPDA.toString()));

  //   await program.methods.createBuyer(buyer_info).accounts({
  //     buyer: buyerPDA,
  //     wallet: publicKey,
  //     systemProgram: anchor.web3.SystemProgram.programId,
  //   }).rpc();

  //   const buyerAccount = await program.account.buyerAccount.fetch(buyerPDA);
  //   console.log("buyerAccount:", buyerAccount);
  // });

  // console.log("sellerPDA.toBuffer(): ", sellerPDA);
  // // console.log("utf8.encode(sellerPDA.toString()): ", utf8.encode(sellerPDA.toBuffer()));
  // it("contract pda is initialized!", async () => {
  //   [contractPDA] = await anchor.web3.PublicKey.findProgramAddress(
  //     [
  //       utf8.encode(seller_identifier),
  //       utf8.encode(buyer_identifier),
  //       utf8.encode(contract_info.returnDate),
  //       publicKey.toBuffer()
  //     ],
  //     program.programId
  //   );
  //   console.log("contractPDA", contractPDA);

  //   contract_info['sellerPDA'] = seller_identifier;
  //   contract_info['buyerPDA'] = buyer_identifier;
  //   console.log("contract_info: \n", contract_info);

  //   await program.methods.createContract(contract_info).accounts({
  //     contract: contractPDA,
  //     wallet: publicKey,
  //     systemProgram: anchor.web3.SystemProgram.programId,
  //   }).rpc();

  //   const contractAccount = await program.account.contractAccount.fetch(contractPDA);
  //   console.log("contractAccount", contractAccount);
  // });
});
