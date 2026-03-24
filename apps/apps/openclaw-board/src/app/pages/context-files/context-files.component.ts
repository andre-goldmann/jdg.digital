import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';
import { ContextFilesService } from '../../services/context-files.service';
import { ContextFile } from '../../models/models';

@Component({
  selector: 'app-context-files',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './context-files.component.html',
  styleUrl: './context-files.component.scss',
})
export class ContextFilesComponent implements OnInit {
  private readonly contextFilesService = inject(ContextFilesService);

  readonly files = signal<ContextFile[]>([]);
  readonly selectedFile = signal<ContextFile | null>(null);
  readonly fileContent = signal('');
  readonly editedContent = signal('');
  readonly isEditing = signal(false);
  readonly showPreview = signal(false);
  readonly previewHtml = computed(() => marked.parse(this.fileContent()) as string);

  ngOnInit(): void {
    this.contextFilesService.getFiles().subscribe((files) => {
      this.files.set(files);
      const first = files[0];
      if (first) {
        this.selectFile(first);
      }
    });
  }

  selectFile(file: ContextFile): void {
    this.selectedFile.set(file);
    this.isEditing.set(false);
    this.showPreview.set(false);
    if (!file.exists) {
      this.fileContent.set('');
      this.editedContent.set('');
      return;
    }

    this.contextFilesService.getFileContent(file.name).subscribe((content) => {
      this.fileContent.set(content);
      this.editedContent.set(content);
    });
  }

  startEditing(): void {
    this.editedContent.set(this.fileContent());
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
  }

  save(): void {
    const file = this.selectedFile();
    if (!file) return;
    this.contextFilesService
      .saveFileContent(file.name, this.editedContent())
      .subscribe((success) => {
        if (success) {
          this.fileContent.set(this.editedContent());
          this.isEditing.set(false);
          this.contextFilesService.getFiles().subscribe((f) => this.files.set(f));
        }
      });
  }

  togglePreview(): void {
    this.showPreview.update((v) => !v);
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return 'nicht vorhanden';
    const kb = bytes / 1024;
    return kb < 1 ? `${bytes} B` : `${kb.toFixed(1)} KB`;
  }

  onEditedContentChange(value: string): void {
    this.editedContent.set(value);
  }
}
