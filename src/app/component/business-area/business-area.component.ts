import { OnInit, Signal, computed, Component, signal } from '@angular/core';
import { DataService } from '../../service/data.service';
import { Ba, BaForm, Gift} from '../../model/type';
import { AuthService } from '../../service/auth.service';
import { NgForOf, NgIf } from '@angular/common';
import { ColDef, AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-business-area',
  standalone: true,
  imports: [NgForOf, NgIf, AgGridAngular],
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

  rowData = computed(() => {
    console.log("Row data: ", this.selectedBaGifts());
    return this.selectedBaGifts()
  });
  headings:Signal<ColDef[]> = computed(() => [
    { headerName: 'Date of Offer', field: 'Date_of_Offer', sortable: true, filter: true, editable: false },
    { headerName: 'Offered To', field: 'Offered_to', sortable: true, filter: true, editable: false },
    { headerName: 'Offered From', field: 'Offered_From', sortable: true, filter: true, editable: false },
    { headerName: 'Description of offer', field: 'Description_of_offer', sortable: false, filter: false, editable: false },
    { headerName: 'Reason of offer', field: 'Reason_for_offer', sortable: false, filter: false, editable: false },
    { headerName: 'Details of contract', field: 'Details_of_contract', sortable: false, filter: false, editable: false },
    { headerName: 'Estimated Gift Value', field: 'Estimated_Gift_Value', sortable: true, filter: true, editable: false },
    { headerName: 'Action Taken', field: 'Action_Taken', sortable: true, filter: true , editable: false },
  ]);

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit(): void {
    console.log("BusinessArea component initialized");
    this.dataService.listBusinessArea().subscribe((ba: BaForm[]) => {
      console.log("Business areas fetched: ", ba);
      this.allBa.set(ba);
      this.dataService.getBusinessArea(ba[0].Business_Area, this.from(), this.to()).subscribe((ba: Ba) => {
        if (JSON.stringify(ba) === "{}") {
          this.selectedBaGifts.set([]);
          return;
        }
        ba.Gifts.forEach((gift) => {
          gift.Date_of_Offer = new Date(gift.Date_of_Offer).toLocaleDateString();
        });
        console.log("Selected business area: ", ba);
        console.log("Selected business area gifts: ", ba.Gifts);
        this.selectedBaName.set(ba.Business_Area);
        this.selectedBaGifts.set(ba.Gifts);
      });
    });
  }



  handleSelectionChange(event: any) {
    const selected = event.target.value;
    console.log("Selected business area: ", selected);
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
    this.handleReady("");
    });
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
        console.log("Business areas fetched after rename: ", ba);
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

  handleReady($event: any) {
    console.log("Ag-grid ready");
    this.rowData();
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
