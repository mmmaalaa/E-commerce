import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBlankComponent } from '../../components/nav-blank/nav-blank.component';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavBlankComponent],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.scss'
})
export class BlankLayoutComponent {

}
