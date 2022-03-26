use crate::account_data::*;
use crate::constant::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(init, payer = user, space = 8 + TodoListAccountData::MAX_SIZE)]
  pub todo_list: Account<'info, TodoListAccountData>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub system_program: Program<'info, System>,
}

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
  ctx.accounts.todo_list.set_inner(TodoListAccountData {
    todos: Vec::with_capacity(MAX_TODO_LIST_LENGTH),
    deleted_indexes: Vec::with_capacity(MAX_TODO_LIST_LENGTH),
    count: 0,
  });
  Ok(())
}
