import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-my-resources',
  standalone: true,
  imports: [FileUpload, ToastModule, ProgressSpinner, CommonModule, ButtonModule, 
    ConfirmDialogModule, HttpClientModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './my-resources.component.html',
  styleUrl: './my-resources.component.css'
})
export class MyResourcesComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  activateSpinner: boolean = false;
  files: any[] = [];

  baseUrl = environment.baseUrl;
  private resourceStudentUrl = this.baseUrl + 'api/files';

  constructor(private http: HttpClient, private messageService: MessageService,
    private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.loadFiles();
  }

  uploadHandler(event:FileUploadHandlerEvent) {
    for(let file of event.files) {
        this.uploadFile(file);
    }
  }

  uploadFile(file: File) {
    this.activateSpinner = true;
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log('formData', formData);
    this.http.post(`${this.resourceStudentUrl}/upload`, formData).subscribe(response => {
      console.log('File uploaded successfully', response);
      this.messageService.add({severity:'success', summary: 'File Uploaded', detail: 'Uploaded ' + file.name});
      this.loadFiles();
      this.activateSpinner = false;
      this.fileUpload.clear(); // Limpiar el componente p-fileUpload
    }, error => {
      console.error('Error uploading file', error);
      this.activateSpinner = false;
      this.messageService.add({severity:'error', summary: 'File Upload Error', detail: 'Error uploading ' + file.name});
    });
  }

  onClickDelete(fileName: string) {

    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Schedule',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
      },
      acceptButtonProps: {
          label: 'Delete',
          severity: 'danger',
      },

      accept: () => {
        this.deleteFile(fileName); 
      },
      reject: () => {
          // No action
      },
    });
  }

  deleteFile(fileName: string) {
    this.http.delete(`${this.resourceStudentUrl}/delete`, { params: { key: fileName } }).subscribe(response => {
      this.messageService.add({ severity: 'success', summary: 'File Deleted', detail: 'Deleted ' + fileName });
      this.loadFiles();
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'File Delete Error', detail: 'Error deleting ' + fileName });
    });
  }

  loadFiles() {
    this.http.get<any[]>(`${this.resourceStudentUrl}/getFiles`).subscribe(response => {
      this.files = response;
    }, error => {
      console.error('Error loading files', error);
    });
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pi pi-file-pdf';
      case 'doc':
      case 'docx':
        return 'pi pi-file-word';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'pi pi-image';
      default:
        return 'pi pi-file';
    }
  }

}
