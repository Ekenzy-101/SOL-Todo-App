use crate::account_data::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct DeleteTodo<'info> {
  #[account(mut)]
  pub todo_list: Account<'info, TodoListAccountData>,
  pub user: Signer<'info>,
}

pub fn delete_todo(ctx: Context<DeleteTodo>, id: Pubkey) -> Result<()> {
  let account = &mut ctx.accounts.todo_list;
  let index = account.get_todo_index(id)?;
  account.todos.remove(index);
  account.deleted_indexes.push(index as u8);
  account.count -= 1;
  Ok(())
}
