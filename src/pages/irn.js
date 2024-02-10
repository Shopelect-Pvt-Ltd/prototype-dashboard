import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-enterprise/styles/ag-grid.css'
import 'ag-grid-enterprise/styles/ag-theme-alpine.css';
import '../pages/css-importer'
import { useLocation } from 'react-router-dom';


const IrnTable = () => {
    const [columnDefs, setColumnDefs] = useState([]);
    const [rowData, setRowData] = useState([]);
    const location = useLocation(); // Access useLocation directly in the component body


    useEffect(() => {

    const newColumnDefs = [
            { field: '_id.$oid',enableRowGroup: true, filter:true },
            { field: 'ItemNo' ,enableRowGroup: true,filter:true },
            { field: 'SlNo' ,enableRowGroup: true, filter:true},
            { field: 'IsServc',enableRowGroup: true,filter:true  },
            { field: 'PrdDesc',enableRowGroup: true, filter:true },
            { field: 'HsnCd' ,enableRowGroup: true,filter:true },
            { field: 'Qty',enableRowGroup: true, filter:true },
            { field: 'Unit',enableRowGroup: true,filter:true  },
            { field: 'UnitPrice' ,enableRowGroup: true,filter:true },
            { field: 'TotAmt' ,enableRowGroup: true,filter:true },
            { field: 'Discount' ,enableRowGroup: true,filter:true },
            { field: 'AssAmt' ,enableRowGroup: true, filter:true},
            { field: 'GstRt' ,enableRowGroup: true,filter:true },
            { field: 'IgstAmt',enableRowGroup: true,filter:true  },
            { field: 'TotItemVal',enableRowGroup: true, filter:true },
            { field: 'Irn' ,enableRowGroup: true,filter:true },
            { field: 'AckNo.$numberLong',enableRowGroup: true, filter:true },
            { headerName: 'AckDt', field: 'AckDt',enableRowGroup: true,filter:true  },
            { field: 'Version' ,enableRowGroup: true,filter:true },
            {
                headerName: "Transaction Details",enableRowGroup: true, 
                children: [
                    { field: 'TranDtls.TaxSch' ,columnGroupShow: 'closed',enableRowGroup: true, filter:true },
                    { field: 'TranDtls.SupTyp',columnGroupShow: 'open' ,enableRowGroup: true,filter:true },
                    { field: 'TranDtls.RegRev' ,columnGroupShow: 'open',enableRowGroup: true,filter:true },
                    { field: 'TranDtls.IgstOnIntra',columnGroupShow: 'open' ,enableRowGroup: true, filter:true},
                ],
            },
            {
                headerName: "Document Details",
                children: [
                    { field: 'DocDtls.Typ',columnGroupShow: 'closed',enableRowGroup: true,filter:true  },
                    { field: 'DocDtls.No',columnGroupShow: 'open',enableRowGroup: true, filter:true },
                    { field: 'DocDtls.Dt',columnGroupShow: 'open',enableRowGroup: true, filter:true }
                ],
            },
            {
                headerName: "Seller Detials",
                children: [
                    { field: 'SellerDtls.Gstin',columnGroupShow: 'closed' ,enableRowGroup: true,filter:true },
                    { field: 'SellerDtls.LglNm',columnGroupShow: 'open',enableRowGroup: true,filter:true  },
                    { field: 'SellerDtls.TrdNm',columnGroupShow: 'open',enableRowGroup: true,filter:true  },
                    { field: 'SellerDtls.Addr1',columnGroupShow: 'open',enableRowGroup: true,filter:true  },
                    { field: 'SellerDtls.Addr2' ,columnGroupShow: 'open',enableRowGroup: true, filter:true},
                    { field: 'SellerDtls.Loc',columnGroupShow: 'open',enableRowGroup: true, filter:true },
                    { field: 'SellerDtls.Pin' ,columnGroupShow: 'open',enableRowGroup: true,filter:true },
                    { field: 'SellerDtls.Stcd' ,columnGroupShow: 'open',enableRowGroup: true,filter:true },
                    
                ],
            },
            {
                headerName: "Buyer Detials",
                children: [
                    { field: 'BuyerDtls.Gstin',columnGroupShow: 'closed',enableRowGroup: true,filter:true  },
                    { field: 'BuyerDtls.LglNm',columnGroupShow: 'open' ,enableRowGroup: true, filter:true },
                    { field: 'BuyerDtls.TrdNm' ,columnGroupShow: 'open',enableRowGroup: true, filter:true },
                    { field: 'BuyerDtls.Pos',columnGroupShow: 'open' ,enableRowGroup: true,filter:true  },
                    { field: 'BuyerDtls.Addr1',columnGroupShow: 'open',enableRowGroup: true, filter:true  },
                    { field: 'BuyerDtls.Addr2' ,columnGroupShow: 'open',enableRowGroup: true,filter:true  },
                    { field: 'BuyerDtls.Loc',columnGroupShow: 'open' ,enableRowGroup: true,filter:true  },
                    { field: 'BuyerDtls.Pin',columnGroupShow: 'open' ,enableRowGroup: true,filter:true  },
                    { field: 'BuyerDtls.Stcd' ,columnGroupShow: 'open',enableRowGroup: true,filter:true  },
                    
                ],
            },
            {
                headerName: "Value Detials",
                children: [
                    { field: 'ValDtls.AssVal',columnGroupShow: 'closed',enableRowGroup: true,filter:true  },
                    { field: 'ValDtls.CgstVal' ,columnGroupShow: 'open',enableRowGroup: true, filter:true },
                    { field: 'ValDtls.SgstVal',columnGroupShow: 'open' ,enableRowGroup: true,filter:true  },
                    { field: 'ValDtls.IgstVal' ,columnGroupShow: 'open',enableRowGroup: true,filter:true  },
                    { field: 'ValDtls.CesVal',columnGroupShow: 'open' ,enableRowGroup: true,filter:true  },
                    { field: 'ValDtls.StCesVal',columnGroupShow: 'open' ,enableRowGroup: true, filter:true },
                    { field: 'ValDtls.TotInvVal' ,columnGroupShow: 'open' ,enableRowGroup: true,filter:true },
                    
                ],
            },
            
            //... Add similar groups for DocDtls, BuyerDtls, SellerDtls, etc
        ];

        setColumnDefs(newColumnDefs);

        // Retrieve data from location state
        const fetchedData = location.state?.fetchedData || [];
        setRowData(fetchedData);
    }, []); // E
        
    
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>IRN Data</h1>
            <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    rowGroupPanelShow={'always'}
                    sideBar={{
                        // Specify your sidebar configurations
                    }}
                />
            </div>
        </div>
    );
}

export default IrnTable;