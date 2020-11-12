import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-toolbar',
  templateUrl: './header-toolbar.component.html',
  styleUrls: ['./header-toolbar.component.scss']
})
export class HeaderToolbarComponent {

  @Input() title: string;
  @Input() showBackButton = false;
  @Input() showSave = false;
  @Input() showEdit = false;
  @Input() showCreateElection = false;

  @Output() saveClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() editClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() createClicked: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router
  ) { }


  handleSave(): void {
    this.saveClicked.emit();
  }

  handleEdit(): void {
    this.editClicked.emit();
  }

  handleCreateElection(): void {
    this.createClicked.emit();
    this.router.navigate(['/dashboard/admin/create']);
  }

}
