import { OnInit, Signal, computed, Component, signal } from '@angular/core';
import { DataService } from '../../service/data.service';
import { Ba, BaForm, Gift} from '../../model/type';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { NgForOf, AsyncPipe, NgIf } from '@angular/common';


@Component({
  selector: 'app-business-area',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './business-area.component.html',
  styleUrl: './business-area.component.css'
})
export class BusinessAreaComponent implements OnInit {
  allBa = signal<BaForm[]>([]);
  selectedBaName = signal<string>("");
  selectedBaGifts = signal<Gift[]>([]);
  is_admin: Signal<boolean> = computed(() => this.authService.is_admin());

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit(): void {
    this.dataService.listBusinessArea().subscribe((ba: BaForm[]) => {
      this.allBa.set(ba);
      this.dataService.getBusinessArea(ba[0].Business_Area).subscribe((ba: Ba) => {
        this.selectedBaName.set(ba.Business_Area);
        this.selectedBaGifts.set(ba.Gifts);
      });
    });
  }
  
  fetchBaGifts(name: string) {
    this.dataService.getBusinessArea(name).subscribe((ba: Ba) => {
      this.selectedBaGifts.set(ba.Gifts);
    });
  }

  handleSelectionChange(event: any) {
    const selected = event.target.value;
    console.log(selected);
    this.dataService.getBusinessArea(selected).subscribe((ba: Ba) => {
      this.selectedBaName.set(ba.Business_Area);
      this.selectedBaGifts.set(ba.Gifts);
    });
  }

  editHandler(e: any) {
    console.log('Edit gift with hash:',);
    // Implement edit logic here
  }

  renameHandler() {
    const new_name = prompt('Enter new name');
    if (!new_name) {
      alert("Name is empty")
      return;
    }

    let token = this.authService.get_cookie('token');

    this.dataService.renameBa(this.selectedBaName(), new_name, token).subscribe(() => {
      this.dataService.listBusinessArea().subscribe((ba: BaForm[]) => {
        this.allBa.set(ba);
        this.fetchBaGifts(new_name);
      });
    });
  }
  
  addHandler() {
    console.log('Adding gift to: ', this.selectedBaName());
  }
}
