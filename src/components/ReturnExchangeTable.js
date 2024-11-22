
import React, { useState, useEffect } from 'react';  
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Button,
  Modal,
  Box,
  IconButton,
  Menu
} from '@mui/material';
import { getReturnExchangeData } from '../api';
import { Close, MoreVert, ErrorOutline } from '@mui/icons-material';

const ReturnExchangeTable = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newReason, setNewReason] = useState('');
  const [newProof, setNewProof] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // For menu control

  // Modal styling
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 24,
    p: 4,
  };

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const response = await getReturnExchangeData(); // API call to fetch data
      console.log(response.data); // Log the response to see the data structure
      const updatedData = response.data.map((row) => {
        const dateObj = new Date(row.dateTime);
        const formattedDate = dateObj.toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        const invoiceAmount = row.invoiceAmount?.value;
        let formattedAmount = '₹0.00';

        if (invoiceAmount !== undefined && invoiceAmount !== null && !isNaN(invoiceAmount)) {
          formattedAmount = new Intl.NumberFormat('hi-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(invoiceAmount);
        }

        return {
          ...row,
          adminStatus: 'Pending', // Set default to "Pending"
          returnDate: formattedDate, 
          orderReturnId: row.orderReturnId,
          acceptanceDate: row.acceptanceAndDate?.date || 'N/A',
          reason: row.reasonAndProof?.reason || 'N/A',
          proof: row.reasonAndProof?.proof || 'N/A',
          formattedInvoiceAmount: formattedAmount, 
          acceptanceStatus: row.acceptanceAndDate?.status || 'Pending',
          returnRequired: row.returnRequired || 'Pending', // Default value to 'Pending'
        };
      });
      setData(updatedData);
    };

    fetchData();
  }, []);

  const handleAcceptanceStatusChange = (id, newStatus, newDate) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.sNo === id
          ? { ...row, acceptanceStatus: newStatus, acceptanceDate: newDate }
          : row
      )
    );
  };

  const handleReturnRequiredChange = (id, newStatus) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.sNo === id ? { ...row, returnRequired: newStatus } : row
      )
    );
  };

  const getAcceptanceStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return '#4CAF50'; // Green for Accepted
      case 'Rejected':
        return '#FF5252'; // Red for Rejected
      case 'Pending':
        return '#FF8C00'; // Orange for Pending
      default:
        return 'inherit'; // Default text color
    }
  };

  const getReturnRequiredColor = (status) => {
    switch (status) {
      case 'Yes':
        return '#4CAF50'; // Green for Yes
      case 'No':
        return '#FF5252'; // Red for No
      case 'Pending':
        return '#FF8C00'; // Orange for Pending
      default:
        return 'inherit'; // Default text color
    }
  };

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setNewReason(row.reason);  // Pre-fill the Reason field
    setNewProof(null);  // Reset the Proof when the modal opens
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewReason('');  // Clear the reason input
    setNewProof(null);  // Clear the proof input
  };

  const handleSave = () => {
    if (selectedRow) {
      const updatedData = data.map((row) =>
        row.sNo === selectedRow.sNo
          ? { ...row, reason: newReason, proof: newProof ? 'Image attached' : 'No image' }
          : row
      );
      setData(updatedData);
      handleCloseModal();
    }
  };

  

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Set the clicked button as the anchor
  };

  const handleCloseMenu = () => {
    setAnchorEl(null); // Close the menu
  };

  const menuItems = [
    'Refund Status',
    'Customer Name',
    'Credit Note Customer',
    'Tracking Details',
    'Indiazona Platform Charges Debit Note',
    'Logistics Invoice'
  ];

  const handleImageChange = (event) => {
    setNewProof(event.target.files[0]); // Set the image file
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ fontSize: '0.75rem' }}>
          {/* <TableHead>
            <TableRow>
              <TableCell sx={{ padding: '6px 8px' }}>S.NO</TableCell>
              <TableCell sx={{ padding: '6px 8px', color: '#3F59A3' }}>ORDER ID/RETURN ID</TableCell>
              <TableCell sx={{ padding: '6px 8px' }}>DATE & TIME</TableCell>
              <TableCell sx={{ padding: '6px 8px' }}>INVOICE AMOUNT</TableCell>
              <TableCell sx={{ padding: '6px 8px' }}>ACCEPTANCE STATUS & DATE</TableCell>
              <TableCell sx={{ padding: '6px 8px' }}>RETURN REQUIRED</TableCell>
              <TableCell sx={{ padding: '6px 8px' }}>ADMIN STATUS</TableCell>
              <TableCell sx={{ padding: '6px 8px' }}>REASON & PROOF</TableCell>
              <TableCell sx={{ padding: '6px 8px' }}>MORE DETAILS</TableCell>
            </TableRow>
          </TableHead> */}

<TableHead>
  <TableRow sx={{ backgroundColor: '', color: '#fff' }}> {/* Change background color and text color */}
    <TableCell sx={{ padding: '12px 16px', fontSize: '1rem', fontWeight: 'bold', color: '#A1A1A1' }}>S.NO</TableCell> {/* Increased padding and font size */}
    <TableCell sx={{ padding: '12px 16px', fontSize: '1rem', fontWeight: 'bold', color: '#A1A1A1' }}>
      ORDER ID/RETURN ID
    </TableCell>
    <TableCell sx={{ padding: '12px 16px', fontSize: '1rem', fontWeight: 'bold', color: '#A1A1A1' }}>
      DATE & TIME
    </TableCell>
    <TableCell sx={{ padding: '12px 16px', fontSize: '1rem', fontWeight: 'bold', color: '#A1A1A1' }}>
      INVOICE AMOUNT
    </TableCell>
    <TableCell sx={{ padding: '12px 16px', fontSize: '1rem', fontWeight: 'bold', color: '#A1A1A1' }}>
      ACCEPTANCE STATUS & DATE
    </TableCell>
    <TableCell sx={{ padding: '12px 16px', fontSize: '1rem', fontWeight: 'bold', color: '#A1A1A1' }}>
      RETURN REQUIRED
    </TableCell>
    <TableCell sx={{ padding: '12px 16px', fontSize: '1rem', fontWeight: 'bold', color: '#A1A1A1' }}>
      ADMIN STATUS
    </TableCell>
    <TableCell sx={{ padding: '12px 16px', fontSize: '1rem', fontWeight: 'bold', color: '#A1A1A1' }}>
      REASON & PROOF
    </TableCell>
    <TableCell sx={{ padding: '12px 16px', fontSize: '1rem', fontWeight: 'bold', color: '#A1A1A1' }}>
      MORE DETAILS
    </TableCell>
  </TableRow>
</TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.sNo}>
                <TableCell sx={{ padding: '6px 8px' }}>{row.sNo}</TableCell>
                <TableCell sx={{ padding: '6px 8px', color: '#3F59A3' }}>{row.orderReturnId}</TableCell>
                <TableCell sx={{ padding: '6px 8px' }}>{row.returnDate}</TableCell>
                <TableCell sx={{ padding: '6px 8px' }}>{row.formattedInvoiceAmount}</TableCell>
                <TableCell sx={{ padding: '6px 8px' }}>
                  <FormControl fullWidth sx={{ minWidth: 80 }}>
                    <Select
                      value={row.acceptanceStatus}
                      onChange={(e) => handleAcceptanceStatusChange(row.sNo, e.target.value, '')}
                      displayEmpty
                      sx={{
                        backgroundColor: '#E0E0E0',
                        borderRadius: '4px',
                        width: 'auto',
                        height: '30px',
                        textAlign: 'center',
                        padding: '0 8px',
                        color: getAcceptanceStatusColor(row.acceptanceStatus),
                      }}
                    >
                      <MenuItem value="Pending" sx={{ backgroundColor: '#E0E0E0' }}>Pending</MenuItem>
                      <MenuItem value="Accepted" sx={{ backgroundColor: '#E0E0E0' }}>Accepted</MenuItem>
                      <MenuItem value="Rejected" sx={{ backgroundColor: '#E0E0E0' }}>Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell sx={{ padding: '6px 8px' }}>
                  <FormControl fullWidth sx={{ minWidth: 80 }}>
                    <Select
                      value={row.returnRequired}
                      onChange={(e) => handleReturnRequiredChange(row.sNo, e.target.value)}
                      displayEmpty
                      sx={{
                        backgroundColor: '#E0E0E0',
                        borderRadius: '4px',
                        width: 'auto',
                        height: '30px',
                        textAlign: 'center',
                        padding: '0 8px',
                        color: getReturnRequiredColor(row.returnRequired),
                      }}
                    >
                      <MenuItem value="Pending" sx={{ backgroundColor: '#E0E0E0' }}>Pending</MenuItem>
                      <MenuItem value="Yes" sx={{ backgroundColor: '#E0E0E0' }}>Yes</MenuItem>
                      <MenuItem value="No" sx={{ backgroundColor: '#E0E0E0' }}>No</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                {/* <TableCell sx={{ padding: '6px 8px' }}>
                  {row.adminStatus}
                </TableCell> */}
                <TableCell sx={{ padding: '6px 8px', color: row.adminStatus === 'Pending' ? '#FF8C00' : 'inherit' }}>
      {row.adminStatus}
     </TableCell>
                <TableCell sx={{ padding: '6px 8px' }}>
                  <IconButton onClick={() => handleOpenModal(row)}>
                    <ErrorOutline sx={{ color: 'red' }} />
                  </IconButton>


                  
                </TableCell>
                <TableCell sx={{ padding: '6px 8px' }}>
                  <IconButton onClick={handleMenuClick}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                  >
                    {menuItems.map((item, index) => (
                      <MenuItem key={index} onClick={handleCloseMenu}>
                        {item}
                      </MenuItem>
                    ))}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Reason and Proof */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <h2>Enter Reason & Proof</h2>
          <TextField
            label="Reason"
            multiline
            rows={4}
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: '20px' }}
          />
          <input type="file" onChange={handleImageChange} />
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <Button onClick={handleCloseModal} sx={{ marginRight: '10px' }}>
              <Close />
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ReturnExchangeTable;
