import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import * as XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://your-connection-string');

// Schema definition
const dataSchema = new mongoose.Schema({
  sheetName: String,
  name: String,
  amount: Number,
  date: Date,
  verified: Boolean,
});

const Data = mongoose.model('Data', dataSchema);

// Validation configuration
const sheetConfigs = {
  'Sheet1': {
    columns: ['Name', 'Amount', 'Date', 'Verified'],
    validations: {
      Name: {
        required: true,
      },
      Amount: {
        required: true,
        type: 'number',
        min: 0,
      },
      Date: {
        required: true,
        type: 'date',
        validate: (date) => {
          const now = new Date();
          return date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();
        },
        message: 'Date must be within the current month',
      },
      Verified: {
        type: 'boolean',
      },
    },
  },
};

const validateRow = (row, config, rowIndex) => {
  const errors = [];

  for (const [field, validation] of Object.entries(config.validations)) {
    const value = row[field];
    console.log('value', value);

    if (validation.required && !value) {
      errors.push(`${field} is required`);
      continue;
    }

    if (value) {
      if (validation.type === 'number' && (isNaN(value) || value < validation.min)) {
        errors.push(`${field} must be a number greater than ${validation.min}`);
      }

      if (validation.type === 'date' && validation.validate) {
        const date = new Date(value);
        console.log('date', date);
        if (isNaN(date.getTime())) {
          errors.push(`${field} must be a valid date`);
        } else if (!validation.validate(date)) {
          errors.push(validation.message);
        }
      }
    }
  }

  return errors;
};

// app.post('/api/upload', upload.single('file'), (req, res) => {
//   try {
//     const workbook = XLSX.read(req.file.buffer);
//     const sheets = [];
//     let hasErrors = false;

//     for (const sheetName of workbook.SheetNames) {
//       const worksheet = workbook.Sheets[sheetName];
//       const data = XLSX.utils.sheet_to_json(worksheet);
//       const config = sheetConfigs[sheetName];

//       if (!config) continue;

//       const sheetData = {
//         name: sheetName,
//         data: [],
//         errors: [],
//       };

//       data.forEach((row, index) => {
//         const rowErrors = validateRow(row, config, index + 2);

//         if (rowErrors.length > 0) {
//           hasErrors = true;
//           rowErrors.forEach(error => {
//             sheetData.errors.push({
//               sheet: sheetName,
//               row: index + 2,
//               message: error,
//             });
//           });
//         }
//         let parsedDate;
//         if (typeof row.Date === 'number') {
//           // Convert Excel serial number to JavaScript Date
//           parsedDate = XLSX.SSF.parse_date_code(row.Date);
//           parsedDate = new Date(parsedDate.y, parsedDate.m - 1, parsedDate.d);
//         } else {
//           parsedDate = new Date(row.Date);
//         }

//         sheetData.data.push({
//           id: crypto.randomUUID(),
//           name: row.Name,
//           amount: parseFloat(row.Amount),
//           date: new Date(row.Date),
//           verified: row.Verified === 'Yes',
//         });
//       });

//       sheets.push(sheetData);
//     }

//     res.json({ sheets, hasErrors });
//   } catch (error) {
//     res.status(500).json({ error: 'Error processing file' });
//   }
// });

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    console.log('📂 File uploaded. Processing...');

    if (!req.file) {
      console.error('🚨 No file uploaded!');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer);
    const sheets = [];
    let hasErrors = false;

    console.log(`📄 Found ${workbook.SheetNames.length} sheets.`);

    for (const sheetName of workbook.SheetNames) {
      console.log(`📑 Processing sheet: ${sheetName}`);

      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const sheetData = {
        name: sheetName,
        data: [],
        errors: [],
      };

      data.forEach((row, index) => {
        console.log(`🔹 Processing row ${index + 2}:`, row);

        let parsedDate = null;
        let rowErrors = [];

        // ✅ Check if the Date column exists
        if (!row.Date) {
          rowErrors.push("❌ Date is missing");
        } else {
          // Try direct Date parsing
          parsedDate = new Date(row.Date);

          // If parsing fails, handle Excel Serial Date format
          if (typeof row.Date === "number") {
            parsedDate = new Date((row.Date - 25569) * 86400 * 1000);
            console.log(`✅ Converted Excel Serial Date: ${parsedDate}`);
          }

          // If still invalid, try parsing "YYYY-MM-DD" manually
          if (isNaN(parsedDate.getTime())) {
            console.warn(`⚠️ Invalid Date Format: ${row.Date}`);

            const parts = row.Date.split("-").map(Number);
            if (parts.length === 3 && parts.every(n => !isNaN(n))) {
              parsedDate = new Date(parts[0], parts[1] - 1, parts[2]);
              console.log(`✅ Fixed Date: ${parsedDate}`);
            } else {
              rowErrors.push(`❌ Invalid date format: ${row.Date}`);
            }
          }
        }

        if (parsedDate && rowErrors.length === 0) {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth(); // 0-indexed (0 = January, 11 = December)
          const currentYear = currentDate.getFullYear();
        
          const parsedMonth = parsedDate.getMonth();
          const parsedYear = parsedDate.getFullYear();
        
          if (parsedMonth !== currentMonth || parsedYear !== currentYear) {
            rowErrors.push("❌ Date is not within the current month");
          }
        }

        // ✅ Validate Name
        if (!row.Name || typeof row.Name !== 'string' || row.Name.trim() === '') {
          rowErrors.push('❌ Name is missing or invalid');
        }

        // ✅ Validate Amount
        let amount = parseFloat(row.Amount);
        if (isNaN(amount) || amount <= 0) {
          rowErrors.push(`❌ Invalid amount: ${row.Amount}`);
        }

        // ✅ Log row errors
        if (rowErrors.length > 0) {
          hasErrors = true;
          console.error(`❌ Errors in row ${index + 2}:`, rowErrors);
          rowErrors.forEach(error => {
            sheetData.errors.push({
              sheet: sheetName,
              row: index + 2,
              message: error,
            });
          });
        }


        // ✅ Add valid row data
        if (rowErrors.length === 0) {
          sheetData.data.push({
            id: crypto.randomUUID(),
            name: row.Name.trim(),
            amount: amount,
            date: parsedDate,
          });
          console.log(`✅ Row ${index + 2} added successfully.`);
        }
      });

      sheets.push(sheetData);
    }

    console.log(`✅ Upload completed. Errors found: ${hasErrors ? 'Yes' : 'No'}`);
    res.json({ sheets, hasErrors });
  } catch (error) {
    console.error('🚨 Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

app.post('/api/import', async (req, res) => {
  try {
    const { sheetName, data } = req.body;

    // Convert the data to match our schema
    const documents = data.map(row => ({
      sheetName,
      ...row,
    }));

    // Use insertMany for better performance with large datasets
    await Data.insertMany(documents);

    res.json({ message: 'Data imported successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error importing data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});