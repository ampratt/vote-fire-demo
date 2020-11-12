import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private messageService: MessageService
  ) { }

  info(message: string = '', life = 2000): void {
    if (!message) {
      message = 'DEFAULT_INFO_MESSAGE';
    }

    this.messageService.add({
      key: 'toastContainer',
      severity: 'info',
      summary: 'Info',
      detail: message,
      life
    });
  }

  success(message: string = '', life = 2000): void {
    if (!message) {
      message = 'DEFAULT_SUCCESS_MESSAGE';
    }

    this.messageService.add({
      key: 'toastContainer',
      severity: 'success',
      summary: 'Success!',
      detail: message,
      life
    });
  }

  warn(message: string = '', life = 3000): void {
    if (!message) {
      message = 'DEFAULT_WARNING_MESSAGE';
    }

    this.messageService.add({
      key: 'toastContainer',
      severity: 'warn',
      summary: 'Warning',
      detail: message,
      life
    });
  }

  error(message: string = '', life = 5000): void {
    if (!message) {
      message = 'DEFAULT_ERROR_MESSAGE';
    }

    this.messageService.add({
      key: 'toastContainer',
      severity: 'error',
      summary: 'Error!',
      detail: message,
      life
    });
  }
}
