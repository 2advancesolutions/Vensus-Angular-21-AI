import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-column',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  template: `
    <div class="todo-column">
      <h3 class="column-title">
        {{ title() }}
        <span class="count">({{ todos().length }})</span>
      </h3>
      
      <div 
        class="drop-zone"
        [class.drag-over]="isDragOver()"
        (dragover)="onDragOver($event)"
        (dragenter)="onDragEnter($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)">
        
        <div class="todos-container">
          @for (todo of todos(); track todo.id) {
            <app-todo-item
              [todo]="todo"
              (toggle)="onToggle(todo.id)"
              (delete)="onDelete(todo.id)">
            </app-todo-item>
          }
        </div>
        
        @if (todos().length === 0) {
          <div class="empty-state">
            {{ emptyMessage() }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .todo-column {
      flex: 1;
      min-width: 300px;
      max-width: 400px;
    }

    .column-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: #333;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .count {
      font-size: 14px;
      font-weight: normal;
      color: #666;
    }

    .drop-zone {
      min-height: 200px;
      border: 2px dashed transparent;
      border-radius: 8px;
      padding: 8px;
      transition: all 0.2s ease;
    }

    .drop-zone.drag-over {
      border-color: #007bff;
      background-color: #f8f9ff;
    }

    .todos-container {
      min-height: 100px;
    }

    .empty-state {
      text-align: center;
      color: #999;
      font-style: italic;
      padding: 40px 20px;
      border: 2px dashed #e0e0e0;
      border-radius: 8px;
      background-color: #fafafa;
    }
  `]
})
export class TodoColumnComponent {
  title = input.required<string>();
  todos = input.required<Todo[]>();
  status = input.required<string>();
  emptyMessage = input.required<string>();
  
  todoToggle = output<string>();
  todoDelete = output<string>();
  todoDrop = output<{ todoId: string; newStatus: string }>();

  isDragOver = signal(false);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      this.isDragOver.set(false);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    
    const todoId = event.dataTransfer?.getData('text/plain');
    if (todoId) {
      this.todoDrop.emit({ todoId, newStatus: this.status() });
    }
  }

  onToggle(todoId: string): void {
    this.todoToggle.emit(todoId);
  }

  onDelete(todoId: string): void {
    this.todoDelete.emit(todoId);
  }
}