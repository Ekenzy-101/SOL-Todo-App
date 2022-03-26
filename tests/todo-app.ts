import {
  Program,
  Provider,
  setProvider,
  workspace,
  web3,
} from "@project-serum/anchor";
import { expect } from "chai";
import { TodoApp } from "../target/types/todo_app";

interface TodoListAccountData {
  count: number;
  deletedIndexes: number[];
  todos: Todo[];
}

interface Todo {
  id: web3.PublicKey;
  content: string;
  completed: boolean;
}

describe("Todo App", () => {
  setProvider(Provider.env());

  const program = workspace.TodoApp as Program<TodoApp>;
  const user = program.provider.wallet;
  const MAX_TODO_CONTENT_LENGTH = 200;
  const MAX_TODO_LIST_LENGTH = 8;

  let todoListKeypair: web3.Keypair;
  let id: web3.PublicKey;

  const initialize = () => {
    return program.rpc.initialize({
      accounts: {
        systemProgram: web3.SystemProgram.programId,
        todoList: todoListKeypair.publicKey,
        user: user.publicKey,
      },
      signers: [todoListKeypair],
    });
  };

  const createTodo = (content: string) => {
    return program.rpc.createTodo(content, {
      accounts: {
        todoList: todoListKeypair.publicKey,
        user: user.publicKey,
      },
    });
  };

  const deleteTodo = () => {
    return program.rpc.deleteTodo(id, {
      accounts: {
        todoList: todoListKeypair.publicKey,
        user: user.publicKey,
      },
    });
  };

  const getAccountData = async () => {
    return program.account.todoListAccountData.fetch(
      todoListKeypair.publicKey
    ) as Promise<TodoListAccountData>;
  };

  const getContent = (index: number, length?: number) => {
    return new Array(length || MAX_TODO_CONTENT_LENGTH).fill(index).join("");
  };

  beforeEach(async () => {
    todoListKeypair = web3.Keypair.generate();
    await initialize();
  });

  it("should initialize account data", async () => {
    const data = await getAccountData();

    expect(data.count).to.equal(0);
    expect(data.todos).to.have.lengthOf(0);
    expect(data.deletedIndexes).to.have.lengthOf(0);
  });

  it("should create todo successfully", async () => {
    for (let i = 1; i <= MAX_TODO_LIST_LENGTH; i++) {
      await createTodo(getContent(i));
    }

    const data = await getAccountData();
    const firstTodo = data.todos[0];

    expect(data.count).to.equal(MAX_TODO_LIST_LENGTH);
    expect(data.todos).to.have.lengthOf(MAX_TODO_LIST_LENGTH);
    expect(firstTodo.content).to.equal(getContent(1));
    expect(firstTodo.completed).to.be.false;
    expect(firstTodo.id.toBytes()).to.have.lengthOf(32);
  });

  it(`should not create todo if content length is greater than ${MAX_TODO_CONTENT_LENGTH}`, async () => {
    try {
      await createTodo(getContent(1, MAX_TODO_CONTENT_LENGTH + 1));
    } catch (error) {
      expect(error.code).to.equal(6000);
      expect(error.msg).to.include("content");
    }
  });

  it(`should not create todo if todolist length is greater than ${MAX_TODO_LIST_LENGTH}`, async () => {
    try {
      for (let i = 1; i <= MAX_TODO_LIST_LENGTH + 1; i++) {
        await createTodo(getContent(i));
      }
    } catch (error) {
      expect(error.code).to.equal(6001);
      expect(error.msg).to.include("todolist");
    }
  });

  it(`should delete todo successfully`, async () => {
    await createTodo(getContent(1));
    let data = await getAccountData();
    id = data.todos[0].id;

    await deleteTodo();
    data = await getAccountData();
    expect(data.count).to.equal(0);
    expect(data.todos).to.have.lengthOf(0);
    expect(data.deletedIndexes).to.have.lengthOf(1);
  });

  it(`should not delete todo with the given id if not found`, async () => {
    try {
      id = web3.Keypair.generate().publicKey;
      await deleteTodo();
    } catch (error) {
      expect(error.code).to.equal(6002);
      expect(error.msg).to.include("not found");
    }
  });
});
