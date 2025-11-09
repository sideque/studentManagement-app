import Employee, { IEmployee } from '../model/employeeModel';
class EmployeeService {
    async getAllEmployees(): Promise<IEmployee[]> {
        return await Employee.find().sort({ updatedAt: -1, createdAt: -1 });
    }
    async addEmployee(data: Partial<IEmployee>): Promise<IEmployee> {
        const newEmployee = new Employee(data);
        return await newEmployee.save();
    }
    async updateEmployee(id: string, data: Partial<IEmployee>): Promise<IEmployee | null> {
        return await Employee.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteEmployee(id: string): Promise<IEmployee | null> {
        return await Employee.findByIdAndDelete(id);
    }
    async searchEmployees(query: string): Promise<IEmployee[]> {
        if (!query) return await Employee.find();
        return await Employee.find({
            $or: [
                { name: new RegExp(query, 'i') },
                { email: new RegExp(query, 'i') },
                { department: new RegExp(query, 'i') },
                { position: new RegExp(query, 'i') }
            ]
        });
    }
}
export default new EmployeeService();