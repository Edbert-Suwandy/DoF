import { Component, OnInit, computed, Signal } from '@angular/core';
import { DataService } from '../../service/data.service';
import { DataService as AuthService } from '../../service/auth.service';
import { BusinessForm, Gift, Business } from '../../model/type.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgForOf, AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [NgForOf, AsyncPipe, NgIf],
  templateUrl: './business.component.html',
  styleUrl: './business.component.css'
})
export class BusinessComponent implements OnInit {
  private bSubject = new BehaviorSubject<BusinessForm[]>([]);
  allB$: Observable<BusinessForm[]> = this.bSubject.asObservable();

  private selectedBName = new BehaviorSubject<string>("");
  selectedBName$: Observable<string> = this.selectedBName.asObservable();

  private selectedBGifts = new BehaviorSubject<Gift[]>([]);
  selectedBGifts$: Observable<Gift[]> = this.selectedBGifts.asObservable();

  is_admin:Signal<boolean>= computed(() => this.authService.is_admin());

  constructor(private dataService: DataService, private authService: AuthService) {}

  listBusiness() {
    this.dataService.listBusiness().subscribe((b: BusinessForm[]) => {
      this.bSubject.next(b);
    });
  }

  ngOnInit(): void {
    this.listBusiness();
    this.setInitialSelectedBa();
  }

  setInitialSelectedBa() {
    this.allB$.subscribe(ba => {
      if (ba.length > 0) {
        const ba_name = this.authService.get_cookie('b_name');
        if (ba_name) {
          this.setSelectedB(ba_name);
        } else {
          this.setSelectedB(ba[0]._id);
        }
      }
    });
  }

  setSelectedB(name: string) {
    this.authService.set_cookie('b_name', name);
    this.selectedBName.next(name);
    this.fetchBGifts(name);
  }

  fetchBGifts(name: string) {
    this.dataService.getBusiness(name).subscribe((b: Business) => {
      this.selectedBGifts.next(b.Gifts);
    });
  }

  handleSelectionChange(event: any) {
    const selected = event.target.value;
    console.log(selected);
    this.setSelectedB(selected);
  }

  renameHandler(e: any) {
    
  }

  deleteHandler(e: any) {

  }
}
