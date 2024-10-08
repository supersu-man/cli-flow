import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';


// declare const window: any;
@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [ InputTextModule, CardModule, ButtonModule, DialogModule, InputTextareaModule, ReactiveFormsModule, ToolbarModule ],
  templateUrl: './tab.component.html',
  styles: ``
})
export class TabComponent implements OnInit {

  scriptDialog = false
  scriptForm = new FormGroup({
    id: new FormControl(null),
    title: new FormControl(null, Validators.required),
    code: new FormControl(null, Validators.required)
  })
  searchForm = new FormGroup({
    text: new FormControl(null),
  })

  scripts: { id: string, title: string, code: string }[] = []
  spinners: string[] = []

  constructor(private messageService: MessageService) { }


  ngOnInit(): void {
    this.getScripts();
    (window as any).api.scriptOutput((returnData: { output: string, error: boolean }) => {
      if (returnData.error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: returnData.output });
      } else {
        this.messageService.add({ severity: 'success', summary: 'Executed', detail: returnData.output });
      }
      console.log(returnData.output)
    })
  }

  getScripts = async () => {
    this.scripts = await (window as any).api.getScripts()
  }

  execute = async (script: { id: string, title: string, code: string }) => {
    await (window as any).api.executeScript(script.code)
  }

  copy = (text: string) => {
    navigator.clipboard.writeText(text);
    this.messageService.add({ severity: 'success', summary: 'Copied', detail: 'Script copied sucessfully' });
  }

  delete = async (id: string) => {
    const scripts = await (window as any).api.deleteScript(id)
    this.scripts = scripts
    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Script deleted sucessfully' });
  }

  saveScript = async () => {
    if (this.scriptForm.controls.id.value) {
      const scripts = await (window as any).api.editScript(this.scriptForm.getRawValue())
      this.scripts = scripts
      this.messageService.add({ severity: 'success', summary: 'Edited', detail: 'Script edited sucessfully' });
    } else {
      const scripts = await (window as any).api.addScript(this.scriptForm.getRawValue())
      this.scripts = scripts
      this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Script added sucessfully' });
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
