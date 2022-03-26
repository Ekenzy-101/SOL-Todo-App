use anchor_lang::prelude::*;

#[error_code]
pub enum TodoError {
  #[msg("The length of a todo's content should not be greater than 200")]
  TodoContentTooLarge,
  #[msg("The length of the todolist should not be greater than 8")]
  TodoListTooLarge,
  #[msg("The todo with the given id is not found")]
  TodoNotFound,
}
