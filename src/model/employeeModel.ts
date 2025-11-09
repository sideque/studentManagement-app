import mongoose, { Schema, Document } from 'mongoose';
export interface IEmployee extends Document {
    name: string;
    age: number;
    email: string;
    department: string;
    position: string;
    createdAt: Date;
    updatedAt: Date;
}
const employeeSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 100 },
    email: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true }
}, {
    timestamps: true
});
const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);
export default Employee;