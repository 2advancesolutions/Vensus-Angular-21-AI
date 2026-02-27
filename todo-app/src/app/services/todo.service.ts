import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Todo, TodoStatus } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private _todos = signal<Todo[]>([]);

  todos = this._todos.asReadonly();
  
  pendingTodos = computed(() => 
    this._todos().filter(todo => !todo.completed)
  );
  
  completedTodos = computed(() => 
    this._todos().filter(todo => todo.completed)
  );

  addTodo(title: string): void {
    if (!title.trim()) return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    this._todos.update(todos => [...todos, newTodo]);
  }

  toggleTodo(id: string): void {
    this._todos.update(todos => 
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  deleteTodo(id: string): void {
    this._todos.update(todos => todos.filter(todo => todo.id !== id));
  }

  moveTodo(id: string, newStatus: TodoStatus): void {
    this._todos.update(todos => 
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: newStatus === 'completed' } : todo
      )
    );
  }

  updateTodoTitle(id: string, newTitle: string): void {
    if (!newTitle.trim()) return;
    
    this._todos.update(todos => 
      todos.map(todo => 
        todo.id === id ? { ...todo, title: newTitle.trim() } : todo
      )
    );
  }
}