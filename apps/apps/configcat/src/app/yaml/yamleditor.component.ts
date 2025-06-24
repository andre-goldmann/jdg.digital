import { AfterViewInit, Component, Input, signal } from '@angular/core';

import * as YAML from 'yaml';
import { FormsModule } from '@angular/forms';
import { EditorComponent, NgxEditorModel } from 'ngx-monaco-editor-v2';
import { ActivatedRoute } from '@angular/router';
import { editor } from 'monaco-editor';

@Component({
  selector: 'app-yaml-editor',
  imports: [FormsModule, EditorComponent],
  templateUrl: './yamleditor.component.html',
  styleUrl: './yamleditor.component.scss',
})
export class YamlEditorComponent implements AfterViewInit {
  @Input() env!:string | undefined;
  @Input() service!:string | undefined;
  @Input() tenant!:string | undefined;
  @Input() property!:string | undefined;
  @Input() value!:string | undefined;

  yamlCode = '';
  editorOptions = {
    theme: 'vs-dark',
    language: 'yaml',
    automaticLayout: true,
  };
  errorMessage = '';
  isLoading = signal(false);

  model: NgxEditorModel = {
    value: this.yamlCode,
    language: 'yaml',
  };

  constructor(private route: ActivatedRoute) {}

  // check this:https://guifier.com/yaml

  async loadYamlContent() {
    try {
      this.isLoading.set(true);
      const response = await fetch(
        `/api/configurations/download/${this.env}/${this.service}/${this.tenant}`
      );

      if (!response.ok) {
        throw new Error(`Error loading YAML content: ${response.statusText}`);
      }

      const content = await response.text();
      this.yamlCode = content;
      this.model.value = content;
      this.errorMessage = '';
    } catch (err: any) {
      this.errorMessage = `Failed to load YAML: ${err.message}`;
      console.error('Error loading YAML:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  onYamlChange(value: string) {
    try {
      YAML.parse(value); // Validate YAML
      this.errorMessage = '';
    } catch (err: any) {
      this.errorMessage = err.message;
    }
  }

  ngAfterViewInit(): void {
    if (this.env && this.service && this.tenant) {
      this.loadYamlContent();
    } else {
      console.warn(
        'Missing parameters. Please provide env, service, and tenant.'
      );
    }

    // Try to get params from route if not provided as @Input
    this.route.params.subscribe((params) => {
      if (params['env']) this.env = params['env'];
      if (params['service']) this.service = params['service'];
      if (params['tenant']) this.tenant = params['tenant'];
      if (this.env && this.service && this.tenant) {
        console.info("loading from route: ", params);
        this.loadYamlContent();
      } else {
        console.warn(
          'Missing parameters in route. Please provide env, service, and tenant.',
          params
        );
      }
    });
  }

  // Highlighting lines in Monaco Editor
  onInit(editor: editor.ICodeEditor): void {

    if(!this.property || !this.value){
      console.info("Property or value is not defined. Cannot highlight.");
      return;
    }

    // working string
    /*const searchQuery = 'http:\n' +
      '  header:\n' +
      '    disabled:';*/

    const editorModel: editor.ITextModel | null = editor.getModel();
    if(!editorModel) {
      return;
    }
    // this is not working correctly so better check the selected row ymal to find the lines
    const matches: editor.FindMatch[] = editorModel.findMatches(this.dotNotationToYaml(this.property), false, false, false, null, false);

    if (matches.length > 0) {
      // scroll to the first search result
      editor.revealRangeInCenter(matches[0].range);

      // highlight all search results
      matches.forEach((match: editor.FindMatch): void => {
        //console.info("Found: " , match, match.range);
        editorModel.deltaDecorations([], [
          {
            range: match.range,
            options: {
              isWholeLine: false,
              inlineClassName: 'highlight'
            }
          }
        ]);
      });
    }else {
      console.info("No matches found for: ", this.dotNotationToYaml(this.property));
    }
  }

  // does not work for:
  // personalization-config.personalization-strategies.profile.disabled.0
  // http.header.csp.directives.connect-src
  dotNotationToYaml(key: string): string {
    const parts = key.split('.');
    let indent = '';
    let yaml = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // Stop before the first numeric segment
      if (!isNaN(Number(part)) && part.trim() !== '') {
        break;
      }
      yaml += indent + part + ':';
      // Only add newline/indent if not at the last segment to be processed
      if (i < parts.length - 1) {
        // Check if next part is a number; if so, don't add newline/indent
        if (isNaN(Number(parts[i + 1])) || parts[i + 1].trim() === '') {
          yaml += '\n';
          indent += '  ';
        }
      }
    }

    return yaml;
  }

}
