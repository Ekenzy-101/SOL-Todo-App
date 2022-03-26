import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TodoApp } from "../target/types/todo_app";

describe("todo-app", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.TodoApp as Program<TodoApp>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
