// 创建一个函数将`smart_contract/target/idl/anchor_forward_transaction_v2.json`中的内容复制到`client/src/idl.json`中
const fs = require('fs');
const path = require('path');

// ./target/idl/demo_pda.json
const idlPath = path.join(__dirname, "./target/idl/demo_pda.json");
const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));
// app/solana-pda-dapp/public/idl.json
const idlPath2 = path.join(__dirname, './app/solana-pda-dapp/public/idl.json');
fs.writeFileSync(idlPath2, JSON.stringify(idl, null, 2));