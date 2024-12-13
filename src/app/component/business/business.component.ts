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
  is_admin: Signal<boolean> = computed(() => this.authService.is_admin());

  constructor(private dataService: DataService, private authService: AuthService) {}

  ngOnInit(): void {
    this.dataService.listBusiness().subscribe((b: BusinessForm[]) => {
      this.allB.set(b);
      this.dataService.getBusiness(b[0]._id).subscribe((b: Business) => {
        this.selectedBName.set(b._id);
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
      this.dataService.getBusiness(selected).subscribe((b: Business) => {
        this.selectedBName.set(b._id);
        this.selectedBGifts.set(b.Gifts);
      });
    });
  }

  renameHandler(e: any) {
    
  }

  deleteHandler(e: any) {

  }
}
