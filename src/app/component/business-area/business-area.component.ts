import { OnInit, Signal, computed, Component } from '@angular/core';
import { DataService } from '../../service/data.service';
import { Ba, BaForm, Gift} from '../../model/type.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService as AuthService } from '../../service/auth.service';
import { NgForOf, AsyncPipe, NgIf } from '@angular/common';


@Component({
  selector: 'app-business-area',
  standalone: true,
  imports: [NgForOf, AsyncPipe, NgIf],
  templateUrl: './business-area.component.html',
  styleUrl: './business-area.component.css'
})
export class BusinessAreaComponent implements OnInit {
  private baSubject = new BehaviorSubject<BaForm[]>([]);
  allBa$: Observable<BaForm[]> = this.baSubject.asObservable();

  private selectedBaName = new BehaviorSubject<string>("");
  selectedBaName$: Observable<string> = this.selectedBaName.asObservable();

  private selectedBaGifts = new BehaviorSubject<Gift[]>([]);
  selectedBaGifts$: Observable<Gift[]> = this.selectedBaGifts.asObservable();

  is_admin:Signal<boolean>= computed(() => this.authService.is_admin());

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit(): void {
    this.listBa();
    this.setInitialSelectedBa();
  }

  listBa() {
    this.dataService.listBusinessArea().subscribe((ba: BaForm[]) => {
      this.baSubject.next(ba);
    });
  }
  
  setInitialSelectedBa() {
    this.allBa$.subscribe(ba => {
      if (ba.length > 0) {
        const ba_name = this.authService.get_cookie('ba_name');
        if (ba_name) {
          this.setSelectedBa(ba_name);
        } else {
          this.setSelectedBa(ba[0].Business_Area);
        }
      }
    });
  }

  setSelectedBa(name: string) {
    this.authService.set_cookie('ba_name', name);
    this.selectedBaName.next(name);
    this.fetchBaGifts(name);
  }

  fetchBaGifts(name: string) {
    this.dataService.getBusinessArea(name).subscribe((ba: Ba) => {
      this.selectedBaGifts.next(ba.Gifts);
    });
  }

  handleSelectionChange(event: any) {
    const selected = event.target.value;
    console.log(selected);
    this.setSelectedBa(selected);
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
    if (!token) {
      alert('You need to be logged in to rename a business area');
      return;
    }

    console.log(token)

    this.dataService.renameBa(this.selectedBaName.getValue(), new_name, token).subscribe(() => {
      console.log('Renamed business area');
    });
  }
  
  addHandler() {
    console.log('Adding gift to: ', this.selectedBaName.getValue());
  }
}
