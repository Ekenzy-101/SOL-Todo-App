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

  let todoListKeypair: web3.Keypair;

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

  const getAccountData = async () => {
    return program.account.todoListAccountData.fetch(
      todoListKeypair.publicKey
    ) as Promise<TodoListAccountData>;
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
});
