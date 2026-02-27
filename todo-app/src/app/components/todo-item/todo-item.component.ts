import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="todo-item"
      [class.completed]="todo().completed"
      [draggable]="true"
      (dragstart)="onDragStart($event)"
      (dragend)="onDragEnd($event)">
      
      <div class="todo-content">
        <input 
          type="checkbox" 
          [checked]="todo().completed"
          (change)="toggle.emit()"
          class="todo-checkbox" />
        
        <span class="todo-title">{{ todo().title }}</span>
        
        <button 
          class="delete-btn"
          (click)="delete.emit()"
          title="Delete todo">
          ×
        </button>
      </div>
    </div>
  `,
  styles: [`
    .todo-item {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 8px;
      padding: 12px;
      cursor: grab;
      transition: all 0.2s ease;
      user-select: none;
    }

    .todo-item:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }

    .todo-item.dragging {
      opacity: 0.5;
      cursor: grabbing;
      transform: rotate(5deg);
    }

    .todo-item.completed {
      opacity: 0.7;
    }

    .todo-item.completed .todo-title {
      text-decoration: line-through;
      color: #666;
    }

    .todo-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .todo-checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .todo-title {
      flex: 1;
      font-size: 14px;
      color: #333;
    }

    .delete-btn {
      background: none;
      border: none;
      color: #ff4444;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    }

    .delete-btn:hover {
      background-color: #ffeeee;
    }
  `]
})
export class TodoItemComponent {
  todo = input.required<Todo>();
  toggle = output<void>();
  delete = output<void>();

  onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', this.todo().id);
    event.dataTransfer!.effectAllowed = 'move';
    
    const target = event.target as HTMLElement;
    target.classList.add('dragging');
  }

  onDragEnd(event: DragEvent): void {
    const target = event.target as HTMLElement;
    target.classList.remove('dragging');
  }
}