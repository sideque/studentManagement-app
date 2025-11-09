import { Request, Response } from 'express';
import EmployeeService from '../service/employeeService';
import Employee, { IEmployee } from '../model/employeeModel';

class EmployeeController {
    async getMainPage(req: Request, res: Response): Promise<void> {
        try {
            const employees = await EmployeeService.getAllEmployees();
            res.render('home', { title: 'Employee List', employees });
        } catch (error) {
            res.status(500).render('home', {
                title: 'Employee List',
                employees: [],
                message: { type: 'error', content: 'Failed to load employees' }
            });
        }
    }

    async addEmployee(req: Request, res: Response): Promise<void> {
        try {
            const { name, age, email, department, position } = req.body;
            if (!name || !email || !department || !position || !age || isNaN(parseInt(age))) {
                const employees = await EmployeeService.getAllEmployees();
                res.json({ success: false, message: 'All fields are required and must be valid.', employees });
                return;
            }

            const employeeData: Partial<IEmployee> = {
                name: name.trim(),
                age: parseInt(age),
                email: email.trim(),
                department: department.trim(),
                position: position.trim()
            };

            const existing = await Employee.findOne({ email: { $regex: new RegExp(`^${employeeData.email}$`, 'i') } });
            if (existing) {
                const employees = await EmployeeService.getAllEmployees();
                res.json({
                    success: false,
                    message: 'Duplicate employee found with same email',
                    employees
                });
                return;
            }

            await EmployeeService.addEmployee(employeeData);
            const employees = await EmployeeService.getAllEmployees();
            res.json({ success: true, employees });
        } catch (error) {
            const employees = await EmployeeService.getAllEmployees();
            res.json({ success: false, message: 'Failed to add employee', employees });
        }
    }

    async editEmployee(req: Request, res: Response): Promise<void> {
        try {
            const { id, name, age, email, department, position } = req.body;
            const updateData: Partial<IEmployee> = {
                name: name.trim(),
                age: parseInt(age),
                email: email.trim(),
                department: department.trim(),
                position: position.trim()
            };

            const existingEmployee = await Employee.findById(id);
            if (!existingEmployee) {
                res.json({ success: false, message: 'Employee not found' });
                return;
            }

            const isSame =
                existingEmployee.name === updateData.name &&
                existingEmployee.age === updateData.age &&
                existingEmployee.email === updateData.email &&
                existingEmployee.department === updateData.department &&
                existingEmployee.position === updateData.position;

            if (isSame) {
                res.json({ success: false, message: 'No changes detected' });
                return;
            }

            const existingEmail = await Employee.findOne({
                email: { $regex: new RegExp(`^${updateData.email}$`, 'i') },
                _id: { $ne: id }
            });
            if (existingEmail) {
                res.json({ success: false, message: 'Email already in use by another employee' });
                return;
            }

            await EmployeeService.updateEmployee(id, updateData);
            const employees = await EmployeeService.getAllEmployees();
            res.json({ success: true, message: 'Employee edited successfully', employees });
        } catch (error) {
            res.json({ success: false, message: 'Failed to edit employee' });
        }
    }

    async deleteEmployee(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const result = await EmployeeService.deleteEmployee(id);
            if (!result) {
                res.status(404).json({ success: false, message: 'Employee not found' });
            } else {
                const employees = await EmployeeService.getAllEmployees();
                res.status(200).json({ success: true, message: 'Employee deleted', employees });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Deletion failed' });
        }
    }

    async searchTerm(req: Request, res: Response): Promise<void> {
        try {
            const query = req.params.query;
            const employees = await EmployeeService.searchEmployees(query || '');
            res.json(employees);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Search failed' });
        }
    }
}

export default EmployeeController;