use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("8PBfGurkJBKpSkBvsWbuTnoba7kdzQDQj4D8zhzs1rNx");

#[program]
pub mod demo_pda {
    use super::*;

    pub fn create_user(
        ctx: Context<CreateUser>, 
        user: UserAccount
    ) -> Result<()> {
        ctx.accounts.user.set_inner(user);
        Ok(())
    }

    pub fn create_contract(
        ctx: Context<CreateContract>, 
        contract: ContractAccount,
    ) -> Result<()> {
        msg!("Contract: {:?}", contract);
        msg!("Contract size: {:?}", size_of::<ContractAccount>());
        
        ctx.accounts.contract.set_inner(contract);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(
    seller_phone: String,
    buyer_phone: String,
    return_date: String,
)]
pub struct CreateContract<'info> {
    #[account(
        init,
        seeds = [
            seller_phone.as_bytes().as_ref(), 
            buyer_phone.as_bytes().as_ref(),
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
#[instruction(
    phone: String,
)]
pub struct CreateUser<'info> {
    #[account(
        init,
        seeds = [
            phone.as_bytes().as_ref(),
            wallet.key().as_ref()
        ],
        bump,
        payer = wallet,
        space = size_of::<UserAccount>() + 16
    )]
    pub user: Account<'info, UserAccount>,

    #[account(mut)]
    pub wallet: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Debug)]
#[account]
pub struct UserAccount {
    pub phone: String,
    pub name: String,
    pub birth_day: String,
    pub address1: String,
    pub address2: String,
    pub address3: String,
    pub sub_phone: String,
}

#[derive(Debug)]
#[account]
pub struct ContractAccount {
    pub seller_phone: String,
    pub buyer_phone: String,
    pub return_date: String,
    pub item: String,
    pub kind: String,
    pub formal_day: String,
    pub area_flat_unit: String,
    pub address1: String,
    pub address2: String,
    pub address3: String,
    pub option: i32,
    pub flat_price: i32,
    pub contract_price: i32,
    pub first_yn: bool,
    pub first_price: i32,
    pub first_end_count: i32,
    pub second_yn: bool,
    pub second_price: i32,
    pub second_end_count: i32,
    pub third_yn: bool,
    pub third_price: i32,
    pub third_end_count: i32,
}