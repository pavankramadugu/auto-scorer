import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {HttpClient} from "@angular/common/http";

interface TestResult {
  testName: string;
  status: 'PASS' | 'FAIL';
}

@Component({
  selector: 'app-lab2',
  templateUrl: './lab2.component.html',
  styleUrls: ['./lab2.component.css']
})
export class Lab2Component implements OnInit {
  showDialog = false;
  dialogHeader = '';
  testResults: TestResult[] = [];
  lab2Form!: FormGroup;
  fileName: string = '';
  file: File | null = null;
  totalScore: number = 0;
  maxScore: number = 0;
  logs: string = '';
  showLogs: boolean = false;
  showSpinner: boolean = false;

  constructor(private messageService: MessageService,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.lab2Form = new FormGroup({
      asuriteUserId: new FormControl('', Validators.required),
      fileUploaded: new FormControl(false, Validators.requiredTrue)
    });
  }

  onUpload(event: any) {
    if (event.files.length > 0) {
      const file: File = event.files[0];
      const extension = file.name.split('.').pop();
      if (extension && extension.toLowerCase() === 'go') {
        this.file = file;
        this.fileName = file.name;
        this.lab2Form.patchValue({fileUploaded: true});
      } else {
        this.fileName = '';
        this.file = null;
        this.lab2Form.patchValue({fileUploaded: false})
        this.messageService.add({severity: 'warning', summary: 'Error', detail: 'Only .go files are allowed.'});
      }
    }
  }

  onSubmit() {
    this.showSpinner = true;
    if (this.lab2Form.valid && this.file) {
      const formData = new FormData();
      formData.append(this.fileName, this.file);
      formData.append('username', this.lab2Form.value.asuriteUserId);

      this.http.post('http://127.0.0.1:5000/upload-file', formData).subscribe({
        next: (res: any) => {
          this.dialogHeader = res.message;
          this.showResults(res);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred: ' + (err.error.message || err.message)
          });
        }
      });

    }
  }

  showResults(data: any) {
    this.testResults = Object.keys(data.results).map(key => ({
      testName: key,
      status: data.results[key]
    }));
    this.dialogHeader = data.message;
    this.totalScore = data.score;
    this.maxScore = this.testResults.length * 10;
    this.logs = data.logs;
    this.showDialog = true;
    this.showSpinner = false;
  }
}
