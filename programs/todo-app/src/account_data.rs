use crate::constant::*;
use crate::errors::*;
use anchor_lang::prelude::*;

#[account]
pub struct TodoListAccountData {
  pub count: u8,                // 1
  pub deleted_indexes: Vec<u8>, // 4 + max * 1
  pub todos: Vec<Todo>,         // 4 + max * (32 + 4 + 200 +1)
}

impl TodoListAccountData {
  const COUNT_SIZE: usize = 1;
  const DELETED_INDEXES: usize = 4 + MAX_TODO_LIST_LENGTH * 1;
  const TODOS_SIZE: usize = 4 + MAX_TODO_LIST_LENGTH * (32 + 4 + 200 + 1);
  pub const MAX_SIZE: usize = TodoListAccountData::COUNT_SIZE
    + TodoListAccountData::DELETED_INDEXES
    + TodoListAccountData::TODOS_SIZE;

  pub fn get_todo_index(&self, id: Pubkey) -> Result<usize> {
    for (index, todo) in self.todos.iter().enumerate() {
      if todo.id == id {
        return Ok(index);
      }
    }

    err!(TodoError::TodoNotFound)
  }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Todo {
  pub id: Pubkey,      // 32
  pub content: String, // 4 + 200
  pub completed: bool, // 1
}
