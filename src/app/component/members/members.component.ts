import { Component, computed, signal, Signal } from '@angular/core';
import { OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';
import { DataService as authService} from '../../service/auth.service';
import { MemberForm, Gift, MemberGifts } from '../../model/type.service';
import { NgForOf, NgIf, AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [NgForOf, NgIf, AsyncPipe],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})

export class MembersComponent implements OnInit {
  private membersSubject = new BehaviorSubject<MemberForm[]>([]);
  allMembers$: Observable<MemberForm[]> = this.membersSubject.asObservable();

  private selectedMemberId = new BehaviorSubject<string>("");
  selectedMemberId$: Observable<string> = this.selectedMemberId.asObservable();

  private selectedMemberGifts = new BehaviorSubject<Gift[]>([]);
  selectedMemberGifts$: Observable<Gift[]> = this.selectedMemberGifts.asObservable();
  
  is_admin:Signal<boolean>= computed(() => this.authService.is_admin());

  constructor(private dataService: DataService, private authService: authService) {}

  ngOnInit(): void {
    this.listMember();
    this.setInitialSelectedMember();
  }

  listMember() {
    this.dataService.listMembers().subscribe((members: MemberForm[]) => {
      this.membersSubject.next(members);
    });
  }
  
  handleSelectionClick(e: any) {
    if (e === null) {
      return;
    }

    this.setSelectedMember(e.target.value);
  }

  setInitialSelectedMember() {
    this.allMembers$.subscribe(members => {
      if (members.length > 0) {
        const memberId = this.authService.get_cookie('member_id');
        if (memberId) {
          this.setSelectedMember(memberId);
        } else {
          this.setSelectedMember(members[0]._id);
        }
      }
    });
  }

  setSelectedMember(id: string) {
    this.authService.set_cookie('member_id', id);
    this.selectedMemberId.next(id);
    this.fetchMemberGifts(id);
  }

  fetchMemberGifts(id: string) {
    this.dataService.getMember(id).subscribe((members: MemberGifts[]) => {
      const gifts = members.flatMap(member => member.Gifts);
      this.selectedMemberGifts.next(gifts);
    });
  }

  deleteHandler(e: any) {
    this.deleteGift(e.target.value);
  }

  deleteGift(hash: string) {
    const memberId = this.selectedMemberId.getValue();
    this.dataService.deleteMember(memberId, hash, this.authService.get_cookie("token")).subscribe(() => {
      this.fetchMemberGifts(memberId);
    });
  }
  
  editHandler(event: Event) {
    const button = event.currentTarget as HTMLButtonElement;
    const value = button.value;
    const [hash, field] = value.split('|');
    console.log(hash, field);
  }
}
