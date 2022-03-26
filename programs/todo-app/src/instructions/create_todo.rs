use crate::account_data::*;
use crate::constant::*;
use crate::errors::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CreateTodo<'info> {
  #[account(mut)]
  pub todo_list: Account<'info, TodoListAccountData>,
  pub user: Signer<'info>,
}

pub fn create_todo(ctx: Context<CreateTodo>, content: String) -> Result<()> {
  require!(
    content.len() <= MAX_TODO_CONTENT_LENGTH,
    TodoError::TodoContentTooLarge
  );

  let account = &mut ctx.accounts.todo_list;
  require!(
    (account.count as usize) < MAX_TODO_LIST_LENGTH,
    TodoError::TodoListTooLarge
  );

  let index = match account.deleted_indexes.pop() {
    Some(value) => value,
    None => account.count,
  };
  let (id, _) = Pubkey::find_program_address(&[b"todo", &[index]], ctx.program_id);
  account.count += 1;
  account.todos.push(Todo {
    id,
    content,
    completed: false,
  });
  Ok(())
}
