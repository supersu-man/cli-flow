import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [ InputTextModule, IconFieldModule, InputIconModule, CardModule, ButtonModule ],
  templateUrl: './tab.component.html',
  styles: ``
})
export class TabComponent {

  scripts = [
    {
      title: 'Move TNService to docker',
      code: 'docker exec -it 5fb016c39e1b /bin/bash',
    },
    {
      title: 'Move TNService to docker',
      code: 'docker exec -it 5fb016c39e1b /bin/bash',
    },
    {
      title: 'Move TNService to docker',
      code: 'docker exec -it 5fb016c39e1b /bin/bash',
    }
  ]

  copy = (text: string) => {
    navigator.clipboard.writeText(text);
  }

  execute = (code: string) => {

  }

  delete = (id: string) => {
    
  }

}
