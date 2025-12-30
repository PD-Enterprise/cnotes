export function validateAcademicLevel(academicLevel: string): boolean {
	if (typeof academicLevel === 'number') {
		if (academicLevel < 1 || academicLevel > 12) {
			return false;
		}
	} else if (typeof academicLevel === 'string') {
		if (academicLevel !== 'UG' && academicLevel !== 'G' && academicLevel !== 'PG') {
			return false;
		}
	}

	return true;
}
