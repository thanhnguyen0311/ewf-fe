import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {FC, useEffect, useRef, useState} from "react";
import {AgGridReact} from 'ag-grid-react';
import {ColDef} from 'ag-grid-community';
import Loader from "../../UiElements/Loader/Loader";

import "./style.css";
import {mapComponentPropToRequest} from "../../../utils/mapFunctions";
import {getComponents, updateComponent} from "../../../api/apiService";
import ImageModal from "../../UiElements/Modals";

export const data_sort = "BCMCWNA,BOC-WHI-W,NFC-MAH-W,ABP1T61,NFC-MAH-C,VAC-OAK-C,DLT-WHI-P,ENP1T69,WEC-BLK-W,DLT-BLK-P,GRC-WHI-W,VAC-ESP-C,ALP2B05,DLT-WHI-T,NFC-OAK-C,ABP1T06,KEC-BLK-LC,VAC-OAK-W,AVC-BLK-W,NFC-BLK-W,DLC-OAK-W,ANT-LWH-P,DLT-BLK-T,DRP2T07,GRC-BLK-W,DAC-BCH-W,ANC-BLK-W,NFC-LWH-W,DLT-MAH-T,PVC-BLK-W,CLC-BLK-W,GRC-OAK-W,BOC-CAP-W,CLC-LWH-W,NFT-MAH-T,WEC-WHI-W,ANT-LWH-T,DLT-MAH-P,DLT-OAK-T,FRP1T02,DRP1T24,GRC-MAH-W,BCNC5NA,DLT-SBR-T,VAC-ESP-W,BBSCWNA,BOC-BLK-W,DLT-OAK-P,AVC-SBR-C,ABP4T04,ABP3T18,PVC-WHI-W,KEC-BLK-W,WEC-BCH-W,FRP3T05,CLC-BMK-W,BOC-WHI-LC,NAC-SBR-C,ANT-BLK-P,BRP3T04,NFC-OAK-W,CAC-CAP-W,PVC-SBR-C,BBTB0NA,VNS-WHI-W,DAC-LWH-W,NIC-BLK-W,KEC-LWH-W,BAP5T21,KEC-WHI-W,ANC-WHI-W,AVC-SBR-LC,NFT-OAK-T,HLT-LWH-T,CLC-MAH-W,LGT-BLK-T,DRP5T03,ANC-OAK-W,AVC-WHI-W,LGT-BLK-L,NFC-BCH-W,ANT-BLK-T,HLT-LWH-P,AVC-OAK-C,CAC-CAP-C,ANC-BLK-LC,BCMCANA,QUS-WHI-W,DUT-BLK-T,ENP2T06,QUS-BLK-W,CLC-LWH-C,BRP2T02,AVC-OAK-W,VNS-MAH-LC,BUS-MAH-LC,CAC-MAH-LC,BBSCANA,BUS-BLK-LC,FAS-CAP-W,ANC-BLK-C,ENP3T66,CHS-BLK-W,AVC-SBR-W,DLT-AWA-T,BAP3T18,POC-SBR-C,HLUC163S,ENP3T18,CLC-BLK-C,POC-SBR-W,ANC-CAP-W,AVC-BLK-LC,ANT-OAK-T,GRS-WHI-W,DAC-LWH-C,CAC-CAP-LC,DAC-BMK-W,DUB-BLK-W,MLC-MAH-C,BUS-BLK-W,KET-BLK-T,KET-BLK-P,CAC-MAH-W,DOC-LWH-W,ANT-CAP-T,ANT-CAP-P,ANT-OAK-P,DAC-MAH-C,ABP3T72,BUT-BLK-T,AVC-LWH-W,MLC-MAH-LC,ANC-CAP-C,HVLC163S,FAS-CAP-LC,HLT-MAH-T,DAC-BLK-C,SIP1T21,ANT-BBB-T,ANT-MAH-T,NAC-SBR-W,ANC-OAK-C,VNS-MAH-W,ANT-MAH-P,DOC-BCH-W,DLT-ESP-T,DLT-ESP-P,AVT-LWH-T,AVT-BLK-P,OXT-MAH-T,AVT-BLK-T,MLC-SBR-C,AVT-LWH-P,GAP1T24,DUC-MAH-W,ANC-OAK-LC,LPH-03-Q,ABP2T02,OXT-LWH-T,LPS-03-Q,ENP1T20,DUC-BLK-W,VAC-LWH-C,SHT-BLK-T,HLT-MAH-P,SHT-BLK-P,ABP6T24,ANT-ABK-T,VAC-BLK-W,MLC-MAH-W,ANT-AWA-T,DLT-ABK-T,BOC-MAH-W,ABP4T55,BCMTRNA,AVT-OAK-T,DLT-SBR-P,AVT-OAK-P,LYC-CAP-LC,GRS-OAK-W,BAP1T05,DLT-ABK-P,BRP4T18,DOC-MAH-W,GULC102A,DOT-LWH-T,CEP2T15,ANT-ABK-P,BOC-CAP-LC,WET-BLK-T,DHTBBLK,DHFBBLK,DHQBBLK,DHKBBLK,ATQCBLK,ATQCWHI,GEQCBLK,GEQCWHI,WET-BLK-L,NIC-BLK-C,BRP1T17,ANT-ANA-T,LYC-ESP-W,LPN-03,WEC-BMK-W,CHS-MAH-C,ANT-WHI-P,DOC-WHI-W,DLT-BMK-P,DLT-ANA-T,PFT-CAP-T,KET-WHI-T,DAC-MAH-W,PVT-BLK-T,PFC-CAP-W,LAP2T06,KET-WHI-P,HLT-BLK-P,CAB-MAH-W,MLC-SBR-W,LYC-CAP-W,ANT-WHI-T,PVT-BLK-P,PVC-SBR-W,CHS-MAH-W,SIP8T04,BJPCLNE,BMRCFNE,BMNTDNA,BSETQNA,BAETFNA,BHNU1NA,BSLCDNA,BBI3CNA,BFMCWNA,BHDCANA,NWTBBLK,JAT-WHI-T,JAT-WHI-P,IPC-LWH-W,ABP1T73,ENP2T57,QUS-OAK-W,BBSTXNA,KET-ESP-P,CEP1T21,KET-ESP-T,DOT-MAH-T,QUS-MAH-W,NIC-BLK-LC,AVT-SBR-P,PBS-OAK-C,PBS-OAK-W,IPC-BMK-W,AVT-SBR-T,HLT-BCH-T,VAT-LWH-T,VAT-LWH-P,SIP3T35,OXT-OAK-T,CAT-LWH-S,VNS-WHI-C,LGT-LWH-T,HET-CAP-T,SIP2T15,GAP2T35,CAB-LWH-W,PFT-CAP-L,LGT-LWH-L,NIT-BLK-T,EDT-WHI-T,VNS-MAH-C,NFT-LWH-T,DUC-BLK-LC,EDT-WHI-P,IPC-MAH-W,CAB-CAP-W,BUTLBLK,ANC-CAP-LC,VNT-MAH-T,CAT-CAP-S,VAT-OAK-T,DAT0BLK,VAT-OAK-P,VAT-ESP-T,POT-SBR-T,HLT-CAP-T,VAT-ESP-P,LPD-03,ADC-LWH-LC,QUC-WHI-W,POT-SBR-P,POC-OAK-W,CAT-OAK-S,CAB-OAK-W,BOC-OAK-W,NFT-BLK-T,LPM-03,ABPNT35,PVC-WHI-C,LGC-BCH-W,HLT-CAP-P,BOT-WHI-T,HLUC153V,DRP3T01,BUTLWHI,EDT-MAH-T,NIC-WHI-W,DUC-MAH-LC,CFS-OAK-W,BOC-CAP-C,NAT-SBR-T,LAP7T16,NAT-SBR-P,FAT-CAP-L,CHS-BLK-LC,BAP4T02,LPC-03,FAT-CAP-T,LAP3T04,CHS-BLK-C,ABP8T05,VNT-WHI-T,IPC-MAH-C,DLT-AWA-P,VAC-LWH-W,DUT-MAH-T,EDT-MAH-P,BDKCWNA,B77,WET-WHI-T,YAT-MAH-H,WET-WHI-L,CEP3T10,ABP7T47,JAT-MAH-T,JAT-MAH-P,HANE05,QUC-BLK-W,PFC-CAP-C,JAT-BLK-P,CAT-MAH-S,JAT-BLK-T,BUT-MAH-T,BOT-CAP-T,B76,POC-OAK-C,PBS-BRN-C,HANE15,CLC-MAH-C,VAC-BLK-C,LYT-ESP-T,FAS-BLK-W,BUS-MAH-W,ABP0T15,LYT-CAP-T,LAP1T47,IPC-LWH-C,HVLC153V,XB77-2,XB77-1,SHT-WHI-T,PVT-SBR-T,PVT-SBR-P,KES-BLK-W,SHT-WHI-P,HANE11,ABP2T64,PBT-OAK-T,OSLC102A,MLT-MAH-T,ELP8T05,ELP2T07,XB06-2,XB06-1,PBT-BLK-T,ELP6T35,LYB-CAP-W,DRP4T16,B26,LGT-BCH-T,QUT-BLK-T,NDT-OAK-T,LAP0T15,FRP2T18,BAP2T01,B27,HMATG63S,PFC-BLK-W,NIB-BLK-W,LGT-BCH-L,LAP8T05,ENP2T78,WET-BCH-T,T27,PST-MAH-T,NDT-LWH-T,AVT-WHI-T,XB07-2,XB07-1,SIP6T48,EDT-OAK-T,DUB-MAH-W,AVT-WHI-P,VT67-2,VT67-1,SP-7HH04,CFS-OAK-C,PFT-SBR-T,MLT-SBR-T,GAP7T40,ELP3T16,BDITFNA,T26,KES-WHI-W,ENP4T51,EDT-BLK-T,DLT-ANA-P,XB66-2,XB66-1,VB06-2,VB06-1,T77,T76,PFT-BLK-T,PFC-BLK-C,PFB-BLK-W,LGC-LWH-W,DOT-WHI-T,XT06-2,XT06-1,HLT-BMK-T,YAT-WHI-H,XT07-2,T97,PFT-BLK-L,NDT-MAH-T,JULC103A,EDT-BLK-P,BKLC102A,YAT-OAK-H,XT07-1,XB67-2,XB67-1,WET-BCH-L,VT66-2,VT66-1,PFT-SBR-L,NFT-WHI-T,LYB-ESP-W,NIT-WHI-T,HLT-BMK-P,GAP3T32,DVS024-303,DAT0WHI,XT77-2,XT77-1,VT76-2,VT76-1,VB76-2,ANT-AWA-P,YAT-BLK-H,XB76-2,XB76-1,VB76-1,VB07-2,VB07-1,T96,PST-SBR-T,FLP1T21,BFS024-303,B96,XT67-2,XT67-1,VT07-2,VT07-1,VB66-2,VB66-1,LAT-07-T,AMS024-202,XT76-2,XT76-1,VB77-2,VB77-1,VB67-2,VB67-1,QUT-WHI-T,LAT-07-P,DUT-MAH-H,XT66-2,XT66-1,VT77-2,VT77-1,PVT-WHI-T,HLUTG63S,B97,JULTW02,HANE14,DVS024-112,VEP6T50,TRT-BLK-T,TRT-BLK-P,PVT-WHI-P,LYC-ESP-LC,JULC102A,CEP4T07,DST-LWH-P,PFB-CAP-W,JAT-OAK-T,JAT-OAK-P,NAT-WHI-T,FLP7T16,DOT-BCH-T,NAT-WHI-P,GULC103A,DVS024-416,CHT-MAH-T,CHT-MAH-L,NIB-WHI-W,NDT-BCH-T,MZT-WHI-T,EDT-OAK-P,CHT-BLK-T,ABP3B18,SUT-LWH-T,LM7-0N-T,LAT-08-T,HLT-ABK-T,HBT-ABK-P,GAP6T50,FRP4T20,DVS024-202,ABP2B02,LAT-08-P,FLP6T24,CHT-BLK-L,ANT-ANA-P,CN6-07-T,BRP3T18,BDETRNA,MZT-MAH-T,HVLTG63S,GONE11,AST-ABK-P,SIP7T37,GAP8T03,ENP4T07,ELP7T18,CFT-OAK-T,AMS024-112,HANE12,AST-LWH-P,ODR-03,ODE-03,DTL3C01B,BKLC103A,BFS024-202,WET-BMK-T,HBT-LWH-P,FAT-BLK-T,FAT-BLK-L,DST-ANA-P,BFS030-112,AST-MAH-P,FOP1T01,ELP1T21,CN6-0N-T,SP-5OH06,PBT-BRN-T,OSLTG02,HLT-ANA-T,HBT-ANA-P,GONE12,DST-ABK-P,BFS030-202,WET-BMK-L,NDT-WHI-T,MZT-LWH-T,HANE13,FLP8T04,CAT-OAK-H,BEP3B06,AST-OAK-P,ALP2B78,MZT-OAK-T,MZT-BCH-T,HLT-AWA-T,HBT-MAH-P,HBT-AWA-P,AST-ANA-P,AMS030-202,HEC-BRN-W,GULTG03,GONE05,FOP3T46,FOP2T44,FLP2T01,EWS-OAK-C,DVS030-303,DST-MAH-P,DLC-MAH-W,AMS030-303,AMS024-303,ABP1B73,SUT-BCH-T,HVLTG53V,GONE13,SUT-BMK-T,PFC-SBR-W,OXT-ANA-T,ODR-09,ODE-09,ENP2B06,ENP1B20,CEP3B10,BFS024-112,BEP1B01,AMS030-416,VER-09,VEE-09,SUT-BMK-H,OXT-AWA-T,LPO-03-Q,LM7-07-T,JULTW03,HLUTG53V,GULTG02,DST-OAK-P,BEP4B10,BCOSSNA,YAT-ANA-T,OSLTG03,ODR-05,ODE-05,LPN-04,HLC-CAP-C,GONE15,GONE14,FOP3T47,FLP3T18,ENP4B08,DVS030-202,DLC-BLK-W,CEP4B07,CEP1B16,BFS030-303,AST-AWA-P,AMS024-416,ABP2B64,YAT-AWA-T,VER-05,VEE-05,TRT-OAK-T,TRT-OAK-P,SUT-BCH-H,SP-7OH06,ODA-05,LPM-04,LPD-04,JAFTBLK-2,JAFTBLK-1,DST-AWA-P,AYR-05,AYE-05,ACL3S03A,VT06-2,VT06-1,NODSW02,VEU-09,VEU-08,002-07-P,002-0N-P,VEU-05,003-0N-P,VER-08,BF-0M-ET,BF-12-ET,VEP8T24,VEP8T04,VEP7T21,VEP7T03,VEP3T47,VEP2T15,VEP0T05,COO-21-Q,VEE-08,DE-05-ET,DE-07-ET,DE-13-ET,VEA-09,VEA-08,FET-07-T,FET-0N-T,VEA-05,TRT-WHI-T,TRT-WHI-P,TRT-MAH-T,TRT-MAH-P,SUT-OAK-T,SUT-CAP-T,SP-7OH05,SP-7OH04,SP-7OH03,SP-7OH02,SP-7OH01,SP-7HH06,SP-7HH05,SP-7HH03,SP-7HH02,SP-7HH01,SP-5OH05,SP-5OH04,SP-5OH03,SP-5OH02,SP-5OH01,SP-5HH06,SP-5HH05,SP-5HH04,SP-5HH03,SP-5HH02,SP-5HH01,CA-47EC07,CA-47EC08,CA-47EC09,CA-47EC10,CA-47EC11,CA-47EC12,CA-47EC13,CA-47EC14,SAS-02-Q,SAO-02-Q,SAN-02,SAM-02,SAH-02-Q,SAD-02,SAC-02,PFC-SBR-C,PBS-BRN-W,PAS-05-Q,PAO-05-Q,PAN-05,PAM-05,PAH-05-Q,PAD-05,PAC-05,OSLC103A,ODU-09,ODU-05,ODU-03,ODA-09,ODA-03,NIC-WHI-C,NFC-AWA-W,NFC-ANA-W,LYT0WHI,LYT0BLK,LPS-04-Q,LPO-04-Q,LPH-04-Q,LPC-04,LGT-BMK-T,LGT-BMK-L,LGS-CAP-W,LGS-CAP-C,LGC-BMK-W,KES-OAK-W,KES-MAH-W,JAFTWHI-2,JAFTWHI-1,HLT-CHR-T,HLT-CHR-P,HLC-CAP-W,HLC-CAP-LC,HET-BRN-T,FRP4B20,FRP2B19,FOP8T18,FOP7T49,FOP6T24,FAS-CAP-C,EWS-MAH-W,ENP3B18,DVS030-416,DVS030-112,DTL3C03A,DST-BLK-P,DST-ABC-P,DLT-ABC-T,DES-20-Q,DES-20-K,DEN-20,DEM-20,DEH-20-Q,DEH-20-K,DED-20,20-Dec,CRS130-D03,CRS130-C32,CRS130-B35,CRS124-D03,CRS124-C32,CRS124-B35,CNS130-416,CNS130-202,CNS124-416,CNS124-202,BYS130-B35,BYS130-A03,BYS124-B35,BYS124-A03,BRP4B19,BLS130-303,BLS130-112,BLS124-303,BLS124-112,BFS030-416,BFS024-416,BEP2B20,AYU-07,AYU-06,AYU-05,AYR-07,AYR-06,AYE-07,AYE-06,AYA-07,AYA-06,AYA-05,AST-BLK-P,AST-ABC-P,ANT-ABC-T,AMS030-112,ALP4B51,ALP4B03,ALP3B17,ALP2B75,ALP2B57,ACL3S02A,ABP4B55,VL-14-ET,VL-13-ET,VL-12-ET,VL-0C-ET,VL-07-ET,VL-06-ET,NLF-19-Q,NLF-19-K,NLF-19-F,NLF-14-Q,NLF-14-K,NLF-14-F,NES-11-Q,NES-11-K,NEN-11,NEM-11,NEH-11-Q,NEH-11-K,NED-11,NEC-11,MZCNT04,MZCNT32,MZC7T48,MZC7T16,MZC6T50,MZC6T06,MZC0T15,MZC0T01,MZCNT02,KDF-18-Q,KDF-18-K,KDF-18-F,KDF-16-Q,KDF-16-K,KDF-16-F,IRT-0N-T,IRT-07-T,HI-14-ET,HI-13-ET,HI-12-ET,HI-0M-ET,HI-08-ET,HI-07-ET,GBF-28-Q,GBF-28-K,GBF-28-F,GBF-25-Q,GBF-25-K,GBF-25-F,GA-13-ET,GA-12-ET,GA-0C-ET,GA-08-ET,GA-07-ET,GA-06-ET,FNF-11-Q,FNF-11-K,FNF-11-F,FNF-08-Q,FNF-08-K,FNF-08-F,DE-15-ET,DE-14-ET,DE-12-ET,COS-21-Q,COS-21-K,COO-21-K,CON-21,COM-21,COH-21-Q,COH-21-K,COD-21,COC-21,BF-14-ET,BF-13-ET,BF-08-ET,BF-07-ET,003-07-P,001 Order Linh Tinh,PADSB01,NWCTB01,MDCTW02,HRCTW01,DCETB01,WITBB03,WIQBB03,ERTBW02,ERFBW02,GDTBSIL,GDFBSIL,HYT0B01-1,HYT0B01-2,TYFBBLK,TYQBBLK,IGTBB04,IGFBB04,KHQBWHI,KHFBWHI,FTQBBLK,DNP-22-K,DNP-23-K,DNP-22-Q,DNP-23-Q,DNP-22-F,DNP-23-F,NVP-22-K,NVP-23-K,NVP-22-Q,NVP-23-Q,NVP-22-F,NVP-23-F,001-07-P,001-0N-P,GAT-07-T,GAT-0N-T,VT76,VT66,VT06,VT77,VT67,VT07,VB76,VB66,VB06,VB77,VB67,VB07,XT76,XT66,XT06,XT77,XT67,XT07,XB76,XB66,XB06,XB77,XB67,XB07,KATY4-BCH-W,KATY4-WBL-W,KATY4-WBW-W,ASP1T09,ASP1T12,ASP2T41,ASP2T42,ASP2T43,ASP3T26,ASP4T28,ASP8T27,ASP8T08,ASP7T25,DSP-12,DSP-13,DSP-29,DSP-22,DSP-24,DSP-32,DSP-23,DSP-26,DSP-27,DSL-2,DSL-3,DSL-6,DSL-7,DSL-8,DSL-F,DSL-H,XTT-AWA-T,XTT-AWH-T,XTT-ABK-T,XTT-AWA-L,XTT-AWH-L,XTT-ABK-L,XTB-AWA-W,XTB-AWH-W,XTB-ABK-W,XTC-AWA-T,XTC-AWH-T,XTC-ABK-T,X2P8T28,X2PWT27,X2P6T30,X1P8T04,X1PWT01,KFT-AWA-P,KFT-SBB-P,IR5-11-T,IRT-11-T,X1P6T24,TYC-AWA-28,TYC-SBB-33,AMC-AWA-34,AMC-SBB-28,MAC-AWA-36,MAC-SBB-34,CYC-AWA-28,CYC-SBB-33,LVT-AWA-T,LVT-SBB-T,NCT-AWA-T,NCT-SBB-T,EFT-AWA-P,EFT-SBB-P,FE5-0N-T,FE5-11-T,FET-11-T,IR5-0N-T,005-0N-P,005-11-P,006-0N-P,006-11-P,007-0N-P,007-11-P,008-0N-P,008-11-P,002-11-P,003-11-P,542-0N-P,542-11-P,543-0N-P,543-11-P,105-LWH-P,105-OAK-P,105-SBR-P,105-BLK-P,105-ESP-P,ECT-LWH-T,ECT-OAK-T,ECT-SBR-T,ECT-BCH-T,ECT-ESP-T,CBT-MAH-P,CBT-LWH-P,CBT-BLK-P,HBT-BLK-P,42T-307-T,48T-312-T,42T-208-T,48T-204-T,42T-103-T,48T-109-T"

export type ComponentProp = {
    id: number;
    sku: string;
    manufacturer: string;
    finish: string;
    name: string;
    discontinue: boolean;
    category: string;
    inventory: number;
    images: {
        dim: string[];
        img: string[];
    };
    salesReport: number;
    onPO: number;
    inStock: number;
    inTransit: number;
    rating: number;
    toShip: number;
    stockVN: number;
    inProduction: number;
    stockStatus: string;
    toBeShipped: number;
};
export type ComponentRequestProp = {
    id: number;
    name: string;
    inventory: number;
    discontinue: boolean;
    toShip: number;
    onPO: number;
    inTransit: number;
    stockVN: number;
    inProduction: number
}


const CInventory: FC = () => {
    const [components, setComponents] = useState<ComponentProp[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const gridRef = useRef<AgGridReact<any>>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomImage, setZoomImage] = useState<string | null>(null);



    const handleCheckboxChange = async (params: any) => {
        const componentProp = params.data;
        componentProp.discontinue = !componentProp.discontinue;
        const componentInventoryRequestDto = mapComponentPropToRequest(componentProp)
        const updatedComponent: ComponentProp = await updateComponent(componentInventoryRequestDto);
        params.node.setData(updatedComponent);
    };

    const handleCellValueChanged = async (event: any) => {
        const componentProp = event.data;
        const componentInventoryRequestDto = mapComponentPropToRequest(componentProp)
        const updatedComponent: ComponentProp = await updateComponent(componentInventoryRequestDto);
        event.node.setData(updatedComponent);
    };

    const toggleZoom = (imageUrl?: string) => {
        if (imageUrl) setZoomImage(imageUrl);
        setIsZoomed(!isZoomed);
    };


    const columnDefs: ColDef<ComponentProp>[] = [
        {
            headerName: "", field: "manufacturer", sortable: true, width: 60,
            cellStyle: (params: any) => {
                const styleMap: Record<string, { color: string; backgroundColor: string; fontWeight: string }> = {
                    TT: {color: "#d01edc", backgroundColor: "#B7E1CD", fontWeight: "bold"},
                    TB: {color: "white", backgroundColor: "#E06666", fontWeight: "bold"},
                    CN: {color: "#d01edc", backgroundColor: "white", fontWeight: "bold"},
                    HD: {color: "#d01edc", backgroundColor: "#FFD966", fontWeight: "bold"},
                    LT: {color: "yellow", backgroundColor: "#D5A6BD", fontWeight: "bold"},
                    HU: {color: "#d01edc", backgroundColor: "white", fontWeight: "bold"},
                    AM: {color: "#d01edc", backgroundColor: "#B6D7A8", fontWeight: "bold"},
                    HG: {color: "red", backgroundColor: "#C9DAF8", fontWeight: "bold"},
                    Default: {color: "#d01edc", backgroundColor: "white", fontWeight: "bold"}, // Default style
                };
                const style = styleMap[params.value] || styleMap["Default"];

                return {
                    ...style,
                    textAlign: "center",
                };
            },
        },

        {
            headerName: "120days",
            field: "salesReport",
            sortable: true,
            filter: false,
            width: 90,
            cellStyle: {textAlign: "center", color: "#d01edc", fontWeight: "bold"}
        },
        {
            headerName: "SKU",
            field: "sku",
            sortable: true,
            width: 130,
            filter: "agTextColumnFilter",
            cellRenderer: (params: any) => {
                return (
                    <span className={"cursor-pointer"} onClick={() => toggleZoom(params.data.images.img[0])}>
                        {params.value}
                    </span>
                );
            },
            cellStyle: {fontWeight: "600"}
        },
        {
            headerName: "CAT",
            field: "category",
            width: 75,
            filter: false,
            cellStyle: {textAlign: "center", fontWeight: "500"}
        },
        {
            headerName: "TX",
            field: "inventory",
            width: 70,
            sortable: true,
            editable: true,
            filter: false,
            cellStyle: {textAlign: "center", fontWeight: "500"}
        },
        {
            headerName: "On PO",
            field: "onPO",
            width: 75,
            filter: false,
            editable: true,
            cellStyle: {textAlign: "center", fontWeight: "500"}
        },
        {
            headerName: "In Stock",
            field: "inStock",
            width: 80,
            filter: false,
            cellStyle: (params: any) => {
                let backgroundColor = "#8ebd79";

                if (params.value < 30) {
                    backgroundColor = "red";
                }

                return {
                    backgroundColor: params.data.discontinue ? "#b4b7ba" : backgroundColor,
                    fontSize: "15px",
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                };
            },
        },
        {
            headerName: "G+H+I",
            field: "rating",
            width: 80,
            filter: false,
            cellStyle: (params: any) => ({
                textAlign: "center",
                backgroundColor: params.data.discontinue ? "#b4b7ba" :"#D9EAD3",
                fontWeight: "bold",
                color: 'blue',
                fontSize: '15px'
            })
        },
        {
            headerName: "In transit",
            field: "inTransit",
            width: 90,
            filter: false,
            editable: true,
            cellStyle: {textAlign: "center", color: "red", fontWeight: "500"}
        },
        {
            headerName: "To Ship",
            field: "toShip",
            width: 80,
            editable: true,
            filter: false,
            cellStyle: {textAlign: "center", color: "red", fontWeight: "500"}
        },
        {
            headerName: "VN Stock",
            field: "stockVN",
            width: 91,
            filter: false,
            editable: true,
            cellStyle: {textAlign: "center", fontWeight: "500"}
        },
        {
            headerName: "In Production",
            field: "inProduction",
            width: 110,
            filter: false,
            editable: true,
            cellStyle: (params: any) => ({
                textAlign: "center",
                fontWeight: "600",
                fontSize: "16px",
                backgroundColor: params.data.discontinue ? "#b4b7ba" :"#7CFFB6"
            })
        },
        {
            headerName: "Stock Status",
            field: "stockStatus",
            width: 130,
            filter: true,
            sortable: true,
            cellStyle: (params: any) => {
                const styleMap: Record<string, { color: string; backgroundColor: string }> = {
                    "A-Đưa Vào SX": {color: "white", backgroundColor: params.data.discontinue ? "#b4b7ba" : "#FF00FF"},
                    "L-6 Tháng": {color: "black", backgroundColor: params.data.discontinue ? "#b4b7ba" : "#FCE5CD"},
                    "K-4 Tháng": {color: "black", backgroundColor: params.data.discontinue ? "#b4b7ba" : "#F9CB9C"},
                    "I-3 tháng": {color: "black", backgroundColor: params.data.discontinue ? "#b4b7ba" : "#F6B26B"},
                    "H-2.5 Tháng": {color: "black", backgroundColor: params.data.discontinue ? "#b4b7ba" : "#EA9999"},
                    "G-2 Tháng": {color: "white", backgroundColor: params.data.discontinue ? "#b4b7ba" : "#E06666"},
                    "E-45 Ngày": {color: "white", backgroundColor: params.data.discontinue ? "#b4b7ba" : "#CC0000"},
                    "D-30 Ngày": {color: "white", backgroundColor: params.data.discontinue ? "#b4b7ba" : "#990000"},
                    "C-15 Ngày": {color: "white", backgroundColor: params.data.discontinue ? "#b4b7ba" : "#660000"},
                    "B-Het Hàng": {color: "white", backgroundColor: params.data.discontinue ? "#b4b7ba" : "#FF062A"},
                    Default: {color: "black", backgroundColor: params.data.discontinue ? "#b4b7ba" : "white"},
                };
                const style = styleMap[params.value] || styleMap["Default"];



                return {
                    ...style,
                    textAlign: "center",
                    fontWeight: "600",
                };
            },
        },
        {
            headerName: "To be shipped",
            field: "toBeShipped",
            width: 110,
            filter: false,
            editable: true,
            cellStyle: (params: any) => ({
                textAlign: "center",
                fontWeight: "700",
                backgroundColor: params.data.toBeShipped.includes("Dư") ? "#ffff00" :"#D0E0E3",
                color : params.data.discontinue ? "#D0E0E3" : "#FF2C00"
            })
        },
        {
            headerName: "Name",
            filter: "agTextColumnFilter",
            field: "name",
        },
        {
            headerName: "DIS",
            field: "discontinue",
            cellRenderer: (params: any) => {
                return (
                    <input
                        type="checkbox"
                        checked={params.value}
                        onChange={() => handleCheckboxChange(params)}

                    />
                );
            },
            cellStyle: {textAlign: "center"},
            filter: true,
            width: 80
        },
    ];

    const defaultColDef = {
        resizable: true,
        floatingFilter: true,
        cellStyle: (params: any) => {
            return {
                fontSize: "15px",
                fontWeight: "500",
                textDecoration: params.data.discontinue ? "line-through" : "none",
            };
        }
    };


    const fetchComponents = async () => {
        try {
            setLoading(true);
            const sortedComponents = await getComponents();
            setComponents(sortedComponents);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch components. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchComponents();
    }, [forceUpdate]);

    const onExportCSV = () => {
        gridRef.current?.api.exportDataAsCsv(); // Trigger the CSV export
    };


    return (
        <>
            <PageMeta
                title="Component Inventory | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="Component Inventory"/>


            <div className="flex justify-end mb-4">
                    <button className="bg-brand-300 mx-2 hover:bg-brand-500 text-white font-semibold py-1.5 px-3 rounded-xl flex items-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300" onClick={onExportCSV}>Export to CSV</button>

                    <button
                        onClick={() => setForceUpdate((prev) => prev + 1)}
                        className="bg-brand-300 mx-2 hover:bg-brand-500 text-white font-semibold py-1.5 px-3 rounded-xl flex items-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        ↻ Refresh
                    </button>
            </div>

            <Loader isLoading={loading}>
                <div
                    className="ag-theme-quartz shadow border rounded-xl border-gray-300"
                    style={{height: "800px", width: "100%", marginTop: "20px"}}
                >
                    {!loading ? (<AgGridReact
                        ref={gridRef}
                        rowData={components} // Pass fetched data to the grid
                        columnDefs={columnDefs} // Define columns
                        defaultColDef={defaultColDef}
                        getRowStyle={(params) => {
                            if (params.data?.discontinue) {
                                // Apply a dark color when "discontinue" is true
                                return {
                                    backgroundColor: "#b4b7ba", // Dark slate gray
                                };
                            }

                            return {
                                backgroundColor: params.node?.rowIndex != null && params.node.rowIndex % 2 === 0 ? "#e4f7f0" : "white",
                            };
                        }}
                        onCellValueChanged={handleCellValueChanged}
                        rowHeight={30}
                    />) : <></>}
                </div>
                {isZoomed && zoomImage && (
                    <ImageModal image={zoomImage} name="" toggleZoom={toggleZoom} />
                )}

            </Loader>

        </>
    )
}

export default CInventory;
