import {LPNRequestProp} from "../interfaces/LPN";

export const generateZplLpnLabel = (lpnRequest: LPNRequestProp, upc: string): string => {
    return `
        ^XA
        ^PW576          ; Set label width to 576 dots (2.84 inches)
        ^LL384          ; Set label height to 384 dots (1.96 inches)

        ; Set font size for smaller labels (30 dots)
        ^CF0,40
        ; SKU Label (Small Font)
        ^FO30,30^FDSKU:^FS
        ; SKU Value (Larger Font)
        ^CF0,50
        ^FO240,30^FD${lpnRequest.sku}^FS

        ; Quantity Label (Small Font)
        ^CF0,40
        ^FO30,100^FDQty:^FS
        ; Quantity Value (Larger Font)
        ^CF0,55
        ^FO240,100^FD${lpnRequest.quantity}^FS
        
        ; Container Number Label (Small Font)
        ^CF0,40
        ^FO30,170^FDContainer:^FS
        ; Container Number Value (Larger Font)
        ^CF0,55
        ^FO240,170^FD${lpnRequest.containerNumber}^FS

        ; Date Label (Small Font)
        ^CF0,40
        ^FO30,240^FDDate:^FS
        ; Date Value (Larger Font)
        ^CF0,55
        ^FO240,240^FD${new Date(lpnRequest.date).toLocaleDateString()}^FS
        
        ; Barcode for UPC at the bottom
        ^FO40,320^BY4,3,70      ; Set bar thickness (BY3), spacing (2), and height (60 dots)
        ^BCN,100,Y,N            ; Code 128 Barcode, 100 dots high, display value below barcode (Y)
        ^FD${upc}^FS            ; Print the UPC as the barcode

        ^XZ
    `;
};

export const generateZplSkuLabel = (upc: string, sku: string) => {
    return `
            ^XA
            ^PW575
            ^LL392
      
            
             ^FO100,90
             ^BY4,3,100             ; Narrow bar width, standard ratio, height
             ^BUN,100,Y,N            ; UPC-A, height 70, show text, no check digit text
             ^FD${upc}^FS    ; 12-digit UPC-A code
            
            ^FO120,300
            ^A0N,60,60
            ^FD${sku}^FS
            
            ^XZ
        `;
}