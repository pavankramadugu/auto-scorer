import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import Web3 from "web3";
import {Papa} from 'ngx-papaparse';
import {GoogleSheetsService} from "../../services/google-sheets.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-lab1',
  templateUrl: './lab1.component.html',
  styleUrls: ['./lab1.component.css']
})
export class Lab1Component {

  private web3: Web3;
  results: any[] = [];
  displayDialog: boolean = false;
  showSpinner: boolean = false;

  constructor(private papa: Papa,
              private sheetsService: GoogleSheetsService,
              private messageService: MessageService) {
    this.web3 = new Web3('https://rpc-mumbai.maticvigil.com');
  }

  async fetchContractData(contractAddress: string): Promise<any[]> {
    const abi: any = [
      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "message",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ];

    const contract = new this.web3.eth.Contract(abi, contractAddress);
    let result: any[] = [];

    try {
      const name = await contract.methods.name().call();
      const symbol = await contract.methods.symbol().call();
      const customMsg = await contract.methods.message().call();

      result = [name, symbol, customMsg];
    } catch (error) {
      console.error('An error occurred:', error);
    }

    return result;
  }

  labForm = new FormGroup({
    asuId: new FormControl('', Validators.required),
    contractAddress: new FormControl('', Validators.required)
  });

  get asuId() {
    return this.labForm.get('asuId');
  }

  get contractAddress() {
    return this.labForm.get('contractAddress');
  }

  onSubmit() {
    if (this.labForm.valid) {
      this.showSpinner = true;
      const contractAddr = this.contractAddress?.value;
      const submittedAsuId = this.asuId?.value;

      if (contractAddr) {
        this.fetchContractData(contractAddr).then(blockchainData => {
          this.papa.parse('../../../assets/data.csv', {
            download: true,
            header: true,
            complete: (result) => {
              const record = result.data.find((row: any) => row['Login ID'] == submittedAsuId); // Ensure type compatibility using ==

              if (record) {
                let score = 0;
                let matchInfo = {
                  nameMatch: false,
                  symbolMatch: false,
                  messageMatch: false
                };

                if (record['Token Name'] === blockchainData[0]) {
                  score += 25;
                  matchInfo.nameMatch = true;
                }

                if (record['Token Symbol'] === blockchainData[1]) {
                  score += 25;
                  matchInfo.symbolMatch = true;
                }

                if (record.Message === blockchainData[2]) {
                  score += 50;
                  matchInfo.messageMatch = true;
                }

                this.results.push({
                  asuId: record['Login ID'],
                  score,
                  matchInfo
                });
                this.sheetsService.saveToSheet({
                  asuId: record['Login ID'],
                  score,
                  matchInfo
                }).subscribe(
                  response => {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: 'Data saved successfully!'
                    }); // Success toast
                  },
                  error => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to save data.'}); // Error toast
                  }
                );

                this.showSpinner = false;
                this.displayDialog = true;

              } else {
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'ASURITE USER ID not found.'}); // Error toast for contract data fetch failure
              }
            }
          });
        }).catch(error => {
          this.messageService.add({severity: 'error', summary: 'Failed to fetch contract data.', detail: error});
        });
      }
    }
  }
}
