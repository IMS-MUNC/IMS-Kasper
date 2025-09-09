const mongoose = require('mongoose');

const posSaleSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    name: String,
    phone: String,
    email: String
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
    discount: Number,
    discountType: String,
    tax: Number,
    unit: String,
    images: [String]
  }],
  paymentDetails: {
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'UPI'],
      required: true
    },
    amountReceived: Number,
    changeReturned: Number,
    bagCharge: {
      type: Number,
      default: 0
    },
    dueAmount: {
      type: Number,
      default: 0
    }
  },
  totals: {
    subtotal: Number,
    discount: Number,
    tax: Number,
    bagCharge: Number,
    totalAmount: Number
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Cancelled', 'Due'],
    default: 'Paid'
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: false
  }
}, {
  timestamps: true
});

// Generate invoice number - DISABLED TEMPORARILY
// posSaleSchema.pre('save', async function(next) {
//   console.log('=== PRE-SAVE HOOK START ===');
//   console.log('Document isNew:', this.isNew);
//   console.log('Current invoiceNumber:', this.invoiceNumber);
//   console.log('InvoiceNumber type:', typeof this.invoiceNumber);
//   console.log('InvoiceNumber value:', this.invoiceNumber);
//   
//   // Force invoiceNumber to be undefined for new documents
//   if (this.isNew) {
//     console.log('Document is new, clearing any existing invoiceNumber');
//     this.invoiceNumber = undefined;
//   }
//   
//   // Always ensure invoiceNumber is a string and not an object
//   if (this.invoiceNumber && typeof this.invoiceNumber === 'object') {
//     console.error('InvoiceNumber is an object, clearing it:', this.invoiceNumber);
//     this.invoiceNumber = undefined;
//   }
//   
//   if (!this.invoiceNumber) {
//     try {
//       console.log('Generating invoice number...');
//       const count = await this.constructor.countDocuments();
//       this.invoiceNumber = `INV${Date.now()}${count + 1}`;
//       console.log('Generated invoice number:', this.invoiceNumber);
//       } catch (error) {
//       console.error('Error generating invoice number:', error);
//       console.error('Error details:', {
//         name: error.name,
//         message: error.message,
//         stack: error.stack
//       });
//       // Fallback invoice number if counting fails
//       this.invoiceNumber = `INV${Date.now()}`;
//       console.log('Using fallback invoice number:', this.invoiceNumber);
//     }
//   } else {
//     console.log('Invoice number already exists:', this.invoiceNumber);
//   }
//   
//   // Final validation - ensure invoiceNumber is a string
//   if (typeof this.invoiceNumber !== 'string') {
//     console.error('InvoiceNumber is still not a string, forcing string conversion');
//     this.invoiceNumber = `INV${Date.now()}`;
//       }
//   
//   console.log('Final invoiceNumber:', this.invoiceNumber);
//   console.log('Final invoiceNumber type:', typeof this.invoiceNumber);
//   console.log('=== PRE-SAVE HOOK END ===');
//   
//   next();
// });

module.exports = mongoose.model('PosSale', posSaleSchema); 