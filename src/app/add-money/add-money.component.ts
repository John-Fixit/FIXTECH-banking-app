import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { faMoneyCheck, faMoneyBillTransfer, faIdCardAlt, faMoneyCheckAlt, faGreaterThan as greaterSign, faBank, faCopy, faUserAlt } from "@fortawesome/free-solid-svg-icons"
import { environment } from 'src/environments/environment';
import { TransactionService } from '../services/transaction.service';
import { UsersService } from '../services/users.service';
import { ToastService } from 'angular-toastify';
@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.component.html',
  styleUrls: ['./add-money.component.css']
})
export class AddMoneyComponent implements OnInit {
  sideNavStatus : boolean = false
  greaterSign = greaterSign
  bankIcon = faBank
  copyIcon = faCopy
  userIcon = faUserAlt
  reference = ""
  public response = ""
  public responseErr:any = undefined
  public copiedStatus:any = false

  public addMoneyType:any = ""
  public userDetail:any = undefined;

  public amountToFund:any = parseInt("")
  public amtIsEmpty:boolean = true
  public thisData= [
     {
         icon: faMoneyBillTransfer,
         bold_text: "Bank Transfer",
         light_text: "Add money via mobile or internet banking"
     },
     {
         icon: faIdCardAlt,
         bold_text: "Top-up with card/Account",
         light_text: "Add money directly from your bank card"
     },
    //  {
    //      icon: faMoneyCheck,
    //      bold_text: "Cash Deposit",
    //      light_text: "Fund your account with ease"
    //  },
    //  {
    //      icon: faMoneyCheckAlt,
    //      bold_text: "Request Money from Others",
    //      light_text: "You can change your mobile number"
    //  },
  ]

  constructor(
    private _userService: UsersService,
    private _transactionService: TransactionService,
    private _toastService: ToastService
  ) { }

  ngOnInit(): void {
    this._userService.authorizeUser().subscribe((res)=>{
      if(res.status)this.userDetail = res.userDetail
      
    })
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`
  }

  modalOutFunc(params:any){
      this.addMoneyType = params.title
    }
    
    paymentCancel(){
      alert('You want to close the payment gate')
    }
    paymentDone(params:any){
      let transactionDetail = {type: 'credit', recipient: `${this.userDetail.firstname} ${this.userDetail.lastname}`, senderAccountNumber: this.userDetail.accountNumber, timeStamp: new Date(), transactionMethod: 'fund account', amount: parseInt(this.amountToFund)};
      
    let transferDetail = {userId: this.userDetail._id, amount: this.amountToFund, transactionDetail}

    if(params.status == 'success'){
      this._transactionService.fundAccount(transferDetail).subscribe((res:any)=>{
        this.response = res.message
        if(res.status){
            this.responseErr = false
          }
          else{
            this.responseErr = true
          }
      })
    }
    
  }
  addInfoToast(){
 this._toastService.success(this.response)
  }

  copied(params:any){
    this.copiedStatus =  params.isSuccess?  true:  false
    params.isSuccess?  this._toastService.success('Copied'):  this._toastService.error('Not copied')
  }

  handleAmt(event:any){
    this.amountToFund = event.target.value
    if(event.target.value == ""){
      this.amtIsEmpty = true
  }
  else{
    if(event.target.value < 50){
      this.amtIsEmpty = true
    }
    else{
      this.amtIsEmpty = false
    }
  }
  }

}

