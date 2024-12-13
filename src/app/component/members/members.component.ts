import { Component, computed, signal, Signal } from '@angular/core';
import { OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { AuthService } from '../../service/auth.service';
import { MemberForm, Gift, Member } from '../../model/type';
import { NgForOf, NgIf } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [NgForOf, NgIf, AgGridAngular],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})

export class MembersComponent implements OnInit {
  allMembers = signal<MemberForm[]>([]);
  selectedMemberId = signal<string>("");
  selectedMemberGifts = signal<Gift[]>([]);

  from = signal<string>("1/1/1970");
  to = signal<string>("30/1/2090");
  rowData = computed(() => this.selectedMemberGifts());

  headings:Signal<ColDef[]> = computed(() => [
    { headerName: 'Date of Offer', field: 'Date_of_Offer', sortable: true, filter: true, editable: this.is_admin() },
    { headerName: 'Offered To', field: 'Offered_to', sortable: true, filter: true, editable: this.is_admin() },
    { headerName: 'Offered From', field: 'Offered_From', sortable: true, filter: true, editable: this.is_admin() },
    { headerName: 'Description of offer', field: 'Description_of_offer', sortable: false, filter: false, editable: this.is_admin() },
    { headerName: 'Reason of offer', field: 'Reason_for_offer', sortable: false, filter: false, editable: this.is_admin() },
    { headerName: 'Details of contract', field: 'Details_of_contract', sortable: false, filter: false, editable: this.is_admin() },
    { headerName: 'Estimated Gift Value', field: 'Estimated_Gift_Value', sortable: true, filter: true, editable: this.is_admin() },
    { headerName: 'Action Taken', field: 'Action_Taken', sortable: true, filter: true , editable: this.is_admin()},
  ]);

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

  is_admin: Signal<boolean> = computed(() => this.authService.is_admin());

  constructor(private dataService: DataService, private authService: AuthService) {}

  ngOnInit(): void {
    console.log("Members component initialized");
    this.dataService.listMembers().subscribe((members: MemberForm[]) => {
      this.allMembers.set(members);
      const member_id = members[0]._id;
      this.selectedMemberId.set(member_id);
      this.dataService.getMember(member_id,this.from(),this.to()).subscribe((member: Member) => {
        if (JSON.stringify(member) === "{}") {
          this.selectedMemberGifts.set([]);
          return;
        }
        member.Gifts.forEach((gift) => {
            gift.Date_of_Offer = new Date(gift.Date_of_Offer).toLocaleDateString();
          });
        this.selectedMemberGifts.set(member.Gifts);
      });
    });
  }

  listMember() {
    this.dataService.listMembers().subscribe((members: MemberForm[]) => {
      console.log("Members fetched: ", members);
      this.allMembers.set(members);
    });
  }

  handleSelectionClick(e: any) {
    if (e === null) {
      return;
    }
    this.selectedMemberId.set(e.target.value);
    this.dataService.getMember(e.target.value, this.from(), this.to()).subscribe((member: Member) => {
      if (JSON.stringify(member) === "{}") {
        this.selectedMemberGifts.set([]);
        return;
      }
      member.Gifts.forEach((gift) => {
        gift.Date_of_Offer = new Date(gift.Date_of_Offer).toLocaleDateString();
      });
      this.selectedMemberGifts.set(member.Gifts);
    })
  }

  deleteHandler() {
    this.dataService.deleteMember(this.selectedMemberId(), this.authService.get_cookie("token")).subscribe(() => {
      this.dataService.listMembers().subscribe((members: MemberForm[]) => {
        this.allMembers.set(members);
        this.selectedMemberId.set(this.allMembers()[0]._id);
        this.dataService.getMember(this.selectedMemberId(), this.from(), this.to()).subscribe((member: Member) => {
          if (JSON.stringify(member) === "{}") {
            this.selectedMemberGifts.set([]);
            return;
          }
          this.selectedMemberGifts.set(member.Gifts);
        });
      });
    });
  }

  deleteGiftHandler(event: any) {
    this.dataService.deleteGift(this.selectedMemberId(), event.currentTarget.value, this.authService.get_cookie("token")).subscribe(() => {
      console.log("Gift deleted");
      this.dataService.getMember(this.selectedMemberId(), this.from(), this.to()).subscribe((member: Member) => {
        if (JSON.stringify(member) === "{}") {
          this.selectedMemberGifts.set([]);
          return;
        }
        member.Gifts.forEach((gift) => {
          gift.Date_of_Offer = new Date(gift.Date_of_Offer).toLocaleDateString();
        });
        this.selectedMemberGifts.set(member.Gifts);
      });
    });
  }

  handleReady($event: any) {
    console.log("Ag-grid ready");
    this.rowData();
  }

  handleRowEditingStopped(event: any) {
    let field = (event.colDef.field);
    console.log(event.data[field]);
    console.log(event.data.hash);

    this.editHandler(field, event.data[field], event.data.hash);
  }

  editHandler(field: string, new_value: string, hash: string) {
    this.dataService.editGift(this.selectedMemberId(), field, new_value, hash, this.authService.get_cookie("token")).subscribe(() => {
      this.dataService.listMembers().subscribe((members: MemberForm[]) => {
        this.allMembers.set(members);
        this.selectedMemberId.set(members[0]._id);
        this.dataService.getMember(members[0]._id, this.from(), this.to()).subscribe((member: Member) => {
          if (JSON.stringify(member) === "{}") {
            this.selectedMemberGifts.set([]);
            return;
          }
          member.Gifts.forEach((gift) => {
            gift.Date_of_Offer = new Date(gift.Date_of_Offer).toLocaleDateString();
          });
          this.selectedMemberGifts.set(member.Gifts);
        });
      });
    });
  }
}
