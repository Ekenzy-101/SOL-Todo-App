use crate::account_data::*;
use crate::constant::*;
use crate::errors::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateTodo<'info> {
  #[account(mut)]
  pub todo_list: Account<'info, TodoListAccountData>,
  pub user: Signer<'info>,
}

pub fn update_todo(ctx: Context<UpdateTodo>, todo: Todo) -> Result<()> {
  require!(
    todo.content.len() <= MAX_TODO_CONTENT_LENGTH,
    TodoError::TodoContentTooLarge
  );

  let account = &mut ctx.accounts.todo_list;
  let index = account.get_todo_index(todo.id)?;

  *(account.todos.get_mut(index).expect("")) = todo;
  Ok(())
}
