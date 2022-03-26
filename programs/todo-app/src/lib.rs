use anchor_lang::prelude::*;
use instructions::*;

mod account_data;
mod constant;
mod errors;
mod instructions;

declare_id!("BudycRCKfrytu4vwrXxhAnJ7zo26RRjEijAodADTkmTV");

#[program]
pub mod todo_app {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize(ctx)
    }

    pub fn create_todo(ctx: Context<CreateTodo>, content: String) -> Result<()> {
        instructions::create_todo(ctx, content)
    }
}
