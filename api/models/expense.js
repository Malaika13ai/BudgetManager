import mongoose from "mongoose"

const expenseSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    day: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    account: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Expense', expenseSchema);
