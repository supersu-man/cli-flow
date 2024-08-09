import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';



// declare const window: any;
@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [ InputTextModule, IconFieldModule, InputIconModule, CardModule, ButtonModule, DialogModule, InputTextareaModule, ReactiveFormsModule ],
  templateUrl: './tab.component.html',
  styles: ``
})
export class TabComponent implements OnInit {

  scriptDialog = false

  scriptForm = new FormGroup({
    id: new FormControl(null, Validators.required),
    title: new FormControl(null, Validators.required),
    code: new FormControl(null, Validators.required)
  })

  scripts: { id: string, title: string, code: string }[] = []

  ngOnInit(): void {
    this.getScripts()
  }

  getScripts = async () => {
    this.scripts = await (window as any).api.getScripts()
    console.log(this.scripts)
  }

  execute = async (code: string) => {
    const output = await (window as any).api.executeScript(code)
    console.log(output)
  }

  copy = (text: string) => {
    navigator.clipboard.writeText(text);
  }

  delete = async (id: string) => {
    const scripts = await (window as any).api.deleteScript(id)
    this.scripts = scripts
  }

  saveScript = async () => {
    if (this.scriptForm.controls.id) {
      const scripts = await (window as any).api.editScript(this.scriptForm.getRawValue())
      this.scripts = scripts
    } else {
      const scripts = await (window as any).api.addScript(this.scriptForm.getRawValue())
      this.scripts = scripts
    }
  }

  openScriptDialog = (script: any) => {
    if (script) {
      this.scriptForm.patchValue(script)
    } else {
      this.scriptForm.reset()
    }
    this.scriptDialog = true
  }

}
