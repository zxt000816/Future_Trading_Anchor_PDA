use anchor_lang::prelude::*;
use std::mem::size_of;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("Cez5wCcjYdmf7kFkr693ByrFohBcss9ghjBVciopwGE");

#[program]
pub mod demo_pda {
    use super::*;

    pub fn create_contract(
        ctx: Context<CreateContract>, 
        contract: ContractAccount,
    ) -> Result<()> {
        msg!("Contract: {:?}", contract);
        msg!("Contract size: {:?}", size_of::<ContractAccount>());
        
        ctx.accounts.contract.set_inner(contract);
        Ok(())
    }

    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        msg!("Initialized");
        Ok(())
    }

    pub fn insert(ctx: Context<Insert>, data: Contract) -> ProgramResult {
        msg!("Insert");

        let contract_vec = &mut ctx.accounts.contract_account;
        contract_vec.contracts.push(data);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(
    seller_name: String,
    buyer_name: String,
    item: String,
    kind: String,
    formal_day: String,
    return_date: String,
)]
pub struct CreateContract<'info> {
    #[account(
        init,
        seeds = [
            seller_name.as_bytes().as_ref(), 
            buyer_name.as_bytes().as_ref(), 
            item.as_bytes().as_ref(), 
            kind.as_bytes().as_ref(), 
            formal_day.as_bytes().as_ref(), 
            return_date.as_bytes().as_ref(),
            wallet.key().as_ref()
        ],
        bump,
        payer = wallet,
        space = size_of::<ContractAccount>() + 16
    )]
    pub contract: Account<'info, ContractAccount>,

    #[account(mut)]
    pub wallet: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer=wallet, space=10240)]
    pub contract_account: Account<'info, ContractVec>,
    #[account(mut)]
    pub wallet: Signer<'info>,
    pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
pub struct Insert<'info> {
    #[account(mut)]
    pub contract_account: Account<'info, ContractVec>,
}

#[account]
pub struct ContractVec {
    contracts: Vec<Contract>
}

#[derive(Debug)]
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Contract {
    pub seller_name: String,
    pub seller_birth_day: String,
    pub seller_address: String,
    pub seller_phone: String,
    pub seller_sub_phone: String,
    pub buyer_name: String,
    pub buyer_birth_day: String,
    pub buyer_address: String,
    pub buyer_phone: String,
    pub buyer_sub_phone: String,
    pub item: String,
    pub kind: String,
    pub formal_day: String,
    pub area_flat_unit: String,
    pub address: String,
    pub option: String,
    pub flat_price: String,
    pub contract_price: String,
    pub first_yn: String,
    pub first_price: String,
    pub first_end_count: String,
    pub second_yn: String,
    pub second_price: String,
    pub second_end_count: String,
    pub third_yn: String,
    pub third_price: String,
    pub third_end_count: String,
    pub return_date: String
}

#[derive(Debug)]
#[account]
pub struct ContractAccount {
    pub seller_name: String,
    // pub seller_birth_day: String,
    // pub seller_address: String,
    // pub seller_phone: String,
    // pub seller_sub_phone: String,
    pub buyer_name: String,
    // pub buyer_birth_day: String,
    // pub buyer_address: String,
    // pub buyer_phone: String,
    // pub buyer_sub_phone: String,
    pub item: String,
    pub kind: String,
    pub formal_day: String,
    pub area_flat_unit: String,
    // pub address: String,
    // pub option: String,
    // pub flat_price: String,
    // pub contract_price: String,
    // pub first_yn: String,
    // pub first_price: String,
    // pub first_end_count: String,
    // pub second_yn: String,
    // pub second_price: String,
    // pub second_end_count: String,
    // pub third_yn: String,
    // pub third_price: String,
    // pub third_end_count: String,
    pub return_date: String
}
