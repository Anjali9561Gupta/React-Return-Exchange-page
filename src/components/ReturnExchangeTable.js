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
} from '@mui/material';
import { getReturnExchangeData } from '../api'; 

const ReturnExchangeTable = () => {
  const [data, setData] = useState([]);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const response = await getReturnExchangeData(); // API call to fetch data
      const updatedData = response.data.map((row) => ({
        ...row,
        adminStatus: row.adminStatus || 'Pending', 
        returnDate: new Date(row.dateTime).toLocaleDateString(), // Convert dateTime to returnDate
      }));
      setData(updatedData);
    };

    fetchData();
  }, []);

  // Handle admin status change
  const handleAdminStatusChange = (id, newStatus) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, adminStatus: newStatus } : row
      )
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.No</TableCell>
            <TableCell>Ordered ID</TableCell>
            <TableCell>Returned ID</TableCell>
            <TableCell>Return Date</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Return Required</TableCell>
            <TableCell>Admin Status</TableCell>
            <TableCell>Proof</TableCell>
            <TableCell>More Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.orderedId}</TableCell>
              <TableCell>{row.returnedId}</TableCell>
              {/* Display the formatted returnDate */}
              <TableCell>{row.returnDate}</TableCell>
              <TableCell>{row.reason}</TableCell>
              <TableCell>{row.returnRequired}</TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <Select
                    value={row.adminStatus}
                    onChange={(e) => handleAdminStatusChange(row.id, e.target.value)}
                    displayEmpty
                    sx={{
                      '& .MuiSelect-icon': {
                        color: row.adminStatus === 'Pending' ? 'red' : 'orange', // Icon color based on adminStatus
                      },
                    }}
                  >
                    <MenuItem
                      value="Pending"
                      sx={{
                        color: 'red', // Red text for Pending
                        '&:hover': { backgroundColor: 'lightcoral' },
                      }}
                    >
                      Pending
                    </MenuItem>
                    <MenuItem
                      value="Accepted"
                      sx={{
                        color: 'orange', // Orange text for Accepted
                        '&:hover': { backgroundColor: 'lightyellow' },
                      }}
                    >
                      Accepted
                    </MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>{row.proof}</TableCell>
              <TableCell
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '200px', 
                }}
              >
                {row.moreDetails || 'N/A'} {/* Ensure there is a fallback value */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReturnExchangeTable;
