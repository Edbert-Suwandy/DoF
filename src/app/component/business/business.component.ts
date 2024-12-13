import { Component, OnInit, computed, Signal, signal } from '@angular/core';
import { DataService } from '../../service/data.service';
import { AuthService } from '../../service/auth.service';
import { BusinessForm, Gift, Business } from '../../model/type';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './business.component.html',
  styleUrl: './business.component.css'
})
export class BusinessComponent implements OnInit {
  allB = signal<BusinessForm[]>([]);
  selectedBName = signal<string>("");
  selectedBGifts = signal<Gift[]>([]);
  from = signal<string>("1/1/1970");
  to = signal<string>("30/1/2090");

  is_admin: Signal<boolean> = computed(() => this.authService.is_admin());

  constructor(private dataService: DataService, private authService: AuthService) {}

  ngOnInit(): void {
    this.dataService.listBusiness().subscribe((b: BusinessForm[]) => {
      this.allB.set(b);
      this.dataService.getBusiness(b[0]._id, this.from(), this.to()).subscribe((b: Business) => {
        if (JSON.stringify(b) === "{}") {
          this.selectedBGifts.set([]);
          return;
        }
        this.selectedBName.set(b._id);
        b.Gifts.forEach((gift) => {
          gift.Date_of_Offer = new Date(gift.Date_of_Offer).toLocaleDateString();
        });
        this.selectedBGifts.set(b.Gifts);
      });
    });
  }

  fetchBGifts(name: string) {
    this.dataService.getBusiness(name).subscribe((b: Business) => {
      this.selectedBGifts.set(b.Gifts);
    });
  }

  handleSelectionChange(event: any) {
    const selected = event.target.value;
    console.log(selected);
    this.dataService.listBusiness().subscribe((b: BusinessForm[]) => {
      this.dataService.getBusiness(selected, this.from(), this.to()).subscribe((b: Business) => {
        if(JSON.stringify(b) === "{}") {
          this.selectedBGifts.set([]);
          return;
        }
        this.selectedBName.set(b._id);
        b.Gifts.forEach((gift) => {
          gift.Date_of_Offer = new Date(gift.Date_of_Offer).toLocaleDateString();
        });
        this.selectedBGifts.set(b.Gifts);
      });
    });
  }

  renameHandler() {
    let new_name = prompt('Enter new name');
    if (!new_name) {
      alert("Name is empty")
      return;
    }
    this.dataService.renameB( this.selectedBName(), new_name, this.authService.get_cookie("token")).subscribe(() =>{
      alert("Business renamed successfully");
      this.dataService.listBusiness().subscribe((b: BusinessForm[]) => {
        this.allB.set(b);
        this.dataService.getBusiness(new_name, this.from(), this.to()).subscribe((b: Business) => {
          if(JSON.stringify(b) === "{}") {
            this.selectedBGifts.set([]);
            return;
          }
          this.selectedBName.set(b._id);
          b.Gifts.forEach((gift) => {
            gift.Date_of_Offer = new Date(gift.Date_of_Offer).toLocaleDateString();
          });
          this.selectedBGifts.set(b.Gifts);
        });
      });
    })
  };

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
