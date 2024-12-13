import { OnInit, Signal, computed, Component, signal } from '@angular/core';
import { DataService } from '../../service/data.service';
import { Ba, BaForm, Gift} from '../../model/type';
import { AuthService } from '../../service/auth.service';
import { NgForOf, NgIf } from '@angular/common';


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
  from = signal<string>("1/1/1970");
  to = signal<string>("30/1/2090");

  is_admin: Signal<boolean> = computed(() => this.authService.is_admin());

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit(): void {
    this.dataService.listBusinessArea().subscribe((ba: BaForm[]) => {
      this.allBa.set(ba);
      this.dataService.getBusinessArea(ba[0].Business_Area, this.from(), this.to()).subscribe((ba: Ba) => {
        if (JSON.stringify(ba) === "{}") {
          this.selectedBaGifts.set([]);
          return;
        }
        ba.Gifts.forEach((gift) => {
          gift.Date_of_Offer = new Date(gift.Date_of_Offer).toLocaleDateString();
        });
        this.selectedBaName.set(ba.Business_Area);
        this.selectedBaGifts.set(ba.Gifts);
      });
    });
  }

  handleSelectionChange(event: any) {
    const selected = event.target.value;
    console.log(selected);
    this.dataService.getBusinessArea(selected, this.from(), this.to()).subscribe((ba: Ba) => {
      if (JSON.stringify(ba) === "{}") {
        this.selectedBaGifts.set([]);
        return;
      }
      ba.Gifts.forEach((gift) => {
        gift.Date_of_Offer = new Date(gift.Date_of_Offer).toLocaleDateString();
      });
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
        this.dataService.getBusinessArea(new_name, this.from(), this.to()).subscribe((ba: Ba) => {
          if (JSON.stringify(ba) === "{}") {
            this.selectedBaGifts.set([]);
            return;
          }
          ba.Gifts.forEach((gift) => {
            gift.Date_of_Offer = new Date(gift.Date_of_Offer).toLocaleDateString();
          });
          this.selectedBaName.set(ba.Business_Area);
          this.selectedBaGifts.set(ba.Gifts);
        });
      });
    });
  }
  
  addHandler() {
    console.log('Adding gift to: ', this.selectedBaName());
  }

  handleFromChange(e: any) {
    let selected = e.target.value;
    let date = selected.split("-");
    date = date.reverse();
    date = date.join("/");
    this.from.set(date);
    console.log("From: ", this.from());
    this.ngOnInit();
  }

  handleToChange(e: any) {
    let selected = e.target.value;
    let date = selected.split("-");
    date = date.reverse();
    date = date.join("/");
    this.to.set(date);
    console.log("To: ", this.to());
    this.ngOnInit();
  }
}
