use anchor_lang::prelude::*;

declare_id!("BudycRCKfrytu4vwrXxhAnJ7zo26RRjEijAodADTkmTV");

#[program]
pub mod todo_app {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
