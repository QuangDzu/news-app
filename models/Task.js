export class Task {
  constructor(taskText, owner, isDone = false) {
    this.taskText = taskText;
    this.owner = owner;
    this.isDone = isDone;
  }
}
