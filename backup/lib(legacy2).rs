use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("Cez5wCcjYdmf7kFkr693ByrFohBcss9ghjBVciopwGE");

#[program]
pub mod demo_pda {
    use super::*;

    pub fn create_seller(
        ctx: Context<CreateSeller>, 
        seller: SellerAccount,
    ) -> Result<()> {
        msg!("Seller: {:?}", seller);
        msg!("Seller size: {:?}", size_of::<SellerAccount>());
        
        ctx.accounts.seller.set_inner(seller);
        Ok(())
    }
        
    pub fn create_buyer(
        ctx: Context<CreateBuyer>, 
        buyer: BuyerAccount,
    ) -> Result<()> {
        msg!("Buyer: {:?}", buyer);
        msg!("Buyer size: {:?}", size_of::<BuyerAccount>());
        
        ctx.accounts.buyer.set_inner(buyer);
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
    seller_name: String,
    // seller_phone: String,
)]
pub struct CreateSeller<'info> {
    #[account(
        init,
        seeds = [
            seller_name.as_bytes().as_ref(), 
            // seller_phone.as_bytes().as_ref(), 
            wallet.key().as_ref()
        ],
        bump,
        payer = wallet,
        space = 16 + 20 + 20 + 100 + 11 + 11
        // space = size_of::<SellerAccount>() + 16
    )]
    pub seller: Account<'info, SellerAccount>,

    #[account(mut)]
    pub wallet: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(
    // buyer_name: String,
    buyer_phone: String,
)]
pub struct CreateBuyer<'info> {
    #[account(
        init,
        seeds = [
            // buyer_name.as_bytes().as_ref(), 
            buyer_phone.as_bytes().as_ref(), 
            wallet.key().as_ref()
        ],
        bump,
        payer = wallet,
        space = size_of::<BuyerAccount>() + 16
    )]
    pub buyer: Account<'info, BuyerAccount>,

    #[account(mut)]
    pub wallet: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Debug)]
#[account]
pub struct SellerAccount {
    pub seller_name: String,
    pub seller_birth_day: String,
    // pub seller_address: String,
    pub seller_phone: String,
    pub seller_sub_phone: String,
}

#[derive(Debug)]
#[account]
pub struct BuyerAccount {
    pub buyer_name: String,
    pub buyer_birth_day: String,
    // pub buyer_address: String,
    pub buyer_phone: String,
    pub buyer_sub_phone: String,
}

#[derive(Debug)]
#[account]
pub struct ContractAccount {
    pub seller_phone: String,
    pub buyer_phone: String,
    // pub item: String,
    // pub kind: String,
    // pub formal_day: String,
    // pub area_flat_unit: String,
    // pub address: String,
    // pub option: String,
    // pub flat_price: i32,
    // pub contract_price: i32,
    // pub first_yn: bool,
    // pub first_price: i32,
    // pub first_end_count: i32,
    // pub second_yn: bool,
    // pub second_price: i32,
    // pub second_end_count: i32,
    // pub third_yn: bool,
    // pub third_price: i32,
    // pub third_end_count: i32,
    pub return_date: String
}