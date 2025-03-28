import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';
import { environment } from '../../environments/environment';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../services/student.service';

import { Student } from '../models/student.model';
import { TreeNode } from 'primeng/api';
import { Tree } from 'primeng/tree';


@Component({
  selector: 'app-my-resources',
  standalone: true,
  imports: [FileUpload, ToastModule, ProgressSpinner, CommonModule, ButtonModule, 
    ConfirmDialogModule, SelectButtonModule, FormsModule, Tree],
  providers: [MessageService, ConfirmationService],
  templateUrl: './my-resources.component.html',
  styleUrl: './my-resources.component.css'
})
export class MyResourcesComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  activateSpinner: boolean = false;
  files: any[] = [];
  studentList: Student[] = [];
  studentId: number = 0;
  stateOptions: any[] = [{ label: 'Mine', value: 'mine' },{ label: 'All', value: 'all' }];
  value: string = 'mine';
  folderPath: string = '';

  filesTree: TreeNode[] = [];
  selectedFile: TreeNode | null = null;
  selectedPath: string = this.studentId.toString();

  baseUrl = environment.baseUrl;
  private resourceStudentUrl = this.baseUrl + 'api/files';

  constructor(private http: HttpClient, private messageService: MessageService,
    private confirmationService: ConfirmationService, private route: ActivatedRoute,
    private router: Router, private studentService: StudentService) {}

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.studentId = this.route.snapshot.params['id'];
      this.loadStudent(this.studentId);
    } else{
      this.loadFilesStudent(this.studentId);
    }
    //this.loadFilesStudent(this.studentId);

  }

  // Carga de estudiantes, por id y general

  loadStudent(id: number) {
    this.studentService.getStudentById(id).subscribe((data) => {
      this.studentList = data;
      console.log('Student loaded', this.studentList);
      this.loadFilesStudent(this.studentId);
    });
  }

  loadStudentList() {
    this.studentService.getStudentList().subscribe((data) => {
      this.studentList = data;
      this.loadFiles();
    });
  }

  // Carga de archivos (genral y por id de estudiante)

  loadFiles() {
    this.http.get<any[]>(`${this.resourceStudentUrl}/getFiles`).subscribe(response => {
      this.files = response;
      this.filesTree = this.buildFileTree(this.files);
    }, error => {
      console.error('Error loading files', error);
    });
  }

  loadFilesStudent(id: number) {
    this.http.get<any[]>(`${this.resourceStudentUrl}/getFiles/${id}`).subscribe(response => {
      this.files = response;
      console.log('Files', this.files);
      this.filesTree = this.buildFileTree(this.files);
    }, error => {
      console.error('Error loading files', error);
    });
  }

  // Subida de archivos y creación de carpetas

  uploadHandler(event:FileUploadHandlerEvent) {
    let studentId = 0;
    if (this.route.snapshot.params['id']) {
      studentId = this.route.snapshot.params['id'];
    }
    for(let file of event.files) {
        this.uploadFile(file, this.selectedPath);
    }
  }

  uploadFile(file: File, selectedPath: string) {
    this.activateSpinner = true;
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('selectedPath', selectedPath);
    this.http.post(`${this.resourceStudentUrl}/upload`, formData).subscribe(response => {
      console.log('File uploaded successfully', response);
      this.messageService.add({severity:'success', summary: 'File Uploaded', detail: 'Uploaded ' + file.name});
      this.loadFilesStudent(this.studentId);
      this.activateSpinner = false;
      this.fileUpload.clear(); // Limpiar el componente p-fileUpload
      this.value = 'mine'; // esto es por si estamos en la carpeta de otro estudiante
    }, error => {
      console.error('Error uploading file', error);
      this.activateSpinner = false;
      this.messageService.add({severity:'error', summary: 'File Upload Error', detail: 'Error uploading ' + file.name});
    });
  }

  createFolder() {
    this.http.post(`${this.resourceStudentUrl}/createFolder`, null, { params: { folderPath: this.folderPath, selectedPath: this.selectedPath } }).subscribe(response => {
      this.messageService.add({ severity: 'success', summary: 'Folder Created', detail: 'Created folder ' + this.folderPath });
      this.loadFilesStudent(this.studentId);
      this.folderPath = '';
      this.value = 'mine'; // esto es por si estamos en la carpeta de otro estudiante
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Folder Create Error', detail: 'Error creating folder ' + this.folderPath });
      this.folderPath = '';
    });
  }


  // Borra archivos y carpetas

  onClickDelete(fileName: string) {

    this.confirmationService.confirm({
      message: 'Do you want to delete this file?',
      header: 'Delete Resource',
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
      this.loadFilesStudent(this.studentId);
      this.value = 'mine'; // esto es por si estamos en la carpeta de otro estudiante
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'File Delete Error', detail: 'Error deleting ' + fileName });
    });
  }

  onClickDeleteFolder(folderPath: string) {

    this.confirmationService.confirm({
      message: 'Do you want to delete this folder?',
      header: 'Delete Resource',
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
        this.deleteFolder(folderPath); 
      },
      reject: () => {
          // No action
      },
    });
  }

  deleteFolder(folderPath: string) {
    this.http.delete(`${this.resourceStudentUrl}/deleteFolder`, { params: { folderPath } }).subscribe(response => {
      this.messageService.add({ severity: 'success', summary: 'Folder Deleted', detail: 'Deleted folder ' + folderPath });
      this.loadFilesStudent(this.studentId);
      this.value = 'mine'; // esto es por si estamos en la carpeta de otro estudiante
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Folder Delete Error', detail: 'Error deleting folder ' + folderPath });
    });
  }

  // Construcción de árbol de archivos

  buildFileTree(files: File[]): TreeNode[] {
    const tree: TreeNode[] = [];
    const map = new Map<string, TreeNode>();

    files.forEach(file => {
      const parts = file.name.split('/');
      let currentLevel = tree;
      console.log('Parts', parts);
      parts.forEach((part: any, index: any) => {
        const path = parts.slice(0, index + 1).join('/');
        let node: any = map.get(path);
        
        if (!node) {
          let student = null;
          if(this.studentList.length > 0) {
            student = this.studentList.find(s => s.id.toString() === part);
          }
          const label = student ? student.name : part;
          node = { label: label, key: path, children: [] };
          map.set(path, node);

          if (index === parts.length - 1) {
            node.data = file;
          }

          if(node.label !== '') { 
            node.icon = this.getFileIcon(node.label!);
            currentLevel.push(node);
          }
          // currentLevel.push(node);
        }

        currentLevel = node.children!;
      });
    });
    return tree;
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
        return 'pi pi-folder';
    }
  }

  // Selección de archivos y carpetas

  onNodeSelect(event: any) {
    const node = event.node;
    if(!node.data) {
      this.selectedPath = node.key;
    }
    if (node.data) {
      // window.open(node.data.url, '_blank');
    }
  }

  onClickOpen(node: any) {
    if(node.data) {
      window.open(node.data.url, '_blank');
    }
  }

  // Botones de acción

  back() {
    this.router.navigateByUrl('/students');
  }

  onChangeSelectButton() {
    if (this.value === 'mine') {
      this.loadFilesStudent(this.studentId);
    } else {
      this.loadStudentList();
    }
  }
}
