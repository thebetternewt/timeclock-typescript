import faker from 'faker';
import { subHours } from 'date-fns';

import { gCall } from '../../../test-utils/gcall';
import { User } from '../../../entity/User';
import { Department } from '../../../entity/Department';
import { UserDepartment } from '../../../entity/UserDepartment';
import { Shift } from '../../../entity/Shift';

const userData = {
	netId: faker.random.alphaNumeric(6),
	nineDigitId: faker.helpers.replaceSymbolWithNumber('#########'),
	firstName: faker.name.firstName(),
	lastName: faker.name.lastName(),
	email: faker.internet.email(),
	dsf: false,
	admin: false,
};

let user, dept;

const clockOutMutation = `
  mutation ClockOut {
    clockOut {
      id
      timeIn
      timeOut
      minutesElapsed
      workStudy
      nightShiftMinutes
      user {
        id
        name
      }
      department {
        id
        name
      }
    }
  }
`;

describe('Clock Out', () => {
	it('clocks out the current user', async () => {
		// Create user in db
		user = await User.create(userData).save();
		console.log('user:', user);

		// Create department in db
		dept = await Department.create({ name: 'Widget Makers' }).save();

		// Add user to department
		await UserDepartment.create({ userId: user.id, deptId: dept.id }).save();

		// Create shift (currently clocked in)
		const shift = await Shift.create({
			userId: user.id,
			deptId: dept.id,
			timeIn: subHours(new Date(), 4),
		}).save();

		const result = await gCall({
			source: clockOutMutation,
			userId: user.id,
		});

		expect(result).toMatchObject({
			data: {
				clockOut: {
					id: shift.id,
				},
			},
		});

		const dbShift = await Shift.findOne(shift.id);
		expect(dbShift).toBeDefined();

		if (dbShift) {
			expect(dbShift.timeOut).toBeTruthy();
			expect(dbShift.minutesElapsed).toEqual(240);
		}
	});

	it('ends work study period when funding is depleted', () => {});
});
