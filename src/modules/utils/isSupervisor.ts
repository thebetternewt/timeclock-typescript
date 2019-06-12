import { MyContext } from '../../types/MyContext';
import { UserDepartment } from '../../entity/UserDepartment';

// Check if user is admin or supervisor of specified department.
export const isSupervisor = async (
	{ req }: MyContext,
	deptId?: string
): Promise<boolean> => {
	const { userId, isAdmin } = req.session!;

	// Always return true if user is admin.
	if (isAdmin) {
		return true;
	}

	interface SupervisorSearchParams {
		userId: string;
		supervisor: boolean;
		deptId?: string;
	}

	const searchParams: SupervisorSearchParams = { userId, supervisor: true };

	if (deptId) {
		searchParams.deptId = deptId;
	}

	const userDept = await UserDepartment.findOne(searchParams);

	if (userDept) {
		return true;
	}

	return false;
};
