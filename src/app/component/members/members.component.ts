import { Component, computed, signal, Signal } from '@angular/core';
import { OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { DataService as authService} from '../../service/auth.service';
import { MemberForm, Gift, Member } from '../../model/type.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})

export class MembersComponent implements OnInit {
  allMembers = signal<MemberForm[]>([]);
  selectedMemberId = signal<string>("");
  selectedMemberGifts = signal<Gift[]>([]);

  is_admin: Signal<boolean> = computed(() => this.authService.is_admin());

  constructor(private dataService: DataService, private authService: authService) {}

  ngOnInit(): void {
    console.log("ngOnInit called");
    this.dataService.listMembers().subscribe((members: MemberForm[]) => {
      this.allMembers.set(members);

      const member_id = members[0]._id;
      this.dataService.getMember(member_id).subscribe((member: Member) => {
        this.selectedMemberId.set(member._id);
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
    this.dataService.getMember(e.target.value).subscribe((member: Member) => {
      this.selectedMemberGifts.set(member.Gifts);
    })
  }

  deleteHandler() {
    this.dataService.deleteMember(this.selectedMemberId(), this.authService.get_cookie("token")).subscribe(() => {
      this.dataService.listMembers().subscribe((members: MemberForm[]) => {
        this.allMembers.set(members);
        this.selectedMemberId.set(this.allMembers()[0]._id);
        this.dataService.getMember(this.selectedMemberId()).subscribe((member: Member) => {
          this.selectedMemberGifts.set(member.Gifts);
        });
      });
    });
  }

  deleteGiftHandler(event: any) {
    this.dataService.deleteGift(this.selectedMemberId(), event.currentTarget.value, this.authService.get_cookie("token")).subscribe(() => {
      console.log("Gift deleted");
      this.dataService.getMember(this.selectedMemberId()).subscribe((member: Member) => {
        this.selectedMemberGifts.set(member.Gifts);
      });
    });
  }


  editHandler(event: Event) {
    const button = event.currentTarget as HTMLButtonElement;
    const value = button.value;
    const [hash, field] = value.split('|');
    console.log("hash: ", hash, "field: ", field);
    let new_value = prompt('Enter new value', field);
    if (!new_value) {
      alert("Value is empty");
      return;
    }

    this.dataService.editGift(this.selectedMemberId(), field, new_value, hash, this.authService.get_cookie("token")).subscribe(() => {
      this.dataService.listMembers().subscribe((members: MemberForm[]) => {
        this.allMembers.set(members);
        this.selectedMemberId.set(members[0]._id);
        this.dataService.getMember(members[0]._id).subscribe((member: Member) => {
          this.selectedMemberGifts.set(member.Gifts);
        });
      });
    });
  }
}
